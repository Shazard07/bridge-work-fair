import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell, SectorBadge, StatusBadge } from "@/components/app-shell";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/company/")({
  head: () => ({ meta: [{ title: "Company Dashboard — getWorkers" }] }),
  component: CompanyDashboard,
});

type Worker = {
  user_id: string;
  nationality: string;
  language: string;
  sector: "Construction" | "Marine";
  years_experience: number;
  skills: string;
  work_pass_end_date: string | null;
  date_of_birth: string;
};

type AppRow = {
  id: string;
  job_id: string;
  worker_id: string;
  status: "Pending" | "Viewed" | "Contacted" | "Rejected";
  jobs?: { title: string } | null;
};

type Job = {
  id: string;
  title: string;
  sector: "Construction" | "Marine";
  workers_needed: number;
  location: string;
  created_at: string;
};

const STATUSES = ["Pending", "Viewed", "Contacted", "Rejected"] as const;

function CompanyDashboard() {
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState<"jobs" | "applications" | "workers">("applications");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [apps, setApps] = useState<AppRow[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (!authLoading && !user) nav({ to: "/login" }); }, [authLoading, user, nav]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: j }, { data: a }, { data: w }, { data: p }] = await Promise.all([
        supabase.from("jobs").select("*").eq("company_id", user.id).order("created_at", { ascending: false }),
        supabase.from("applications").select("id, job_id, worker_id, status, jobs!inner(title, company_id)").eq("jobs.company_id", user.id),
        supabase.from("worker_profiles").select("*"),
        supabase.from("profiles").select("user_id, full_name"),
      ]);
      setJobs((j as Job[]) ?? []);
      setApps((a as unknown as AppRow[]) ?? []);
      setWorkers((w as Worker[]) ?? []);
      const pMap: Record<string, string> = {};
      (p ?? []).forEach((row: { user_id: string; full_name: string }) => { pMap[row.user_id] = row.full_name; });
      setProfiles(pMap);
      setLoading(false);
    })();
  }, [user]);

  async function updateStatus(appId: string, status: typeof STATUSES[number]) {
    const { error } = await supabase.from("applications").update({ status }).eq("id", appId);
    if (!error) setApps(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
  }

  return (
    <AppShell role="company">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Company Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage jobs, applications, and browse workers.</p>
          </div>
          <Link to="/company/jobs/new" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
            <Plus className="h-4 w-4" /> Post Job
          </Link>
        </div>

        <div className="mt-6 inline-flex flex-wrap rounded-md border border-border bg-card p-1">
          <button onClick={() => setTab("applications")} className={`rounded-md px-4 py-1.5 text-sm font-medium ${tab === "applications" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>Applications ({apps.length})</button>
          <button onClick={() => setTab("jobs")} className={`rounded-md px-4 py-1.5 text-sm font-medium ${tab === "jobs" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>My Jobs ({jobs.length})</button>
          <button onClick={() => setTab("workers")} className={`rounded-md px-4 py-1.5 text-sm font-medium ${tab === "workers" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>Browse Workers ({workers.length})</button>
        </div>

        {loading ? (
          <p className="mt-8 text-sm text-muted-foreground">Loading...</p>
        ) : tab === "applications" ? (
          <div className="mt-6 grid gap-3">
            {apps.length === 0 && <p className="text-sm text-muted-foreground">No applications yet.</p>}
            {apps.map(a => {
              const w = workers.find(x => x.user_id === a.worker_id);
              return (
                <div key={a.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h4 className="font-semibold">{profiles[a.worker_id] ?? "Worker"}</h4>
                      <p className="text-xs text-muted-foreground">Applied to: {a.jobs?.title}</p>
                      {w && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {w.nationality} · {w.language} · {w.years_experience}y exp · {w.sector}
                        </p>
                      )}
                      {w?.skills && <p className="mt-1 text-sm text-foreground">{w.skills}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={a.status} />
                      <select value={a.status} onChange={(e) => updateStatus(a.id, e.target.value as typeof STATUSES[number])}
                        className="rounded-md border border-input bg-background px-2 py-1 text-xs">
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : tab === "jobs" ? (
          <div className="mt-6 grid gap-3">
            {jobs.length === 0 && (
              <p className="text-sm text-muted-foreground">No jobs yet. <Link to="/company/jobs/new" className="font-medium text-primary hover:underline">Post your first job</Link>.</p>
            )}
            {jobs.map(j => (
              <div key={j.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{j.title}</h4>
                      <SectorBadge sector={j.sector} />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{j.location} · {j.workers_needed} needed</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(j.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {workers.length === 0 && <p className="text-sm text-muted-foreground">No worker profiles yet.</p>}
            {workers.map(w => (
              <div key={w.user_id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold">{profiles[w.user_id] ?? "Worker"}</h4>
                  <SectorBadge sector={w.sector} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{w.nationality} · {w.language}</p>
                <p className="mt-2 text-sm text-foreground">{w.years_experience} years experience</p>
                {w.skills && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{w.skills}</p>}
                {w.work_pass_end_date && <p className="mt-2 text-xs text-muted-foreground">Pass ends: {new Date(w.work_pass_end_date).toLocaleDateString()}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
