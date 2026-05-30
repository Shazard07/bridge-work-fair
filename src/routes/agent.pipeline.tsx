import { createFileRoute } from "@tanstack/react-router";
import { AppShell, SectorBadge } from "@/components/app-shell";
import { APPLICATIONS, JOBS, PIPELINE_STAGES, WORKERS, type Stage } from "@/lib/data";
import { useState } from "react";

export const Route = createFileRoute("/agent/pipeline")({
  head: () => ({ meta: [{ title: "Pipeline — BridgeWork" }] }),
  component: Pipeline,
});

function Pipeline() {
  const [apps, setApps] = useState(APPLICATIONS);
  const [dragId, setDragId] = useState<string | null>(null);

  const move = (id: string, stage: Stage) => {
    setApps(p => p.map(a => a.id === id ? { ...a, stage, daysInStage: 0 } : a));
  };

  return (
    <AppShell role="agent">
      <div className="mx-auto max-w-[100rem] px-4 py-8 md:px-6">
        <h1 className="text-3xl font-bold">Application pipeline</h1>
        <p className="mt-1 text-muted-foreground">Drag workers between stages.</p>

        <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
          {PIPELINE_STAGES.map(stage => {
            const stageApps = apps.filter(a => a.stage === stage);
            return (
              <div
                key={stage}
                onDragOver={e => e.preventDefault()}
                onDrop={() => dragId && move(dragId, stage)}
                className="flex w-72 flex-shrink-0 flex-col rounded-xl border border-border bg-secondary/30 p-3"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">{stage}</h3>
                  <span className="rounded-full bg-card px-2 py-0.5 text-xs font-medium">{stageApps.length}</span>
                </div>
                <div className="space-y-2">
                  {stageApps.map(a => {
                    const w = WORKERS.find(x => x.id === a.workerId)!;
                    const j = JOBS.find(x => x.id === a.jobId)!;
                    return (
                      <div
                        key={a.id}
                        draggable
                        onDragStart={() => setDragId(a.id)}
                        onDragEnd={() => setDragId(null)}
                        className="cursor-grab rounded-lg border border-border bg-card p-3 shadow-sm hover:shadow active:cursor-grabbing"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">{w.firstName} {w.lastInitial}.</p>
                            <p className="truncate text-xs text-muted-foreground">{j.title}</p>
                          </div>
                          <SectorBadge sector={w.sector} />
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                          <span>{w.district}</span>
                          <span>{a.daysInStage}d in stage</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
