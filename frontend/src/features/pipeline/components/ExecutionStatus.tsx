import { usePipelineStore } from "../store/pipelineStore";
import { useRunPipeline } from "../hooks/useRunPipeline";
import { saveDraft } from "@/services/draft";
import { Button } from "@/components/Button";

export function ExecutionStatus() {
  const nodes = usePipelineStore((s) => s.nodes);
  const edges = usePipelineStore((s) => s.edges);
  const isRunning = usePipelineStore((s) => s.isRunning);
  const connectionError = usePipelineStore((s) => s.connectionError);
  const setConnectionError = usePipelineStore((s) => s.setConnectionError);
  const { run } = useRunPipeline();

  const canRun = nodes.length > 0 && !isRunning;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="secondary"
        onClick={() => saveDraft({ nodes, edges })}
        disabled={nodes.length === 0}
      >
        Save draft
      </Button>
      <Button variant="primary" disabled={!canRun} onClick={() => run()}>
        {isRunning ? "Running…" : "Run pipeline"}
      </Button>
      <span
        className={`text-sm ${isRunning ? "text-amber-600" : "text-slate-500"}`}
      >
        {isRunning ? "Running…" : "Idle"}
      </span>
      {connectionError && (
        <div className="flex items-center gap-2 rounded border border-amber-200 bg-amber-50 px-2 py-1 text-sm text-amber-800">
          <span>{connectionError}</span>
          <button
            type="button"
            onClick={() => setConnectionError(null)}
            className="text-amber-600 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
