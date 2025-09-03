import { NextResponse } from 'next/server';
import { index } from "../../../configs/pinecone";

export async function POST(request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
    await index.delete1 ? index.delete1([id]) : index.deleteOne ? index.deleteOne(id) : index.delete({ ids: [id] });
    return NextResponse.json({ message: "Deleted", id });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


