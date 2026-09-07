import openai from "../configs/openAIConfig";


export const generateEmbedding = async (text) => {
    try {
        if (typeof text !== "string" || !text.trim() || text.length > 20000) {
            throw new Error("Embedding input must be between 1 and 20000 characters");
        }
        const response = await openai.embeddings.create({
            model: "openai/text-embedding-3-small",
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
