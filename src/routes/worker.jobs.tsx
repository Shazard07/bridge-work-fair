import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, SectorBadge } from "@/components/app-shell";
import { JOBS, BUSINESSES, type Sector } from "@/lib/data";
import { useState, useMemo } from "react";
import { Home, Check } from "lucide-react";

export const Route = createFileRoute("/worker/jobs")({
  head: () => ({ meta: [{ title: "Browse Jobs — BridgeWork" }] }),
  component: WorkerJobs,
});

function WorkerJobs() {
  const [sector, setSector] = useState<Sector | "Both">("Both");
  const [minSalary, setMinSalary] = useState(0);

  const filtered = useMemo(
    () => JOBS.filter(j => j.status === "Active").filter(j => {
      if (sector !== "Both" && j.sector !== sector) return false;
      if (j.salaryMin < minSalary) return false;
      return true;
    }),
    [sector, minSalary],
  );

  return (
    <AppShell role="worker">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <h1 className="text-3xl font-bold">Available jobs</h1>
        <p className="mt-1 text-muted-foreground">{filtered.length} jobs · all fees $0 for you</p>

        <div className="mt-6 flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sector:</span>
            {(["Both", "Construction", "Marine"] as const).map(s => (
              <button key={s} onClick={() => setSector(s)} className={`rounded-full border px-3 py-1 text-xs font-medium ${sector === s ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary"}`}>{s}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Min salary: ${minSalary}</span>
            <input type="range" min={0} max={2500} step={100} value={minSalary} onChange={e => setMinSalary(+e.target.value)} className="w-40 accent-primary" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(j => {
            const b = BUSINESSES.find(a => a.id === j.businessId)!;
            return (
              <div key={j.id} className="flex flex-col rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold">{j.title}</h3>
                  <SectorBadge sector={j.sector} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{b.company}</p>
                <p className="mt-3 text-2xl font-bold">${j.salaryMin}–${j.salaryMax}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-secondary px-2 py-0.5">{j.duration} months</span>
                  {j.accommodation && <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-success"><Home className="h-3 w-3" /> Housing</span>}
                </div>
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-success/10 px-2 py-1 text-xs font-semibold text-success">
                  <Check className="h-3 w-3" /> $0 fees
                </div>
                <Link to="/worker/jobs/$id" params={{ id: j.id }} className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
                  View & Apply
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
