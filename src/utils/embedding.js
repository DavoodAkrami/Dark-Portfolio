import openai from "../configs/openAIConfig";


export const generateEmbedding = async (text) => {
    try {
        const response = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: text
        });

        const embedding = response?.data?.[0]?.embedding;
        if (!embedding) {
            throw new Error("Embedding response is malformed or empty");
        }

        return embedding;
    } catch (error) {
        console.error("Error creating embedding:", error);
        throw error;
    }
}