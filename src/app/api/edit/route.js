import { NextResponse } from 'next/server';
import { index } from "../../../configs/pinecone";
import { generateEmbedding } from "../../../utils/embedding";

export async function POST(request) {
  try {
    const { id, text, metadata } = await request.json();
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
    let values = undefined;
    if (typeof text === 'string' && text.length > 0) {
      values = await generateEmbedding(text);
    } else {
      const fetched = await index.fetch([id]);
      const existing = fetched?.vectors?.[id]?.values;
      if (!existing) return NextResponse.json({ error: "vector not found" }, { status: 404 });
      values = existing;
    }
    await index.upsert([
      {
        id,
        values,
        metadata: metadata || {}
      }
    ]);
    return NextResponse.json({ message: "Updated", id });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


