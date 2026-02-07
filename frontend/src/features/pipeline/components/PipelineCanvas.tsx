import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  useReactFlow,
  type OnConnect,
  type NodeChange,
  type EdgeChange,
  type Node,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
import { validateConnection } from "@/lib/graph/validation";
import { usePipelineStore } from "../store/pipelineStore";
import {
  toReactFlowNodes,
  toReactFlowEdges,
  generateEdgeId,
  generateNodeId,
} from "@/utils/reactFlow";
import type { PipelineNode, PipelineEdge } from "@/types/pipeline";
import type { NodeType } from "@/types/node";
import { PipelineNodeComponent } from "./PipelineNode";
import { AnimatedEdge } from "./AnimatedEdge";

const nodeTypes = { pipelineNode: PipelineNodeComponent };
const edgeTypes = { animated: AnimatedEdge };

function CanvasInner() {
  const { screenToFlowPosition } = useReactFlow();
  const nodes = usePipelineStore((s) => s.nodes);
  const edges = usePipelineStore((s) => s.edges);
  const nodeStates = usePipelineStore((s) => s.nodeStates);
  const setNodes = usePipelineStore((s) => s.setNodes);
  const setEdges = usePipelineStore((s) => s.setEdges);
  const addEdgeToStore = usePipelineStore((s) => s.addEdge);
  const addNodeToStore = usePipelineStore((s) => s.addNode);
  const setConnectionError = usePipelineStore((s) => s.setConnectionError);

  const runningNodeId =
    Object.entries(nodeStates).find(([, s]) => s.status === "running")?.[0] ??
    null;
  const reactFlowNodes = useMemo(
    () => toReactFlowNodes(nodes, nodeStates),
    [nodes, nodeStates]
  );
  const reactFlowEdges = useMemo(
    () =>
      toReactFlowEdges(edges, runningNodeId).map((e) => ({
        ...e,
        type: "animated" as const,
      })),
    [edges, runningNodeId]
  );

  const onConnect: OnConnect = useCallback(
    (params) => {
      const result = validateConnection(
        {
          nodes: nodes.map((n) => ({
            id: n.id,
            data: { nodeTypeKind: n.data.nodeTypeKind },
          })),
          edges: edges.map((e) => ({ source: e.source, target: e.target })),
        },
        { source: params.source ?? "", target: params.target ?? "" }
      );
      if (!result.valid) {
        setConnectionError(result.reason ?? "Invalid connection");
        return;
      }
      setConnectionError(null);
      const newEdge: PipelineEdge = {
        id: generateEdgeId(),
        source: params.source ?? "",
        target: params.target ?? "",
        sourceHandle: params.sourceHandle ?? null,
        targetHandle: params.targetHandle ?? null,
      };
      addEdgeToStore(newEdge);
    },
    [nodes, edges, addEdgeToStore, setConnectionError]
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const state = usePipelineStore.getState();
      const currentFlowNodes = toReactFlowNodes(state.nodes, state.nodeStates);
      const nextNodes = applyNodeChanges(
        changes,
        currentFlowNodes as Node<unknown>[]
      ) as Node<{ typeId: string; label: string; nodeTypeKind: string }>[];
      if (nextNodes.length < currentFlowNodes.length) {
        const removedIds = new Set(
          (changes as Array<{ type: string; id?: string }>)
            .filter((c) => c.type === "remove" && c.id)
            .map((c) => c.id as string)
        );
        const currentIds = new Set(currentFlowNodes.map((n) => n.id));
        const nextIds = new Set(nextNodes.map((n) => n.id));
        const missingIds = [...currentIds].filter((id) => !nextIds.has(id));
        const allRemovedExplicit = missingIds.every((id) => removedIds.has(id));
        if (!allRemovedExplicit) return;
      }
      const nextPipelineNodes = nextNodes.map((n) => ({
        id: n.id,
        type: n.type ?? "pipelineNode",
        position: n.position,
        data: n.data,
      })) as PipelineNode[];
      if (
        nextPipelineNodes.length === state.nodes.length &&
        nextPipelineNodes.every(
          (n, i) =>
            state.nodes[i] &&
            state.nodes[i].id === n.id &&
            state.nodes[i].position.x === n.position.x &&
            state.nodes[i].position.y === n.position.y &&
            state.nodes[i].data.label === n.data.label &&
            state.nodes[i].data.typeId === n.data.typeId &&
            state.nodes[i].data.nodeTypeKind === n.data.nodeTypeKind
        )
      ) {
        return;
      }
      setNodes(nextPipelineNodes);
    },
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const state = usePipelineStore.getState();
      const runningId =
        Object.entries(state.nodeStates).find(
          ([, s]) => s.status === "running"
        )?.[0] ?? null;
      const currentFlowEdges = toReactFlowEdges(state.edges, runningId).map(
        (e) => ({ ...e, type: "animated" as const })
      );
      const nextEdges = applyEdgeChanges(changes, currentFlowEdges);
      const nextPipelineEdges = nextEdges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle ?? null,
        targetHandle: e.targetHandle ?? null,
      })) as PipelineEdge[];
      if (
        nextPipelineEdges.length === state.edges.length &&
        nextPipelineEdges.every(
          (e, i) =>
            state.edges[i] &&
            state.edges[i].id === e.id &&
            state.edges[i].source === e.source &&
            state.edges[i].target === e.target
        )
      ) {
        return;
      }
      setEdges(nextPipelineEdges);
    },
    [setEdges]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      console.log("[PipelineCanvas] onDrop fired", {
        clientX: e.clientX,
        clientY: e.clientY,
        dataTransferTypes: e.dataTransfer?.types,
      });
      e.preventDefault();
      const payload =
        e.dataTransfer?.getData("application/json") ||
        e.dataTransfer?.getData("text/plain");
      console.log("[PipelineCanvas] payload", {
        payload,
        length: payload?.length,
      });
      if (!payload) {
        console.warn("[PipelineCanvas] no payload, returning");
        return;
      }
      try {
        const nodeType = JSON.parse(payload) as NodeType;
        console.log("[PipelineCanvas] parsed nodeType", nodeType);
        let position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
        console.log("[PipelineCanvas] screenToFlowPosition result", position);
        if (typeof position.x !== "number" || typeof position.y !== "number") {
          position = { x: 100, y: 100 };
          console.log("[PipelineCanvas] using fallback position", position);
        }
        const newNode: PipelineNode = {
          id: generateNodeId(),
          type: "pipelineNode",
          position,
          data: {
            typeId: nodeType.id,
            label: nodeType.label,
            nodeTypeKind: nodeType.type,
          },
        };
        console.log("[PipelineCanvas] calling addNodeToStore", newNode);
        addNodeToStore(newNode);
        console.log("[PipelineCanvas] addNodeToStore done");
      } catch (err) {
        console.error("[PipelineCanvas] onDrop error", err);
      }
    },
    [screenToFlowPosition, addNodeToStore]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <ReactFlow
      nodes={reactFlowNodes}
      edges={reactFlowEdges}
      onConnect={onConnect}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onDrop={onDrop}
      onDragOver={onDragOver}
      fitView
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
}

export function PipelineCanvas() {
  return (
    <div className="h-full w-full min-h-[300px]" style={{ minHeight: 300 }}>
      <ReactFlowProvider>
        <CanvasInner />
      </ReactFlowProvider>
    </div>
  );
}
