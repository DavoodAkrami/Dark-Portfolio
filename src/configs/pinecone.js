import { Pinecone } from "@pinecone-database/pinecone";

const client = new Pinecone({
  apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY,
});

export const index = client.Index(process.env.NEXT_PUBLIC_PINECONE_INDEX); 