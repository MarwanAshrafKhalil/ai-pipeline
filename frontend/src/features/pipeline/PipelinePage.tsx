import { NodePalette } from "./components/NodePalette";
import { PipelineCanvas } from "./components/PipelineCanvas";
import { LogsPanel } from "./components/LogsPanel";
import { ExecutionStatus } from "./components/ExecutionStatus";
import { DraftModal } from "./components/DraftModal";
import { OnboardingModal } from "./components/OnboardingModal";

export function PipelinePage() {
  return (
    <div className="flex h-screen flex-col">
      <DraftModal />
      <OnboardingModal />
      <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <h1 className="text-lg font-semibold text-slate-800">
          Visual AI Pipeline Editor
        </h1>
        <ExecutionStatus />
      </header>
      <div className="flex flex-1 min-h-0">
        <aside className="w-52 shrink-0 border-r border-slate-200 bg-slate-50 p-3 overflow-y-auto">
          <NodePalette />
        </aside>
        <main className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 min-h-0">
            <PipelineCanvas />
          </div>
          <div className="h-48 shrink-0 border-t border-slate-200 p-2">
            <LogsPanel />
          </div>
        </main>
      </div>
    </div>
  );
}
