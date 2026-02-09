import { memo, useState, useCallback, useEffect } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import type { PipelineNodeData } from "@/types/pipeline";
import type { NodeExecutionStatus } from "@/types/execution";
import { NodeTypeIcon } from "@/components/NodeTypeIcon";
import { usePipelineStore } from "../store/pipelineStore";

type Data = PipelineNodeData & { status?: NodeExecutionStatus };

const statusColors: Record<NodeExecutionStatus, string> = {
  idle: "bg-slate-100 border-slate-300",
  running: "bg-amber-50 border-amber-400",
  completed: "bg-emerald-50 border-emerald-400",
  error: "bg-red-50 border-red-400",
};

function PipelineNodeInner({ id, data }: NodeProps<Data>) {
  useEffect(() => {
    console.log("[PipelineNode] mounted", { id, data });
  }, [id, data]);
  const status = (data.status ?? "idle") as NodeExecutionStatus;
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(data.label);
  const updateNodeLabel = usePipelineStore((s) => s.updateNodeLabel);
  const removeNode = usePipelineStore((s) => s.removeNode);

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      removeNode(id);
    },
    [id, removeNode],
  );

  const handleSubmit = useCallback(() => {
    const trimmed = editValue.trim();
    if (trimmed) updateNodeLabel(id, trimmed);
    setEditing(false);
  }, [id, editValue, updateNodeLabel]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSubmit();
      if (e.key === "Escape") {
        setEditValue(data.label);
        setEditing(false);
      }
    },
    [data.label, handleSubmit],
  );

  const handleEditValue = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditValue(e.target.value);
    },
    [],
  );

  return (
    <div
      className={`relative min-w-[140px] rounded-lg border-2 px-3 py-2 shadow-sm ${statusColors[status]}`}
      style={{ boxShadow: "0 0 0 3px rgba(255,0,0,0.5)" }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-slate-400"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-slate-400"
      />
      <button
        type="button"
        onClick={handleDelete}
        className="absolute right-1 top-1 rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
        aria-label="Delete node"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      </button>
      <div className="flex items-center gap-1.5 text-xs font-medium uppercase text-slate-500">
        <NodeTypeIcon kind={data.nodeTypeKind} />
        <span>{data.nodeTypeKind}</span>
      </div>
      {editing ? (
        <input
          autoFocus
          value={editValue}
          onChange={(e) => handleEditValue(e)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          className="w-full rounded border border-slate-300 px-1 py-0.5 text-sm"
        />
      ) : (
        <div
          onDoubleClick={() => setEditing(true)}
          className="cursor-text text-sm font-medium text-slate-800"
        >
          {data.label || "Unnamed"}
        </div>
      )}
    </div>
  );
}

export const PipelineNodeComponent = memo(PipelineNodeInner);
