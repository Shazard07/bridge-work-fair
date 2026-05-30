import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, SectorBadge } from "@/components/app-shell";
import { useLang } from "@/lib/lang";
import { JOBS, AGENTS, type Sector } from "@/lib/data";
import { useState, useMemo } from "react";
import { Home, Check } from "lucide-react";

export const Route = createFileRoute("/worker/jobs")({
  head: () => ({ meta: [{ title: "Browse Jobs — BridgeWork" }] }),
  component: WorkerJobs,
});

function WorkerJobs() {
  const { t } = useLang();
  const [sector, setSector] = useState<Sector | "Both">("Both");
  const [minSalary, setMinSalary] = useState(0);
  const [accom, setAccom] = useState<"all" | "yes" | "no">("all");
  const [duration, setDuration] = useState(0);

  const filtered = useMemo(() => JOBS.filter(j => j.status === "Active").filter(j => {
    if (sector !== "Both" && j.sector !== sector) return false;
    if (j.salaryMin < minSalary) return false;
    if (accom === "yes" && !j.accommodation) return false;
    if (accom === "no" && j.accommodation) return false;
    if (duration && j.duration < duration) return false;
    return true;
  }), [sector, minSalary, accom, duration]);

  return (
    <AppShell role="worker">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <h1 className="text-3xl font-bold font-tamil">{t("Available jobs", "கிடைக்கும் வேலைகள்")}</h1>
        <p className="mt-1 text-muted-foreground font-tamil">{t(`${filtered.length} jobs · all fees $0 for you`, `${filtered.length} வேலைகள் · உங்களுக்கு எல்லா கட்டணமும் $0`)}</p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="space-y-4 rounded-xl border border-border bg-card p-5 self-start lg:sticky lg:top-20">
            <div>
              <h3 className="mb-2 text-sm font-semibold font-tamil">{t("Sector", "துறை")}</h3>
              <div className="flex flex-wrap gap-2">
                {(["Both", "Construction", "Marine"] as const).map(s => (
                  <button key={s} onClick={() => setSector(s)} className={`rounded-full border px-3 py-1 text-xs font-medium ${sector === s ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary"}`}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold font-tamil">{t("Minimum salary (SGD)", "குறைந்தபட்ச சம்பளம்")}: ${minSalary}</h3>
              <input type="range" min={0} max={2500} step={100} value={minSalary} onChange={e => setMinSalary(+e.target.value)} className="w-full accent-primary" />
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold font-tamil">{t("Min duration (months)", "குறைந்தபட்ச காலம்")}</h3>
              <select value={duration} onChange={e => setDuration(+e.target.value)} className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm">
                <option value={0}>Any</option><option value={12}>12+</option><option value={18}>18+</option><option value={24}>24+</option>
              </select>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold font-tamil">{t("Accommodation", "தங்குமிடம்")}</h3>
              <select value={accom} onChange={e => setAccom(e.target.value as any)} className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm">
                <option value="all">Any</option><option value="yes">Yes</option><option value="no">No</option>
              </select>
            </div>
          </aside>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map(j => {
              const ag = AGENTS.find(a => a.id === j.agentId)!;
              return (
                <div key={j.id} className="flex flex-col rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold">{j.title}</h3>
                    <SectorBadge sector={j.sector} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{ag.company}</p>
                  <p className="mt-3 text-2xl font-bold">${j.salaryMin}–${j.salaryMax}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-secondary px-2 py-0.5">{j.duration} months</span>
                    {j.accommodation && <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-success"><Home className="h-3 w-3" /> Housing</span>}
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-success/10 px-2 py-1 text-xs font-semibold text-success">
                    <Check className="h-3 w-3" /> $0 fees
                  </div>
                  <Link to="/worker/jobs/$id" params={{ id: j.id }} className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 font-tamil">
                    {t("View & Apply", "பார் & விண்ணப்பி")}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
