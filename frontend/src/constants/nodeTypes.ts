/**
 * Fixed node type order for DAG validation.
 * Data Source → Transformer → Model → Sink
 */
import type { NodeTypeKind } from "@/types/node";

export const NODE_TYPE_ORDER: NodeTypeKind[] = [
  "data_source",
  "transformer",
  "model",
  "sink",
];
