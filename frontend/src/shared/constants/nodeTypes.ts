/**
 * Fixed node type order for DAG validation.
 * Data Source → Transformer → Model → Sink
 */
import type { NodeTypeKind } from '@/types/node';

export const NODE_TYPE_ORDER: NodeTypeKind[] = [
  'data_source',
  'transformer',
  'model',
  'sink',
];

export function getNodeTypeOrderIndex(kind: NodeTypeKind): number {
  const idx = NODE_TYPE_ORDER.indexOf(kind);
  return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
}

export function canConnect(sourceKind: NodeTypeKind, targetKind: NodeTypeKind): boolean {
  return getNodeTypeOrderIndex(sourceKind) < getNodeTypeOrderIndex(targetKind);
}
