import { createFileRoute } from "@tanstack/react-router";
import { AppShell, SectorBadge } from "@/components/app-shell";
import { APPLICATIONS, JOBS, AGENTS, WORKERS, PIPELINE_STAGES, STAGE_DESCRIPTIONS } from "@/lib/data";
import { useLang } from "@/lib/lang";
import { Check } from "lucide-react";

export const Route = createFileRoute("/worker/applications")({
  head: () => ({ meta: [{ title: "My Applications — BridgeWork" }] }),
  component: MyApps,
});

function MyApps() {
  const { t, lang } = useLang();
  const me = WORKERS[0];
  const myApps = APPLICATIONS.filter(a => a.workerId === me.id);

  return (
    <AppShell role="worker">
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        <h1 className="text-3xl font-bold font-tamil">{t("My applications", "எனது விண்ணப்பங்கள்")}</h1>

        <div className="mt-6 space-y-6">
          {myApps.map(a => {
            const j = JOBS.find(j => j.id === a.jobId)!;
            const ag = AGENTS.find(x => x.id === j.agentId)!;
            const stageIdx = PIPELINE_STAGES.indexOf(a.stage);
            const desc = STAGE_DESCRIPTIONS[a.stage];

            return (
              <div key={a.id} className="rounded-xl border border-border bg-card p-6">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-semibold">{j.title}</h2>
                    <p className="text-sm text-muted-foreground">{ag.company}</p>
                  </div>
                  <SectorBadge sector={j.sector} />
                </div>

                {/* Progress bar */}
                <div className="mt-6">
                  <div className="relative">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((stageIdx + 1) / PIPELINE_STAGES.length) * 100}%` }} />
                    </div>
                    <div className="mt-4 grid grid-cols-7 gap-1">
                      {PIPELINE_STAGES.map((s, i) => (
                        <div key={s} className="flex flex-col items-center text-center">
                          <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${i <= stageIdx ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                            {i <= stageIdx ? <Check className="h-3 w-3" /> : i + 1}
                          </div>
                          <span className="mt-1 hidden text-[10px] leading-tight text-muted-foreground sm:block">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-lg bg-primary/5 p-4">
                  <p className="text-sm font-semibold text-primary">{a.stage}</p>
                  <p className="mt-1 text-sm text-foreground font-tamil">{lang === "ta" ? desc.ta : desc.en}</p>
                </div>
              </div>
            );
          })}
          {myApps.length === 0 && (
            <p className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground font-tamil">{t("No applications yet.", "இன்னும் விண்ணப்பங்கள் இல்லை.")}</p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
