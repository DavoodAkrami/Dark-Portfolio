import { NextResponse } from 'next/server';
import { index } from "../../../configs/pinecone";
import { generateEmbedding } from "../../../utils/embedding";

export async function POST(request) {
  try {
    const { topK = 100, seed = "list" } = await request.json().catch(() => ({ topK: 100, seed: "list" }));
    const vector = await generateEmbedding(typeof seed === 'string' && seed.length ? seed : "list");
    const results = await index.query({
      vector,
      topK: Number(topK) || 100,
      includeMetadata: true
    });
    return NextResponse.json({ results: results?.matches || [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
