import "server-only";
import OpenAI from "openai";

const gatewayToken = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN;

if (!gatewayToken) {
    throw new Error("Missing AI Gateway credentials");
}

const openai = new OpenAI({
    apiKey: gatewayToken,
    baseURL: "https://ai-gateway.vercel.sh/v1",
    maxRetries: 1,
    timeout: 20000,
})

export default openai;
