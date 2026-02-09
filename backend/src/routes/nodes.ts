import { Router } from "express";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** GET /api/nodes - returns node types with 1s delay */
router.get("/nodes", async (_req, res) => {
  await new Promise((r) => setTimeout(r, 1000));
  try {
    const dataPath = path.join(__dirname, "..", "data", "nodeTypes.json");
    const raw = await readFile(dataPath, "utf-8");
    const nodeTypes = JSON.parse(raw);
    res.json(nodeTypes);
  } catch (err) {
    console.error("[GET /api/nodes]", err);
    res.status(500).json({ error: "Failed to load node types" });
  }
});

export { router as nodesRouter };
