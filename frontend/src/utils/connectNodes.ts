import { NODE_TYPE_ORDER } from "@/constants/nodeTypes";
import { NodeTypeKind } from "@/types/node";

export function getNodeTypeOrderIndex(kind: NodeTypeKind): number {
  const idx = NODE_TYPE_ORDER.indexOf(kind);
  return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
}

export function canConnect(
  sourceKind: NodeTypeKind,
  targetKind: NodeTypeKind,
): boolean {
  return getNodeTypeOrderIndex(sourceKind) < getNodeTypeOrderIndex(targetKind);
}
