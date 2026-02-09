import { useEffect, useRef } from 'react';
import { usePipelineStore } from '../store/pipelineStore';

const levelStyles: Record<string, string> = {
  info: 'text-slate-700',
  success: 'text-emerald-700',
  error: 'text-red-700',
};

export function LogsPanel() {
  const logs = usePipelineStore((s) => s.logs);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
  }, [logs.length]);

  return (
    <div className="flex h-full flex-col rounded border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-3 py-2 text-xs font-semibold uppercase text-slate-500">
        Logs
      </div>
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-2 font-mono text-xs"
      >
        {logs.length === 0 ? (
          <div className="text-slate-400">No logs yet. Run the pipeline to see output.</div>
        ) : (
          <ul className="space-y-0.5">
            {logs.map((entry, i) => (
              <li
                key={`${entry.timestamp}-${i}`}
                className={levelStyles[entry.level] ?? levelStyles.info}
              >
                <span className="text-slate-400">
                  [{new Date(entry.timestamp).toISOString().slice(11, 23)}]{' '}
                  {entry.nodeId
                    ? entry.nodeLabel
                      ? `${entry.nodeId} (${entry.nodeLabel}):`
                      : `${entry.nodeId}:`
                    : 'Pipeline:'}
                </span>{' '}
                {entry.message}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
