import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getEmbedding(text: string): Promise<number[]> {
  const model = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";
  const resp = await openai.embeddings.create({
    model,
    input: text,
  });
  // @ts-ignore
  return resp.data[0].embedding as number[];
}
