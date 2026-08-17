import express from "express";
import dotenv from "dotenv";
import searchRouter from "./routes/search.js";
import parseRouter from "./routes/parse.js";
import reindexRouter from "./routes/reindex.js";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/search", searchRouter);
app.use("/api/parse", parseRouter);
app.use("/api/reindex", reindexRouter);

const port = Number(process.env.PORT || 8080);
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
