import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, SectorBadge } from "@/components/app-shell";
import { WORKERS, type Sector } from "@/lib/data";
import { useState, useMemo } from "react";
import { MessageCircle } from "lucide-react";

export const Route = createFileRoute("/agent/workers")({
  head: () => ({ meta: [{ title: "Browse Workers — BridgeWork" }] }),
  component: BrowseWorkers,
});

function BrowseWorkers() {
  const [sector, setSector] = useState<Sector | "Both">("Both");
  const [years, setYears] = useState<"any" | "0" | "1-2" | "3-5" | "5+">("any");

  const filtered = useMemo(() => WORKERS.filter(w => {
    if (sector !== "Both" && w.sector !== sector) return false;
    if (years !== "any" && w.years !== years) return false;
    return true;
  }), [sector, years]);

  return (
    <AppShell role="business">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <h1 className="text-3xl font-bold">Browse workers</h1>
        <p className="mt-1 text-muted-foreground">{filtered.length} workers match your filters</p>

        <div className="mt-6 flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sector:</span>
            {(["Both", "Construction", "Marine"] as const).map(s => (
              <button key={s} onClick={() => setSector(s)} className={`rounded-full border px-3 py-1 text-xs font-medium ${sector === s ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary"}`}>{s}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Experience:</span>
            <select value={years} onChange={e => setYears(e.target.value as any)} className="rounded-md border border-input bg-background px-2 py-1.5 text-sm">
              <option value="any">Any</option>
              <option value="0">0 years</option>
              <option value="1-2">1–2 years</option>
              <option value="3-5">3–5 years</option>
              <option value="5+">5+ years</option>
            </select>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(w => {
            const wa = `https://wa.me/${w.phone.replace(/\D/g, "")}`;
            return (
              <div key={w.id} className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{w.name}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">FIN {w.fin}</p>
                  </div>
                  <SectorBadge sector={w.sector} />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-md bg-secondary/50 p-2">
                    <div className="text-[10px] uppercase text-muted-foreground">Experience</div>
                    <div className="font-semibold">{w.years} yrs</div>
                  </div>
                  <div className="rounded-md bg-secondary/50 p-2">
                    <div className="text-[10px] uppercase text-muted-foreground">Expects</div>
                    <div className="font-semibold">${w.salaryExpect}/mo</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Link to="/agent/workers/$id" params={{ id: w.id }} className="flex-1 inline-flex items-center justify-center rounded-md border border-input bg-card py-2 text-sm font-semibold hover:bg-secondary">
                    View
                  </Link>
                  <a
                    href={wa}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md bg-[#25D366] px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
                  >
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
