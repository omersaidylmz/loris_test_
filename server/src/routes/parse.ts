import express from "express";
import { extractNotesFromText } from "../services/llmClient.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "text required" });
    const notes = await extractNotesFromText(text);
    res.json({ notes });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

export default router;
