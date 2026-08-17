import express from "express";
import { initPinecone, upsertBatch } from "../services/pineconeClient.js";
import { getEmbedding } from "../services/embeddingClient.js";
import { PERFUMES } from "../../../src/data/perfumes.js"; // ts-node allows importing TS

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const token = req.headers["x-admin-token"] || req.query.token;
    if (!token || token !== process.env.ADMIN_TOKEN) return res.status(401).json({ error: "unauthorized" });

    await initPinecone();
    const items = [];
    for (const p of PERFUMES) {
      const canonical = `${p.name} | top: ${p.top_profile.join(", ")} | middle: ${p.middle_profile.join(", ")} | base: ${p.base_profile.join(", ")}`;
      const vec = await getEmbedding(canonical);
      items.push({ id: p.id, vector: vec, metadata: { name: p.name, top_profile: p.top_profile, middle_profile: p.middle_profile, base_profile: p.base_profile } });
      // batch upsert in chunks if large
    }
    await upsertBatch(items);
    res.json({ ok: true, count: items.length });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: (e as Error).message });
  }
});

export default router;
