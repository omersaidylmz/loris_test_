import { PineconeClient } from "@pinecone-database/pinecone";

const client = new PineconeClient();

export async function initPinecone() {
  if (!client) return;
  await client.init({
    apiKey: process.env.PINECONE_API_KEY || "",
    environment: process.env.PINECONE_ENV || process.env.PINECONE_REGION || "",
  });
}

export function getIndex() {
  const indexName = process.env.PINECONE_INDEX_NAME || "loris-perfumes";
  // @ts-ignore
  return client.Index(indexName);
}

export async function upsertBatch(items: { id: string; vector: number[]; metadata?: any }[]) {
  const index = getIndex();
  const upserts = items.map((i) => ({ id: i.id, values: i.vector, metadata: i.metadata }));
  // Pinecone upsert
  await index.upsert({ upsertRequest: { vectors: upserts } });
}

export async function queryVector(vector: number[], topK = 10) {
  const index = getIndex();
  const query = await index.query({ queryRequest: { topK, vector, includeMetadata: true, includeValues: false } });
  // normalize matches to array
  // @ts-ignore
  return query.matches ?? [];
}
