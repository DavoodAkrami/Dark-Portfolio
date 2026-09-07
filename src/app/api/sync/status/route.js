import { NextResponse } from "next/server";
import { getSyncStatus } from "@/utils/dataSync";
import { isAdminRequest } from "@/lib/adminAuth";

export async function GET(request) {
    if (!isAdminRequest(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const status = await getSyncStatus();
        return NextResponse.json({ status });
    } catch (error) {
        console.error("Sync status error:", error);
        return NextResponse.json({ error: "Unable to read sync status" }, { status: 500 });
    }
}
