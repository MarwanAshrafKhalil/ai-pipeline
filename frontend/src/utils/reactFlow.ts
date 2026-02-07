/**
 * Map store nodes/edges to React Flow format.
 */
import type { Node, Edge } from 'reactflow';
import type { PipelineNode, PipelineEdge, PipelineNodeData } from '@/types/pipeline';
import type { ExecutionState } from '@/types/execution';

export function toReactFlowNodes(
  nodes: PipelineNode[],
  nodeStates: Record<string, ExecutionState> = {}
): Node<PipelineNodeData & { status?: ExecutionState['status'] }>[] {
  return nodes.map((n) => ({
    id: n.id,
    type: 'pipelineNode',
    position: n.position,
    data: {
      ...n.data,
      status: nodeStates[n.id]?.status ?? 'idle',
    },
  }));
}

export function toReactFlowEdges(
  edges: PipelineEdge[],
  runningNodeId: string | null = null
): Edge<{ running?: boolean }>[] {
  return edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle ?? undefined,
    targetHandle: e.targetHandle ?? undefined,
    data: { running: runningNodeId !== null && (e.source === runningNodeId || e.target === runningNodeId) },
  }));
}

export function generateEdgeId(): string {
  return `e-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function generateNodeId(): string {
  return `n-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
