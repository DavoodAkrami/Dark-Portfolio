import { NextResponse } from 'next/server';
import { index } from "../../../configs/pinecone";
import { generateEmbedding } from "../../../utils/embedding";
import openai from "../../../configs/openAIConfig";
import { isAdminRequest } from "@/lib/adminAuth";

export async function POST(request) {
  if (!isAdminRequest(request, { requireSameOrigin: true })) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { query, topK = 5, conversation = [] } = await request.json();

    if (typeof query !== "string" || !query.trim() || query.length > 2000) {
      return NextResponse.json({ error: 'query is required' }, { status: 400 });
    }

    const safeTopK = Math.min(10, Math.max(1, Number(topK) || 5));
    const safeConversation = Array.isArray(conversation)
      ? conversation.slice(-4).flatMap((item) =>
          item && ["user", "assistant"].includes(item.role) && typeof item.content === "string"
            ? [{ role: item.role, content: item.content.slice(0, 2000) }]
            : []
        )
      : [];

    const queryVector = await generateEmbedding(query);

    const searchResults = await index.query({
      vector: queryVector,
      topK: safeTopK,
      includeMetadata: true,
      filter: { kind: { $ne: 'sync-marker' } }
    });
    searchResults.matches = (searchResults?.matches || []).filter((m) => m.metadata?.kind !== 'sync-marker');

    const context = searchResults.matches
      .map((m, i) => `#${i + 1} [${m.score?.toFixed(3)}] ${m.metadata?.title || m.id}\n${m.metadata?.text || ''}`)
      .join('\n\n');

    const systemPrompt = `You are an assistant in Davood's portfolio. Always refer to Davood by name in third person. Never use "you" to refer to Davood. Use the following context to answer the user's question. Only use the context if it is relevant. If a context entry for a project includes a line like "Image: <url>", you may show that project's screenshot by including it in your reply as markdown: ![Project Title](url). Only ever use an image URL that appears verbatim in the context above — never invent, guess, or generate one.\n\nContext:\n${context}`;

    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL || "openai/gpt-4o-mini",
      messages: [
        { role: 'system', content: systemPrompt },
        ...safeConversation,
        { role: 'user', content: query }
      ],
      temperature: 0.3,
    });

    const answer = completion.choices?.[0]?.message?.content || '';

    return NextResponse.json({
      results: searchResults.matches,
      contextTokenCount: context.length,
      answer
    });
  } catch (error) {
    console.error('Search route error:', error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}

