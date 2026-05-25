import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell, SectorBadge } from "@/components/app-shell";
import { WORKERS, JOBS, AGENTS } from "@/lib/data";
import { useState } from "react";
import { Check, AlertCircle, Clock, X } from "lucide-react";

export const Route = createFileRoute("/agent/workers/$id")({
  head: ({ params }) => ({ meta: [{ title: `Worker Profile — BridgeWork` }] }),
  loader: ({ params }) => {
    const w = WORKERS.find(w => w.id === params.id);
    if (!w) throw notFound();
    return { worker: w };
  },
  component: WorkerDetail,
  notFoundComponent: () => (
    <AppShell role="agent"><div className="p-8 text-center"><p>Worker not found</p><Link to="/agent/workers" className="text-primary">Back</Link></div></AppShell>
  ),
});

function WorkerDetail() {
  const { worker: w } = Route.useLoaderData();
  const [modal, setModal] = useState(false);
  const [jobId, setJobId] = useState(JOBS[0].id);
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  const docs = [
    { name: "Passport copy", status: w.documentsPct >= 25 ? "Uploaded" : "Missing" },
    { name: "Medical certificate", status: w.documentsPct >= 50 ? "Uploaded" : "Missing" },
    { name: "Work history", status: w.documentsPct >= 75 ? "Uploaded" : "Missing" },
    { name: "Police clearance", status: w.documentsPct >= 100 ? "Uploaded" : (w.documentsPct >= 75 ? "Expired" : "Missing") },
  ] as const;

  return (
    <AppShell role="agent">
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        <Link to="/agent/workers" className="text-sm text-muted-foreground hover:text-foreground">← Back to workers</Link>

        <div className="mt-4 rounded-xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{w.firstName} {w.lastInitial}.</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <SectorBadge sector={w.sector} />
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">{w.district}, Tamil Nadu</span>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">{w.years} years</span>
              </div>
            </div>
            <button onClick={() => setModal(true)} className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90">
              Send Offer
            </button>
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Skills</h2>
            <p className="mt-2 text-sm">{w.skills}</p>
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Documents</h2>
            <div className="mt-3 space-y-2">
              {docs.map(d => (
                <div key={d.name} className="flex items-center justify-between rounded-md border border-border p-3">
                  <span className="text-sm font-medium">{d.name}</span>
                  <DocBadge status={d.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setModal(false)}>
          <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            {!sent ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Send offer to {w.firstName}</h3>
                  <button onClick={() => setModal(false)}><X className="h-4 w-4" /></button>
                </div>
                <div className="mt-4 space-y-3">
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium">Job posting</span>
                    <select value={jobId} onChange={e => setJobId(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      {JOBS.filter(j => j.status === "Active").map(j => (
                        <option key={j.id} value={j.id}>{j.title} · ${j.salaryMin}–${j.salaryMax}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium">Message (optional)</span>
                    <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={3} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Add a personal note..." />
                  </label>
                </div>
                <button onClick={() => setSent(true)} className="mt-4 w-full rounded-md bg-primary py-2 font-semibold text-primary-foreground hover:opacity-90">
                  Send Offer
                </button>
              </>
            ) : (
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/10"><Check className="h-6 w-6 text-success" /></div>
                <h3 className="mt-3 text-lg font-semibold">Offer sent!</h3>
                <p className="mt-1 text-sm text-muted-foreground">{w.firstName} will be notified.</p>
                <button onClick={() => { setModal(false); setSent(false); }} className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}

function DocBadge({ status }: { status: "Uploaded" | "Missing" | "Expired" }) {
  const cfg = {
    Uploaded: { Icon: Check, cls: "bg-success/10 text-success" },
    Missing: { Icon: AlertCircle, cls: "bg-danger/10 text-danger" },
    Expired: { Icon: Clock, cls: "bg-warning/20 text-warning-foreground" },
  }[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.cls}`}>
      <cfg.Icon className="h-3 w-3" /> {status}
    </span>
  );
}
