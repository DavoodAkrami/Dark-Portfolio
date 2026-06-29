import { NextResponse } from "next/server";
import { getSyncStatus } from "@/utils/dataSync";

export async function GET() {
    try {
        const status = await getSyncStatus();
        return NextResponse.json({ status });
    } catch (error) {
        console.error("Sync status error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
