import { useEffect, useState } from 'react';
import { hasValidDraft, loadDraft, clearDraft } from '@/services/draft';
import { usePipelineStore } from '../store/pipelineStore';
import { Button } from '@/shared/components/Button';

export function DraftModal() {
  const [open, setOpen] = useState(false);
  const setGraph = usePipelineStore((s) => s.setGraph);

  useEffect(() => {
    if (hasValidDraft()) setOpen(true);
  }, []);

  const handleRestore = () => {
    const draft = loadDraft();
    if (draft) {
      setGraph(draft.nodes, draft.edges);
    }
    setOpen(false);
  };

  const handleDismiss = () => {
    clearDraft();
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="draft-modal-title"
    >
      <div
        className="max-w-sm rounded-lg bg-white p-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="draft-modal-title" className="text-lg font-semibold text-slate-800">
          Restore draft?
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          A previously saved pipeline was found. Restore it or start fresh.
        </p>
        <div className="mt-4 flex gap-2">
          <Button variant="primary" onClick={handleRestore}>
            Restore
          </Button>
          <Button variant="secondary" onClick={handleDismiss}>
            Start fresh
          </Button>
        </div>
      </div>
    </div>
  );
}
