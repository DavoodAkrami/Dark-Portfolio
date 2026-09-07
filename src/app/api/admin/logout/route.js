import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isAdminRequest } from "@/lib/adminAuth";

export async function POST(request) {
  if (!isAdminRequest(request, { requireSameOrigin: true })) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
