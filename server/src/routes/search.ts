import express from "express";
import { getEmbedding } from "../services/embeddingClient.js";
import { initPinecone, queryVector } from "../services/pineconeClient.js";
import { combineScores, computeOverlapScore } from "../services/scorer.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { selectedProfiles = [], gender = "maskulen", topK = 10, freeText = null } = req.body;
    const queryText = freeText ? freeText : selectedProfiles.join(", ");
    if (!queryText) return res.status(400).json({ error: "Empty query" });

    await initPinecone();
    const emb = await getEmbedding(queryText);
    // @ts-ignore
    const matches = await queryVector(emb, topK);

    const candidates = (matches || []).map((m: any) => {
      const metadata = m.metadata || {};
      const sim = m.score ?? 0;
      const overlap = computeOverlapScore(selectedProfiles, metadata);
      const genderMatch = metadata.name?.toLowerCase().includes(gender === "maskulen" ? "erkek" : "kadın");
      const combined = combineScores(sim, overlap, genderMatch);
      return { id: m.id, name: metadata.name, sim, overlap, combined, metadata };
    });

    candidates.sort((a: any, b: any) => b.combined - a.combined);
    res.json({ candidates });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: (e as Error).message });
  }
});

export default router;
