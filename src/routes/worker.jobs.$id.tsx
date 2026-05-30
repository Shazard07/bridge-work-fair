import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell, SectorBadge } from "@/components/app-shell";
import { JOBS, BUSINESSES } from "@/lib/data";
import { Home, Calendar, Briefcase, MessageCircle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/worker/jobs/$id")({
  loader: ({ params }) => {
    const job = JOBS.find(j => j.id === params.id);
    if (!job) throw notFound();
    return { job, business: BUSINESSES.find(a => a.id === job.businessId)! };
  },
  head: () => ({ meta: [{ title: "Job Detail — BridgeWork" }] }),
  component: JobDetail,
  notFoundComponent: () => (
    <AppShell role="worker"><div className="p-8 text-center"><Link to="/worker/jobs" className="text-primary">Back to jobs</Link></div></AppShell>
  ),
});

function JobDetail() {
  const { job, business } = Route.useLoaderData();
  const [applied, setApplied] = useState(false);

  const waMsg = encodeURIComponent(`Hi ${business.contact}, I'm applying for the ${job.title} position on BridgeWork.`);
  const waUrl = `https://wa.me/${business.whatsapp}?text=${waMsg}`;

  return (
    <AppShell role="worker">
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
        <Link to="/worker/jobs" className="text-sm text-muted-foreground hover:text-foreground">← Back</Link>

        <div className="mt-4 rounded-xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold">{job.title}</h1>
              <p className="mt-1 text-muted-foreground">{business.company} · {business.license}</p>
            </div>
            <SectorBadge sector={job.sector} />
          </div>

          <p className="mt-6 text-3xl font-bold">${job.salaryMin}–${job.salaryMax}<span className="text-base font-normal text-muted-foreground">/month SGD</span></p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Info icon={Calendar} label="Contract" value={`${job.duration} months`} />
            <Info icon={Home} label="Accommodation" value={job.accommodation ? "Provided" : "Not provided"} />
            <Info icon={Briefcase} label="Workers needed" value={`${job.workersNeeded}`} />
            <Info icon={Calendar} label="Start date" value={job.startDate || "—"} />
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Skills required</h3>
            <p className="mt-2 text-sm">{job.skills}</p>
          </div>

          <div className="mt-6 rounded-lg border-2 border-success/40 bg-success/5 p-5 text-center">
            <p className="text-sm font-semibold text-success">Fees you will be charged</p>
            <p className="mt-1 text-4xl font-extrabold text-success">$0</p>
            <p className="mt-1 text-xs text-muted-foreground">Always. Guaranteed.</p>
          </div>

          {!applied ? (
            <button
              onClick={() => setApplied(true)}
              className="mt-6 w-full rounded-md bg-accent py-3 text-base font-semibold text-accent-foreground hover:opacity-90"
            >
              Apply now
            </button>
          ) : (
            <div className="mt-6 rounded-lg border-2 border-[#25D366]/40 bg-[#25D366]/5 p-5">
              <p className="text-sm font-semibold text-foreground">Application sent! Contact the business directly:</p>
              <div className="mt-4 flex items-center justify-between gap-4 rounded-md border border-border bg-card p-4">
                <div className="min-w-0">
                  <p className="font-semibold">{business.contact}</p>
                  <p className="text-xs text-muted-foreground">{business.company}</p>
                  <p className="mt-1 text-sm">{business.phone}</p>
                </div>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Reminder: you will never be asked to pay any fee. If anyone asks for money, report it via the helpline below.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function Info({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-border p-3">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-semibold">{value}</div>
      </div>
    </div>
  );
}
