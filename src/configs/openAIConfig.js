import "server-only";
import OpenAI from "openai";

let openai;

export function getOpenAI() {
    if (openai) return openai;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("Missing OPENAI_API_KEY");
    const baseURL = process.env.OPENAI_BASE_URL?.trim() || undefined;

    openai = new OpenAI({
        apiKey,
        ...(baseURL ? { baseURL } : {}),
        maxRetries: 1,
        timeout: 20000,
    });

    return openai;
}
