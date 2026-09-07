import { NextResponse } from 'next/server';
import { index } from "../../../configs/pinecone";
import { generateEmbedding } from "../../../utils/embedding";
import { isAdminRequest } from "@/lib/adminAuth";

export async function POST(request) {
  if (!isAdminRequest(request, { requireSameOrigin: true })) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { topK = 100, seed = "list" } = await request.json().catch(() => ({ topK: 100, seed: "list" }));
    const safeSeed = typeof seed === "string" && seed.length ? seed.slice(0, 500) : "list";
    const safeTopK = Math.min(100, Math.max(1, Number(topK) || 100));
    const vector = await generateEmbedding(safeSeed);
    const results = await index.query({
      vector,
      topK: safeTopK,
      includeMetadata: true,
      filter: { kind: { $ne: "sync-marker" } }
    });
    const matches = (results?.matches || []).filter((m) => m.metadata?.kind !== "sync-marker");
    return NextResponse.json({ results: matches });
  } catch (error) {
    console.error("List route failed", error);
    return NextResponse.json({ error: "List failed" }, { status: 500 });
  }
}
