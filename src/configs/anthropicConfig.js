import Anthropic from "@anthropic-ai/sdk";


const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    baseURL: process.env.ANTHROPIC_BASE_URL,
    dangerouslyAllowBrowser: true,
})

export default anthropic;
