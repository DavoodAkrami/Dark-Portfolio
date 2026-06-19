import { NextResponse } from "next/server";
import { runSync, runResumeSync } from "@/utils/dataSync";

const VALID_SOURCES = ["projects", "skills", "experience", "resume"];

export async function POST(request, { params }) {
    try {
        const { source } = await params;

        if (!VALID_SOURCES.includes(source)) {
            return NextResponse.json({ error: `Unknown sync source: ${source}` }, { status: 400 });
        }

        const result = source === "resume" ? await runResumeSync() : await runSync(source);

        return NextResponse.json({ source, ...result });
    } catch (error) {
        console.error("Sync error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
