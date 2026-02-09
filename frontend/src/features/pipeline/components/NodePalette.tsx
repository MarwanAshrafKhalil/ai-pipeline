import type { NodeType } from "@/types/node";
import { useNodeTypes } from "../hooks/useNodeTypes";
import { Button } from "@/components/Button";
import { NodeTypeIcon } from "@/components/NodeTypeIcon";

function onDragStart(e: React.DragEvent, nodeType: NodeType) {
  const payload = JSON.stringify(nodeType);
  e.dataTransfer.setData("application/json", payload);
  e.dataTransfer.setData("text/plain", payload);
  e.dataTransfer.effectAllowed = "move";
  console.log("[NodePalette] dragStart", { nodeType, payload });
}

export function NodePalette() {
  const { data: nodeTypes, isLoading, error, refetch } = useNodeTypes();
  if (error) {
    return (
      <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
        <p>Failed to load node types.</p>
        <Button variant="secondary" className="mt-2" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
        Loading node types…
      </div>
    );
  }

  const types = nodeTypes ?? [];

  return (
    <div className="rounded border border-slate-200 bg-white p-2 shadow-sm">
      <h3 className="mb-2 text-xs font-semibold uppercase text-slate-500">
        Nodes
      </h3>
      <ul className="space-y-1">
        {types.map((nt) => (
          <li
            key={nt.id}
            draggable
            onDragStart={(e) => onDragStart(e, nt)}
            className="flex items-center gap-2 cursor-grab rounded border border-slate-200 bg-slate-50 px-2 py-1.5 text-sm text-slate-800 hover:bg-slate-100 active:cursor-grabbing"
          >
            <NodeTypeIcon kind={nt.type} />
            <span>{nt.label}</span>
          </li>
        ))}
      </ul>
      <Button
        variant="ghost"
        className="mt-2 w-full text-xs"
        onClick={() => refetch()}
      >
        Refresh
      </Button>
    </div>
  );
}
