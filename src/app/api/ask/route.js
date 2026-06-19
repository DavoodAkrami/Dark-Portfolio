import { NextResponse } from "next/server";
import { generateEmbedding } from "@/utils/embedding";
import openai from "@/configs/openAIConfig";
import { index } from "@/configs/pinecone";
import { executeFunction, functionsDefinitions } from "@/utils/aiFunctions";

async function buildContext(message, topK, experienceData) {
  let searchResults = null;
  let context = "";
  let systemPrompt = "";

  if (experienceData !== undefined && experienceData !== null && `${experienceData}`.trim() !== "") {
    const experienceText =
      typeof experienceData === "string" ? experienceData : JSON.stringify(experienceData);
    systemPrompt = `You are Davood's portfolio assistant. Always refer to Davood by name in third person. Never use "you" to refer to Davood. Answer questions about this experience: ${experienceText}. For unrelated questions, respond: "I only have information about this specific experience."`;
    context = experienceText;
  } else {
    const queryVector = await generateEmbedding(message);
    searchResults = await index.query({
      vector: queryVector,
      topK: Number(topK) || 5,
      includeMetadata: true,
      filter: { kind: { $ne: "sync-marker" } },
    });
    searchResults.matches = (searchResults?.matches || []).filter((m) => m.metadata?.kind !== "sync-marker");
    context = searchResults.matches
      .map(
        (m, i) =>
          `#${i + 1} [${m.score?.toFixed(3)}] ${m.metadata?.title || m.id}\n${m.metadata?.text || ""}`
      )
      .join("\n\n");
    systemPrompt = `You are an assistant in Davood's portfolio. Always refer to Davood by name in third person. Never use "you" to refer to Davood. Use the following context related to Davood to answer the user's question and don't give any suggestions. Only use the context if it's relevant otherwise say I don't have that information. If the user asks you to send an email or contact Davood, call the tool "send_email_to_davood" with {name, email, message}. If a context entry for a project includes a line like "Image: <url>", you may show that project's screenshot by including it in your reply as markdown: ![Project Title](url). Only ever use an image URL that appears verbatim in the context above — never invent, guess, or generate one, and never mention an image if no URL is present for that project.\n\nContext:\n${context}`;
  }

  return { searchResults, context, systemPrompt };
}

function buildTools() {
  return (functionsDefinitions || []).map((t) => ({
    type: "function",
    function: {
      name: t.name,
      description: t.description,
      parameters: t.parameters,
    },
  }));
}

export const POST = async (request) => {
  try {
    const body = await request.json();
    const {
      message,
      topK = 5,
      model,
      stream = false,
      conversation = [],
      "experience-data": experienceDataKebab,
      experienceData: experienceDataCamel,
    } = body || {};

    const aiModel = typeof model === "string" ? model : "gpt-4o-mini";
    const experienceData = experienceDataKebab ?? experienceDataCamel;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    const { searchResults, context, systemPrompt } = await buildContext(message, topK, experienceData);
    const tools = buildTools();

    const recentConversation = (conversation || []).slice(-4);
    const messages = [
      { role: "system", content: systemPrompt },
      ...recentConversation,
      { role: "user", content: message },
    ];

    if (!stream) {
      const first = await openai.chat.completions.create({
        model: aiModel,
        messages,
        tools,
        tool_choice: "auto",
        temperature: 0.3,
      });

      const firstChoice = first.choices[0];

      if (firstChoice.finish_reason === "tool_calls") {
        const toolCalls = firstChoice.message.tool_calls || [];

        const toolResults = [];
        for (const call of toolCalls) {
          const args =
            typeof call.function.arguments === "string"
              ? JSON.parse(call.function.arguments)
              : call.function.arguments;
          const result = await executeFunction(call.function.name, args);
          toolResults.push({
            role: "tool",
            tool_call_id: call.id,
            content: JSON.stringify(result),
          });
        }

        const followupMessages = [
          ...messages,
          firstChoice.message,
          ...toolResults,
        ];

        const second = await openai.chat.completions.create({
          model: aiModel,
          messages: followupMessages,
          tools,
          tool_choice: "auto",
          temperature: 0.3,
        });

        const finalText = second.choices[0]?.message?.content || "";

        return NextResponse.json({
          reply: finalText,
          results: searchResults?.matches || [],
          contextTokenCount: context.length,
        });
      }

      const reply = firstChoice.message?.content || "";

      return NextResponse.json({
        reply,
        results: searchResults?.matches || [],
        contextTokenCount: context.length,
      });
    }

    // Streaming mode
    const encoder = new TextEncoder();
    const customStream = new ReadableStream({
      async start(controller) {
        try {
          const firstStream = await openai.chat.completions.create({
            model: aiModel,
            messages,
            tools,
            tool_choice: "auto",
            stream: true,
            temperature: 0.3,
          });

          let toolCallsAcc = {};
          let contentBuffer = "";

          for await (const chunk of firstStream) {
            const delta = chunk.choices[0]?.delta;

            if (delta?.tool_calls) {
              for (const tc of delta.tool_calls) {
                const idx = tc.index;
                if (!toolCallsAcc[idx]) {
                  toolCallsAcc[idx] = { id: "", function: { name: "", arguments: "" } };
                }
                if (tc.id) toolCallsAcc[idx].id += tc.id;
                if (tc.function?.name) toolCallsAcc[idx].function.name += tc.function.name;
                if (tc.function?.arguments) toolCallsAcc[idx].function.arguments += tc.function.arguments;
              }
            }

            if (delta?.content) {
              contentBuffer += delta.content;
              controller.enqueue(encoder.encode(JSON.stringify({ type: "chunk", text: delta.content }) + "\n"));
            }

            const finishReason = chunk.choices[0]?.finish_reason;

            if (finishReason === "tool_calls" || finishReason === "stop") {
              if (finishReason === "tool_calls") {
                const toolCalls = Object.values(toolCallsAcc);
                const toolResults = [];
                for (const call of toolCalls) {
                  const args = JSON.parse(call.function.arguments);
                  const result = await executeFunction(call.function.name, args);
                  toolResults.push({
                    role: "tool",
                    tool_call_id: call.id,
                    content: JSON.stringify(result),
                  });
                  controller.enqueue(encoder.encode(JSON.stringify({ type: "tool_result", result }) + "\n"));
                }

                const assistantMsg = { role: "assistant", content: contentBuffer || null, tool_calls: Object.values(toolCallsAcc) };
                const followupMessages = [...messages, assistantMsg, ...toolResults];

                const secondStream = await openai.chat.completions.create({
                  model: aiModel,
                  messages: followupMessages,
                  tools,
                  stream: true,
                  temperature: 0.3,
                });

                for await (const chunk2 of secondStream) {
                  if (chunk2.choices[0]?.delta?.content) {
                    controller.enqueue(encoder.encode(JSON.stringify({ type: "chunk", text: chunk2.choices[0].delta.content }) + "\n"));
                  }
                }
              }

              controller.enqueue(encoder.encode(JSON.stringify({ type: "done" }) + "\n"));
              controller.close();
              return;
            }
          }
        } catch (streamErr) {
          console.error("Stream error:", streamErr);
          controller.enqueue(encoder.encode(JSON.stringify({ type: "error", text: streamErr.message }) + "\n"));
          controller.close();
        }
      },
    });

    return new Response(customStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("ASK route error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
