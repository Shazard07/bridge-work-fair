import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, SectorBadge } from "@/components/app-shell";
import { WORKERS, DISTRICTS, type Sector, type District } from "@/lib/data";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/agent/workers")({
  head: () => ({ meta: [{ title: "Browse Workers — BridgeWork" }] }),
  component: BrowseWorkers,
});

function BrowseWorkers() {
  const [sector, setSector] = useState<Sector | "Both">("Both");
  const [districts, setDistricts] = useState<District[]>([]);
  const [docs, setDocs] = useState<"all" | "full" | "partial">("all");

  const filtered = useMemo(() => WORKERS.filter(w => {
    if (sector !== "Both" && w.sector !== sector) return false;
    if (districts.length && !districts.includes(w.district)) return false;
    if (docs === "full" && w.documentsPct < 100) return false;
    if (docs === "partial" && w.documentsPct === 100) return false;
    return true;
  }), [sector, districts, docs]);

  const toggleDistrict = (d: District) =>
    setDistricts(p => p.includes(d) ? p.filter(x => x !== d) : [...p, d]);

  return (
    <AppShell role="agent">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <h1 className="text-3xl font-bold">Browse workers</h1>
        <p className="mt-1 text-muted-foreground">{filtered.length} workers match your filters</p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="space-y-5 rounded-xl border border-border bg-card p-5 self-start lg:sticky lg:top-20">
            <div>
              <h3 className="mb-2 text-sm font-semibold">Sector</h3>
              <div className="flex flex-wrap gap-2">
                {(["Both", "Construction", "Marine"] as const).map(s => (
                  <button key={s} onClick={() => setSector(s)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${sector === s ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary"}`}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold">District</h3>
              <div className="flex flex-wrap gap-1.5">
                {DISTRICTS.map(d => (
                  <button key={d} onClick={() => toggleDistrict(d)}
                    className={`rounded-full border px-2.5 py-1 text-xs ${districts.includes(d) ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary"}`}>{d}</button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold">Documents</h3>
              <select value={docs} onChange={e => setDocs(e.target.value as any)} className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm">
                <option value="all">All</option>
                <option value="full">Fully complete</option>
                <option value="partial">Partially complete</option>
              </select>
            </div>
          </aside>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map(w => (
              <div key={w.id} className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{w.firstName} {w.lastInitial}.</h3>
                    <span className="mt-1 inline-block rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">{w.district}</span>
                  </div>
                  <SectorBadge sector={w.sector} />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{w.years} years experience</p>
                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-xs"><span>Documents</span><span className="font-semibold">{w.documentsPct}%</span></div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-success" style={{ width: `${w.documentsPct}%` }} />
                  </div>
                </div>
                <Link to="/agent/workers/$id" params={{ id: w.id }} className="mt-4 inline-flex w-full items-center justify-center rounded-md border border-input bg-card py-2 text-sm font-semibold hover:bg-secondary">
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
