import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";

export async function GET(request) {
  const authenticated = isAdminRequest(request);
  return NextResponse.json(
    { authenticated },
    { status: authenticated ? 200 : 401, headers: { "Cache-Control": "no-store" } }
  );
}
