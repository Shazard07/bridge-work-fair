import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, SectorBadge } from "@/components/app-shell";
import { APPLICATIONS, JOBS, BUSINESSES } from "@/lib/data";
import { Briefcase, Users, Sparkles, MailCheck, Plus, Search } from "lucide-react";

export const Route = createFileRoute("/agent/")({
  head: () => ({ meta: [{ title: "Business Dashboard — BridgeWork" }] }),
  component: BusinessDash,
});

function BusinessDash() {
  const business = BUSINESSES[0];
  const activeJobs = JOBS.filter(j => j.status === "Active").length;
  const totalApplicants = APPLICATIONS.length;
  const newMatches = 12;
  const offersPending = APPLICATIONS.filter(a => a.stage === "Offer Sent").length;

  const recent = [
    { text: "Murugan R. applied to your Marine Welder posting", time: "2h ago" },
    { text: "3 new workers match your Construction Formwork posting", time: "5h ago" },
    { text: "Selvam K. moved to Offer Sent stage", time: "1d ago" },
    { text: "Karthik M. accepted your offer", time: "2d ago" },
  ];

  return (
    <AppShell role="business">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {business.contact}</h1>
            <p className="mt-1 text-muted-foreground">{business.company} · {business.license}</p>
          </div>
          <div className="flex gap-2">
            <Link to="/agent/jobs/new" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
              <Plus className="h-4 w-4" /> Post New Job
            </Link>
            <Link to="/agent/workers" className="inline-flex items-center gap-2 rounded-md border border-input bg-card px-4 py-2 text-sm font-semibold hover:bg-secondary">
              <Search className="h-4 w-4" /> Browse Workers
            </Link>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <Stat icon={Briefcase} label="Active Postings" value={activeJobs} />
          <Stat icon={Users} label="Total Applicants" value={totalApplicants} />
          <Stat icon={Sparkles} label="New Matches" value={newMatches} />
          <Stat icon={MailCheck} label="Offers Pending" value={offersPending} />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-3 text-lg font-semibold">Active job postings</h2>
            <div className="space-y-3">
              {JOBS.slice(0, 4).map(j => {
                const b = BUSINESSES.find(a => a.id === j.businessId);
                const apps = APPLICATIONS.filter(a => a.jobId === j.id).length;
                return (
                  <div key={j.id} className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{j.title}</h3>
                        <p className="text-xs text-muted-foreground">{b?.company}</p>
                      </div>
                      <SectorBadge sector={j.sector} />
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span>${j.salaryMin}–${j.salaryMax}/mo</span>
                      <span>{j.workersNeeded} needed</span>
                      <span>{apps} applicants</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold">Recent activity</h2>
            <div className="space-y-2 rounded-lg border border-border bg-card p-2">
              {recent.map((r, i) => (
                <div key={i} className="rounded-md p-3 hover:bg-secondary/50">
                  <p className="text-sm">{r.text}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{r.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <p className="mt-3 text-3xl font-bold">{value}</p>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}
