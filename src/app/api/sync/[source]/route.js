import { NextResponse } from "next/server";
import { runSync, runResumeSync } from "@/utils/dataSync";
import { isAdminRequest } from "@/lib/adminAuth";

const VALID_SOURCES = ["projects", "skills", "experience", "resume"];

export async function POST(request, { params }) {
    if (!isAdminRequest(request, { requireSameOrigin: true })) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { source } = await params;

        if (!VALID_SOURCES.includes(source)) {
            return NextResponse.json({ error: `Unknown sync source: ${source}` }, { status: 400 });
        }

        const result = source === "resume" ? await runResumeSync() : await runSync(source);

        return NextResponse.json({ source, ...result });
    } catch (error) {
        console.error("Sync error:", error);
        return NextResponse.json({ error: "Sync failed" }, { status: 500 });
    }
}
