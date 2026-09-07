import { index } from "../../../configs/pinecone";
import { generateEmbedding } from "../../../utils/embedding";
import { NextResponse } from 'next/server';
import { isAdminRequest } from "@/lib/adminAuth";

export async function POST(request) {
  if (!isAdminRequest(request, { requireSameOrigin: true })) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, text, metadata } = await request.json();

    if (typeof id !== "string" || !id.trim() || id.length > 128 || typeof text !== "string" || !text.trim() || text.length > 20000) {
      return NextResponse.json(
        { error: "A valid id and text are required" },
        { status: 400 }
      );
    }
    if (metadata !== undefined && (typeof metadata !== "object" || metadata === null || Array.isArray(metadata) || JSON.stringify(metadata).length > 30000)) {
      return NextResponse.json({ error: "Invalid metadata" }, { status: 400 });
    }

    const vector = await generateEmbedding(text);

    await index.upsert([
      {
        id,
        values: vector,
        metadata: {
          ...(metadata || {}),
          text
        }
      },
    ]);

    return NextResponse.json({ 
      message: "Data upserted successfully!",
      id: id,
      vectorLength: vector.length
    });
  } catch (error) {
    console.error("Upsert error:", error);
    return NextResponse.json(
      { error: "Upsert failed" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const topK = Math.min(100, Math.max(1, parseInt(searchParams.get('topK')) || 5));

    if (!query) {
      return NextResponse.json(
        { error: "query parameter is required" },
        { status: 400 }
      );
    }

    const queryVector = await generateEmbedding(query);

    const searchResults = await index.query({
      vector: queryVector,
      topK: topK,
      includeMetadata: true
    });

    return NextResponse.json({
      results: searchResults.matches,
      query: query
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
        { error: "Failed to search data" },
      { status: 500 }
    );
  }
}
