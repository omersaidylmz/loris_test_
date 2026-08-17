import "dotenv/config";
import { initPinecone, upsertBatch } from "../src/services/pineconeClient.js";
import { getEmbedding } from "../src/services/embeddingClient.js";
import { PERFUMES } from "../../src/data/perfumes.js";

async function run() {
  await initPinecone();
  const items = [];
  for (const p of PERFUMES) {
    const text = `${p.name} | top: ${p.top_profile.join(", ")} | middle: ${p.middle_profile.join(", ")} | base: ${p.base_profile.join(", ")}`;
    const vec = await getEmbedding(text);
    items.push({ id: p.id, vector: vec, metadata: { name: p.name, top_profile: p.top_profile, middle_profile: p.middle_profile, base_profile: p.base_profile } });
    if (items.length >= 50) {
      await upsertBatch(items.splice(0));
    }
  }
  if (items.length) await upsertBatch(items);
  console.log("Reindex completed");
}

run().catch((e) => { console.error(e); process.exit(1); });
