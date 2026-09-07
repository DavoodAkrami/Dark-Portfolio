import { NextResponse } from "next/server";
import { generateEmbedding } from "@/utils/embedding";
import openai from "@/configs/openAIConfig";
import { index } from "@/configs/pinecone";
import { isSameOrigin } from "@/lib/adminAuth";
import { checkRateLimit } from "@/lib/rateLimit";

const MAX_MESSAGE_LENGTH = 2000;
const MAX_EXPERIENCE_LENGTH = 12000;
const MAX_CONVERSATION_MESSAGE_LENGTH = 2000;

function sanitizeConversation(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(-4).flatMap((item) =>
    item && ["user", "assistant"].includes(item.role) && typeof item.content === "string"
      ? [{ role: item.role, content: item.content.slice(0, MAX_CONVERSATION_MESSAGE_LENGTH) }]
      : []
  );
}
async function buildContext(message, topK, experienceData) {
  if (typeof experienceData === "string" && experienceData.trim()) {
    const experienceText = experienceData.slice(0, MAX_EXPERIENCE_LENGTH);
    return `You are Davood's portfolio assistant. Always refer to Davood by name in third person. Never use "you" to refer to Davood. Answer questions about this experience: ${experienceText}. For unrelated questions, respond: "I only have information about this specific experience."`;
  }

  const queryVector = await generateEmbedding(message);
  const searchResults = await index.query({
    vector: queryVector,
    topK,
    includeMetadata: true,
    filter: { kind: { $ne: "sync-marker" } },
  });
  const context = (searchResults?.matches || [])
    .filter((match) => match.metadata?.kind !== "sync-marker")
    .map(
      (match, indexPosition) =>
        `#${indexPosition + 1} ${match.metadata?.title || match.id}\n${match.metadata?.text || ""}`
    )
    .join("\n\n")
    .slice(0, 16000);

  return `You are an assistant in Davood's portfolio. Always refer to Davood by name in third person. Never use "you" to refer to Davood. Use the following context related to Davood to answer the user's question and don't give any suggestions. Only use the context if it's relevant; otherwise say you don't have that information. If a context entry for a project includes a line like "Image: <url>", you may show that project's screenshot as markdown only when that exact URL is present in the context.\n\nContext:\n${context}`;
}

export async function POST(request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }

  const rate = checkRateLimit(request, {
    keyPrefix: "public-ai",
    limit: 20,
    windowMs: 10 * 60 * 1000,
  });
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } }
    );
  }

  try {
    const body = await request.json();
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    if (!message || message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: "Message must be between 1 and 2000 characters" }, { status: 400 });
    }

    const experienceData = body?.["experience-data"] ?? body?.experienceData;
    if (experienceData !== undefined && typeof experienceData !== "string") {
      return NextResponse.json({ error: "Invalid experience data" }, { status: 400 });
    }

    const topK = Math.min(8, Math.max(1, Number(body?.topK) || 5));
    const systemPrompt = await buildContext(message, topK, experienceData);
    const messages = [
      { role: "system", content: systemPrompt },
      ...sanitizeConversation(body?.conversation),
      { role: "user", content: message },
    ];
    const model = process.env.AI_MODEL || "openai/gpt-4o-mini";

    if (body?.stream !== true) {
      const completion = await openai.chat.completions.create({
        model,
        messages,
        temperature: 0.3,
        max_tokens: 500,
      });
      return NextResponse.json({ reply: completion.choices[0]?.message?.content || "" });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const completionStream = await openai.chat.completions.create({
            model,
            messages,
            stream: true,
            temperature: 0.3,
            max_tokens: 500,
          });

          for await (const chunk of completionStream) {
            const text = chunk.choices[0]?.delta?.content;
            if (text) {
              controller.enqueue(encoder.encode(`${JSON.stringify({ type: "chunk", text })}\n`));
            }
          }
          controller.enqueue(encoder.encode(`${JSON.stringify({ type: "done" })}\n`));
        } catch (error) {
          console.error("AI stream failed", error);
          controller.enqueue(encoder.encode(`${JSON.stringify({ type: "error", text: "The AI request failed" })}\n`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-store",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Ask route failed", error);
    return NextResponse.json({ error: "The AI request failed" }, { status: 500 });
  }
}
