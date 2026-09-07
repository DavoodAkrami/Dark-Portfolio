import { NextResponse } from 'next/server';
import { index } from "../../../configs/pinecone";
import { generateEmbedding } from "../../../utils/embedding";
import { isAdminRequest } from "@/lib/adminAuth";

export async function POST(request) {
  if (!isAdminRequest(request, { requireSameOrigin: true })) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, text, metadata } = await request.json();
    if (typeof id !== "string" || !id.trim() || id.length > 128) {
      return NextResponse.json({ error: "A valid id is required" }, { status: 400 });
    }
    if (text !== undefined && (typeof text !== "string" || text.length > 20000)) {
      return NextResponse.json({ error: "Invalid text" }, { status: 400 });
    }
    if (metadata !== undefined && (typeof metadata !== "object" || metadata === null || Array.isArray(metadata) || JSON.stringify(metadata).length > 30000)) {
      return NextResponse.json({ error: "Invalid metadata" }, { status: 400 });
    }
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
    console.error("Edit route failed", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

