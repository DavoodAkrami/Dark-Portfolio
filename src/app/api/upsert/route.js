import { index } from "../../../configs/pinecone";
import { generateEmbedding } from "../../../utils/embedding";
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { id, text, metadata } = await request.json();

    if (!id || !text) {
      return NextResponse.json(
        { error: "id and text are required" },
        { status: 400 }
      );
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
      { error: error.message, details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const topK = parseInt(searchParams.get('topK')) || 5;

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
      { error: "Failed to search data", details: error.message },
      { status: 500 }
    );
  }
}
