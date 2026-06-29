import { NextResponse } from 'next/server';
import { index } from "../../../configs/pinecone";
import { generateEmbedding } from "../../../utils/embedding";
import openai from "../../../configs/openAIConfig";

export async function POST(request) {
  try {
    const { query, topK = 5, model = "gpt-4o-mini", conversation = [] } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'query is required' }, { status: 400 });
    }

    const queryVector = await generateEmbedding(query);

    const searchResults = await index.query({
      vector: queryVector,
      topK: Number(topK) || 5,
      includeMetadata: true,
      filter: { kind: { $ne: 'sync-marker' } }
    });
    searchResults.matches = (searchResults?.matches || []).filter((m) => m.metadata?.kind !== 'sync-marker');

    const context = searchResults.matches
      .map((m, i) => `#${i + 1} [${m.score?.toFixed(3)}] ${m.metadata?.title || m.id}\n${m.metadata?.text || ''}`)
      .join('\n\n');

    const systemPrompt = `You are an assistant in Davood's portfolio. Always refer to Davood by name in third person. Never use "you" to refer to Davood. Use the following context to answer the user's question. Only use the context if it is relevant. If a context entry for a project includes a line like "Image: <url>", you may show that project's screenshot by including it in your reply as markdown: ![Project Title](url). Only ever use an image URL that appears verbatim in the context above — never invent, guess, or generate one.\n\nContext:\n${context}`;

    const recentConversation = (conversation || []).slice(-4);
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...recentConversation,
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


