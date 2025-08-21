import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const baseUrl = process.env.OPENAI_BASE_URL;
    
    if (!apiKey) {
      console.error("Missing OpenAI API key");
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const { message } = await req.json();
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: baseUrl || "https://api.openai.com/v1",
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [{ role: "user", content: message }],
      stream: false,
      max_tokens: 500,
    });

    return NextResponse.json({ reply: completion.choices[0].message.content });
    
  } catch (error: any) {
    console.error("API Error:", error);
    
    if (error.status === 401) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    } else if (error.status === 429) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }
    
    return NextResponse.json({ error: "Failed to get response" }, { status: 500 });
  }
}
