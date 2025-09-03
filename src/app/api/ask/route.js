import { NextResponse } from "next/server";
import { generateEmbedding } from "@/utils/embedding";
import openai from "@/configs/openAIConfig";
import { index } from "@/configs/pinecone";

export const POST = async (request) => {
    try {
        const { message, topK = 5, model = "gpt-4o-mini" } = await request.json();

        if (!message || typeof message !== "string") {
            return NextResponse.json({ error: "message is required" }, { status: 400 });
        }

        const queryVector = await generateEmbedding(message);

        const searchResults = await index.query({
            vector: queryVector,
            topK: Number(topK) || 5,
            includeMetadata: true
        });

        const context = (searchResults?.matches || [])
            .map((m, i) => `#${i + 1} [${m.score?.toFixed(3)}] ${m.metadata?.title || m.id}\n${m.metadata?.text || ''}`)
            .join('\n\n');

        const systemPrompt = `You are an assistant in Davood's portfolio. Use the following context related to Davood to answer the user's question. Only use the context if it is relevant.\n\nContext:\n${context}`;
        const completion = await openai.chat.completions.create({
            model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
            ],
            temperature: 0.3
        });

        const reply = completion.choices?.[0]?.message?.content || '';

        return NextResponse.json({
            reply,
            results: searchResults?.matches || [],
            contextTokenCount: context.length
        });
    } catch (error) {
        console.error('ASK route error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}