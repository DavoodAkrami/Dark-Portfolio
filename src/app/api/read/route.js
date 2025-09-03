import { NextResponse } from 'next/server';
import { index } from "../../../configs/pinecone";

export async function POST(request) {
  try {
    const { ids } = await request.json();
    if (!ids || !Array.isArray(ids) || ids.length === 0) return NextResponse.json({ error: "ids array is required" }, { status: 400 });
    const result = await index.fetch(ids);
    return NextResponse.json({ vectors: result?.vectors || {} });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


