import { memo, useState, useCallback, useEffect } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import type { PipelineNodeData } from "@/types/pipeline";
import type { NodeExecutionStatus } from "@/types/execution";
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
    [data.label, handleSubmit]
  );

  return (
    <div
      className={`min-w-[140px] rounded-lg border-2 px-3 py-2 shadow-sm ${statusColors[status]}`}
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
      <div className="text-xs font-medium uppercase text-slate-500">
        {data.nodeTypeKind}
      </div>
      {editing ? (
        <input
          autoFocus
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
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
