import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell, SectorBadge } from "@/components/app-shell";
import { WORKERS } from "@/lib/data";
import { MessageCircle, Phone } from "lucide-react";

export const Route = createFileRoute("/agent/workers/$id")({
  head: () => ({ meta: [{ title: "Worker Profile — BridgeWork" }] }),
  loader: ({ params }) => {
    const w = WORKERS.find(w => w.id === params.id);
    if (!w) throw notFound();
    return { worker: w };
  },
  component: WorkerDetail,
  notFoundComponent: () => (
    <AppShell role="business"><div className="p-8 text-center"><p>Worker not found</p><Link to="/agent/workers" className="text-primary">Back</Link></div></AppShell>
  ),
});

function WorkerDetail() {
  const { worker: w } = Route.useLoaderData();
  const wa = `https://wa.me/${w.phone.replace(/\D/g, "")}`;

  return (
    <AppShell role="business">
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
        <Link to="/agent/workers" className="text-sm text-muted-foreground hover:text-foreground">← Back to workers</Link>

        <div className="mt-4 rounded-xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{w.name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <SectorBadge sector={w.sector} />
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">{w.years} years</span>
              </div>
            </div>
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Row label="FIN number" value={w.fin} />
            <Row label="Date of birth" value={w.dob} />
            <Row label="Years of experience" value={w.years} />
            <Row label="Sector" value={w.sector} />
            <Row label="Salary expectation" value={`$${w.salaryExpect} SGD / month`} />
            <Row label="Contact" value={w.phone} icon={Phone} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Row({ label, value, icon: Icon }: { label: string; value: string; icon?: any }) {
  return (
    <div className="rounded-md border border-border p-3">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-center gap-2 text-sm font-semibold">
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
        {value}
      </div>
    </div>
  );
}
