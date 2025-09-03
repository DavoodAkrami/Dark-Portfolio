import { NextResponse } from 'next/server';
import { index } from "../../../configs/pinecone";
import { generateEmbedding } from "../../../utils/embedding";
import openai from "../../../configs/openAIConfig";

export async function POST(request) {
  try {
    const { query, topK = 5, model = "gpt-4o-mini" } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'query is required' }, { status: 400 });
    }

    const queryVector = await generateEmbedding(query);

    const searchResults = await index.query({
      vector: queryVector,
      topK: Number(topK) || 5,
      includeMetadata: true
    });

    const context = (searchResults?.matches || [])
      .map((m, i) => `#${i + 1} [${m.score?.toFixed(3)}] ${m.metadata?.title || m.id}\n${m.metadata?.text || ''}`)
      .join('\n\n');

    const systemPrompt = `You are a helpful assistant. Use the following context to answer the user's question. Only use the context if it is relevant.\n\nContext:\n${context}`;

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query }
      ],
      temperature: 0.3
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


