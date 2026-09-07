import { NextResponse } from 'next/server';
import { index } from "../../../configs/pinecone";
import { isAdminRequest } from "@/lib/adminAuth";

export async function POST(request) {
  if (!isAdminRequest(request, { requireSameOrigin: true })) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    if (typeof id !== "string" || !id.trim() || id.length > 128) {
      return NextResponse.json({ error: "A valid id is required" }, { status: 400 });
    }
    await index.delete1 ? index.delete1([id]) : index.deleteOne ? index.deleteOne(id) : index.delete({ ids: [id] });
    return NextResponse.json({ message: "Deleted", id });
  } catch (error) {
    console.error("Delete route failed", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

