/**
 * Pipeline graph domain models (store shape; can be mapped to React Flow).
 */

import { NodeTypeKind } from "./node";

export interface PipelineNodeData {
  typeId: string;
  label: string;
  nodeTypeKind: NodeTypeKind;
}

export interface PipelineNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: PipelineNodeData;
}

export interface PipelineEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
}

export interface PipelineGraph {
  nodes: PipelineNode[];
  edges: PipelineEdge[];
}
