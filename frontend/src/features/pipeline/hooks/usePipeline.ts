import { usePipelineStore } from '../store/pipelineStore';

export function usePipeline() {
  const nodes = usePipelineStore((s) => s.nodes);
  const edges = usePipelineStore((s) => s.edges);
  const setNodes = usePipelineStore((s) => s.setNodes);
  const setEdges = usePipelineStore((s) => s.setEdges);
  const addNode = usePipelineStore((s) => s.addNode);
  const addEdge = usePipelineStore((s) => s.addEdge);
  const removeNode = usePipelineStore((s) => s.removeNode);
  const removeEdge = usePipelineStore((s) => s.removeEdge);
  const updateNodeLabel = usePipelineStore((s) => s.updateNodeLabel);
  const setGraph = usePipelineStore((s) => s.setGraph);
  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    addNode,
    addEdge,
    removeNode,
    removeEdge,
    updateNodeLabel,
    setGraph,
  };
}
