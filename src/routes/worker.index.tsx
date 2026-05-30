import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, SectorBadge } from "@/components/app-shell";
import { APPLICATIONS, JOBS, BUSINESSES, WORKERS } from "@/lib/data";
import { Briefcase, User } from "lucide-react";

export const Route = createFileRoute("/worker/")({
  head: () => ({ meta: [{ title: "My Dashboard — BridgeWork" }] }),
  component: WorkerDash,
});

function WorkerDash() {
  const me = WORKERS[0];
  const myApps = APPLICATIONS.filter(a => a.workerId === me.id);

  return (
    <AppShell role="worker">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <h1 className="text-3xl font-bold">Welcome, {me.name.split(" ")[0]}</h1>
        <p className="mt-1 text-muted-foreground">Your free path to working in Singapore.</p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-lg font-semibold">My applications</h2>
            <div className="mt-3 space-y-3">
              {myApps.map(a => {
                const j = JOBS.find(j => j.id === a.jobId)!;
                const b = BUSINESSES.find(x => x.id === j.businessId)!;
                return (
                  <Link key={a.id} to="/worker/applications" className="block rounded-lg border border-border p-4 hover:bg-secondary/30">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{j.title}</p>
                        <p className="text-xs text-muted-foreground">{b.company}</p>
                      </div>
                      <SectorBadge sector={j.sector} />
                    </div>
                    <p className="mt-2 text-sm font-medium text-primary">{a.stage}</p>
                  </Link>
                );
              })}
              {myApps.length === 0 && <p className="text-sm text-muted-foreground">No applications yet.</p>}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-lg font-semibold">Browse jobs</h2>
              <p className="mt-1 text-sm text-muted-foreground">{JOBS.filter(j => j.status === "Active").length} jobs available now</p>
              <Link to="/worker/jobs" className="mt-4 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90">
                <Briefcase className="h-4 w-4" /> View jobs
              </Link>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-lg font-semibold">My profile</h2>
              <p className="mt-1 text-sm text-muted-foreground">Keep your details up to date.</p>
              <Link to="/worker/profile" className="mt-4 inline-flex items-center gap-2 rounded-md border border-input bg-card px-4 py-2 text-sm font-semibold hover:bg-secondary">
                <User className="h-4 w-4" /> Edit profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
