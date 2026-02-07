/**
 * Connection validation: self-loop, type order, cycle.
 * Pure functions; used from onConnect and validate-graph.
 */
import { canConnect } from '@/shared/constants/nodeTypes';
import type { NodeTypeKind } from '@/types/node';
import { hasCycle } from './cycleDetection';

export interface GraphContext {
  nodes: { id: string; data?: { nodeTypeKind?: string } }[];
  edges: { source: string; target: string }[];
}

export interface CandidateEdge {
  source: string;
  target: string;
}

export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

function getNodeTypeKind(
  nodes: GraphContext['nodes'],
  nodeId: string
): NodeTypeKind | undefined {
  const n = nodes.find((x) => x.id === nodeId);
  const kind = n?.data?.nodeTypeKind;
  return kind as NodeTypeKind | undefined;
}

export function validateConnection(
  context: GraphContext,
  candidate: CandidateEdge
): ValidationResult {
  const { nodes, edges } = context;
  if (candidate.source === candidate.target) {
    return { valid: false, reason: 'Self-connection is not allowed' };
  }
  const sourceKind = getNodeTypeKind(nodes, candidate.source);
  const targetKind = getNodeTypeKind(nodes, candidate.target);
  if (sourceKind == null || targetKind == null) {
    return { valid: false, reason: 'Unknown node type' };
  }
  if (!canConnect(sourceKind, targetKind)) {
    return {
      valid: false,
      reason: `Invalid connection order: ${sourceKind} cannot connect to ${targetKind}`,
    };
  }
  const nodeIds = nodes.map((n) => n.id);
  const edgesWithNew = [...edges, { source: candidate.source, target: candidate.target }];
  if (hasCycle(nodeIds, edgesWithNew)) {
    return { valid: false, reason: 'Connection would create a cycle' };
  }
  return { valid: true };
}
