import { Router } from "express";
import { readFile } from "fs/promises";
import path from "path";
import nodeTypes from "../data/nodeTypes.json";

const router = Router();

/** GET /api/nodes - returns node types with 1s delay */
router.get("/nodes", async (_req, res) => {
  await new Promise((r) => setTimeout(r, 1000));
  try {
    res.json(nodeTypes);
  } catch {
    res.status(500).json({ error: "Failed to load node types" });
  }
});

export { router as nodesRouter };
