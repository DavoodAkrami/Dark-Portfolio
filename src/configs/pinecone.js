import "server-only";
import { Pinecone } from "@pinecone-database/pinecone";

if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX_NAME) {
  throw new Error("Missing Pinecone server configuration");
}

const client = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

export const index = client.Index(process.env.PINECONE_INDEX_NAME);
