/**
 * Zustand store: pipeline graph (nodes, edges) and execution state.
 */
import { create } from "zustand";
import type { PipelineNode, PipelineEdge } from "@/types/pipeline";
import type { ExecutionState, LogEntry } from "@/types/execution";

export interface PipelineStore {
  // Graph
  nodes: PipelineNode[];
  edges: PipelineEdge[];

  // Execution
  executionOrder: string[];
  nodeStates: Record<string, ExecutionState>;
  logs: LogEntry[];
  isRunning: boolean;

  // UI
  selectedNodeId: string | null;
  onboardingDismissed: boolean;
  connectionError: string | null;

  // Graph actions
  setNodes: (
    nodes: PipelineNode[] | ((prev: PipelineNode[]) => PipelineNode[])
  ) => void;
  setEdges: (
    edges: PipelineEdge[] | ((prev: PipelineEdge[]) => PipelineEdge[])
  ) => void;
  addNode: (node: PipelineNode) => void;
  removeNode: (id: string) => void;
  updateNode: (id: string, patch: Partial<PipelineNode>) => void;
  updateNodeLabel: (id: string, label: string) => void;
  addEdge: (edge: PipelineEdge) => void;
  removeEdge: (id: string) => void;
  setGraph: (nodes: PipelineNode[], edges: PipelineEdge[]) => void;

  // Execution actions
  setExecutionOrder: (order: string[]) => void;
  setNodeState: (nodeId: string, state: ExecutionState) => void;
  appendLog: (entry: LogEntry) => void;
  setRunning: (running: boolean) => void;
  resetExecution: () => void;
  clearLogs: () => void;

  // UI actions
  setSelectedNodeId: (id: string | null) => void;
  setOnboardingDismissed: (dismissed: boolean) => void;
  setConnectionError: (message: string | null) => void;
}

const defaultExecutionState: ExecutionState = { status: "idle" };

export const usePipelineStore = create<PipelineStore>((set) => ({
  nodes: [],
  edges: [],
  executionOrder: [],
  nodeStates: {},
  logs: [],
  isRunning: false,
  selectedNodeId: null,
  onboardingDismissed: false,
  connectionError: null,

  setNodes: (nodesOrUpdater) =>
    set((s) => ({
      nodes:
        typeof nodesOrUpdater === "function"
          ? nodesOrUpdater(s.nodes)
          : nodesOrUpdater,
    })),

  setEdges: (edgesOrUpdater) =>
    set((s) => ({
      edges:
        typeof edgesOrUpdater === "function"
          ? edgesOrUpdater(s.edges)
          : edgesOrUpdater,
    })),

  addNode: (node) =>
    set((s) => {
      const nextNodes = [...s.nodes, node];
      console.log("[pipelineStore] addNode", {
        nodeId: node.id,
        prevCount: s.nodes.length,
        nextCount: nextNodes.length,
      });
      return { nodes: nextNodes };
    }),

  removeNode: (id) =>
    set((s) => {
      const { [id]: _, ...nodeStates } = s.nodeStates;
      return {
        nodes: s.nodes.filter((n) => n.id !== id),
        edges: s.edges.filter((e) => e.source !== id && e.target !== id),
        nodeStates,
      };
    }),

  updateNode: (id, patch) =>
    set((s) => ({
      nodes: s.nodes.map((n) => (n.id === id ? { ...n, ...patch } : n)),
    })),

  updateNodeLabel: (id, label) =>
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, label } } : n
      ),
    })),

  addEdge: (edge) => set((s) => ({ edges: [...s.edges, edge] })),

  removeEdge: (id) =>
    set((s) => ({ edges: s.edges.filter((e) => e.id !== id) })),

  setGraph: (nodes, edges) => set({ nodes, edges }),

  setExecutionOrder: (executionOrder) => set({ executionOrder }),

  setNodeState: (nodeId, state) =>
    set((s) => ({
      nodeStates: { ...s.nodeStates, [nodeId]: state },
    })),

  appendLog: (entry) => set((s) => ({ logs: [...s.logs, entry] })),

  setRunning: (isRunning) => set({ isRunning }),

  resetExecution: () =>
    set((s) => {
      const nodeStates: Record<string, ExecutionState> = {};
      for (const n of s.nodes) nodeStates[n.id] = defaultExecutionState;
      return {
        executionOrder: [],
        nodeStates,
        isRunning: false,
      };
    }),

  clearLogs: () => set({ logs: [] }),

  setSelectedNodeId: (selectedNodeId) => set({ selectedNodeId }),

  setOnboardingDismissed: (onboardingDismissed) => set({ onboardingDismissed }),

  setConnectionError: (connectionError) => set({ connectionError }),
}));
