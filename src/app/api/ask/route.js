import { NextResponse } from "next/server";
import { generateEmbedding } from "@/utils/embedding";
import openai from "@/configs/openAIConfig";
import { index } from "@/configs/pinecone";
import { executeFunction, functionsDefinitions } from "@/utils/aiFunctions";

export const POST = async (request) => {
    try {
        const body = await request.json();
        const {
            message,
            topK = 5,
            model = "gpt-4o-mini",
            "experience-data": experienceDataKebab,
            experienceData: experienceDataCamel,
        } = body || {};

        const experienceData = experienceDataKebab ?? experienceDataCamel;

        if (!message || typeof message !== "string") {
            return NextResponse.json({ error: "message is required" }, { status: 400 });
        }

        let searchResults = null;
        let context = "";
        let systemPrompt = "";


        if (experienceData !== undefined && experienceData !== null && `${experienceData}`.trim() !== "") {
            const experienceText =
                typeof experienceData === "string" ? experienceData : JSON.stringify(experienceData);

            systemPrompt = `You are Davood's portfolio assistant. Answer questions about this experience: ${experienceText}.
                            For unrelated questions, respond: "I only have information about this specific experience."`;
            context = experienceText;
        } else {
            const queryVector = await generateEmbedding(message);

            searchResults = await index.query({
                vector: queryVector,
                topK: Number(topK) || 5,
                includeMetadata: true,
            });

            context = (searchResults?.matches || [])
                .map(
                    (m, i) =>
                        `#${i + 1} [${m.score?.toFixed(3)}] ${m.metadata?.title || m.id}\n${m.metadata?.text || ""}`
                )
                .join("\n\n");

            systemPrompt = `You are an assistant in Davood's portfolio. Use the following context related to Davood to answer the user's question and don't give any suggestions. Only use the context if it's relevant otherwise say I don't have that information. If the user asks you to send an email or contact Davood, call the tool \"send_email_to_davood\" with {name, email, message}.\n\nContext:\n${context}`;
        }

        const baseMessages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
        ];

        const tools = (functionsDefinitions || []).map((t) => ({
            type: 'function',
            function: {
                name: t.name,
                description: t.description,
                parameters: t.parameters,
            },
        }));

        const first = await openai.chat.completions.create({
            model,
            messages: baseMessages,
            tools,
            tool_choice: "auto",
            temperature: 0.3
        });

        const firstMsg = first.choices?.[0]?.message || {};
        const toolCalls = firstMsg.tool_calls || [];

        if (toolCalls.length > 0) {
            const followupMessages = [...baseMessages, firstMsg];

            for (const call of toolCalls) {
                const tool_call_id = call?.id;
                const functionName = call?.function?.name;
                const functionArgs = call?.function?.arguments || "{}";

                const result = await executeFunction(functionName, functionArgs);

                followupMessages.push({
                    role: "tool",
                    tool_call_id,
                    content: JSON.stringify(result)
                });
            }

            const second = await openai.chat.completions.create({
                model,
                messages: followupMessages,
                tools,
                tool_choice: "auto",
                temperature: 0.3
            });

            const finalText = second.choices?.[0]?.message?.content || '';

            return NextResponse.json({
                reply: typeof finalText === 'string' ? finalText : '',
                results: searchResults?.matches || [],
                contextTokenCount: context.length
            });
        }

        const reply = firstMsg?.content || '';

        return NextResponse.json({
            reply: typeof reply === 'string' ? reply : '',
            results: searchResults?.matches || [],
            contextTokenCount: context.length
        });
    } catch (error) {
        console.error('ASK route error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}