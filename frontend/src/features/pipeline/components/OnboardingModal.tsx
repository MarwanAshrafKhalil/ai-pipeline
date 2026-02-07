import { useState } from "react";
import { usePipelineStore } from "../store/pipelineStore";
import { Button } from "@/shared/components/Button";

const ONBOARDING_KEY = "pipeline-onboarding-dismissed";

function isDismissed(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_KEY) === "true";
  } catch {
    return false;
  }
}

function setDismissed(): void {
  try {
    localStorage.setItem(ONBOARDING_KEY, "true");
  } catch {
    // ignore
  }
}

export function OnboardingModal() {
  const dismissed = usePipelineStore((s) => s.onboardingDismissed);
  const setOnboardingDismissed = usePipelineStore(
    (s) => s.setOnboardingDismissed
  );

  const [open, setOpen] = useState(() => !isDismissed());

  const handleClose = () => {
    setDismissed();
    setOnboardingDismissed(true);
    setOpen(false);
  };

  if (!open || dismissed) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div
        className="max-w-md rounded-lg bg-white p-5 shadow-xl"
        //explain this code - not needed
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="onboarding-title"
          className="text-lg font-semibold text-slate-800"
        >
          Get started
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-4 text-sm text-slate-600">
          <li>Drag nodes from the left palette onto the canvas.</li>
          <li>
            Connect nodes by dragging from a source handle to a target handle
            (order: Data Source → Transformer → Model → Sink).
          </li>
          <li>Double-click a node label to rename it.</li>
          <li>
            Click &quot;Run pipeline&quot; to execute the graph. Watch the logs
            at the bottom.
          </li>
        </ol>
        <div className="mt-4 flex justify-end">
          <Button variant="primary" onClick={handleClose}>
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
}
