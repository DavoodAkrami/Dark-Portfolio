import { NextResponse } from 'next/server';
import { index } from "../../../configs/pinecone";
import { isAdminRequest } from "@/lib/adminAuth";

export async function POST(request) {
  if (!isAdminRequest(request, { requireSameOrigin: true })) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { ids } = await request.json();
    if (!Array.isArray(ids) || ids.length === 0 || ids.length > 100 || ids.some((id) => typeof id !== "string" || !id || id.length > 128)) {
      return NextResponse.json({ error: "A valid ids array is required" }, { status: 400 });
    }
    const result = await index.fetch(ids);
    return NextResponse.json({ vectors: result?.vectors || {} });
  } catch (error) {
    console.error("Read route failed", error);
    return NextResponse.json({ error: "Read failed" }, { status: 500 });
  }
}

