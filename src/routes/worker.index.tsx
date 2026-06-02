import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell, SectorBadge, StatusBadge } from "@/components/app-shell";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { MapPin, Clock, Briefcase, Users } from "lucide-react";

export const Route = createFileRoute("/worker/")({
  head: () => ({ meta: [{ title: "Worker Dashboard — getWorkers" }] }),
  component: WorkerDashboard,
});

type Job = {
  id: string;
  title: string;
  sector: "Construction" | "Marine";
  work_pass_type: string;
  workers_needed: number;
  min_salary: number;
  max_salary: number;
  location: string;
  contract_duration: string;
  start_date: string;
  work_hours: string;
  description: string;
  company_id: string;
};

type Application = {
  id: string;
  job_id: string;
  status: "Pending" | "Viewed" | "Contacted" | "Rejected";
  jobs?: { title: string; sector: "Construction" | "Marine"; location: string } | null;
};

function WorkerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Record<string, string>>({});
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"jobs" | "applications">("jobs");

  useEffect(() => {
    if (!authLoading && !user) nav({ to: "/login" });
  }, [authLoading, user, nav]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: j }, { data: c }, { data: a }] = await Promise.all([
        supabase.from("jobs").select("*").order("created_at", { ascending: false }),
        supabase.from("company_profiles").select("user_id, company_name"),
        supabase.from("applications").select("id, job_id, status, jobs(title, sector, location)").eq("worker_id", user.id),
      ]);
      setJobs((j as Job[]) ?? []);
      const cMap: Record<string, string> = {};
      (c ?? []).forEach((row: { user_id: string; company_name: string }) => { cMap[row.user_id] = row.company_name; });
      setCompanies(cMap);
      setApps((a as unknown as Application[]) ?? []);
      setLoading(false);
    })();
  }, [user]);

  async function apply(jobId: string) {
    if (!user) return;
    const { error } = await supabase.from("applications").insert({ job_id: jobId, worker_id: user.id });
    if (!error) {
      const { data } = await supabase.from("applications").select("id, job_id, status, jobs(title, sector, location)").eq("worker_id", user.id);
      setApps((data as unknown as Application[]) ?? []);
    }
  }

  const appliedIds = new Set(apps.map(a => a.job_id));

  return (
    <AppShell role="worker">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <h1 className="text-2xl font-bold md:text-3xl">Worker Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Browse jobs and track your applications.</p>

        <div className="mt-6 inline-flex rounded-md border border-border bg-card p-1">
          <button onClick={() => setTab("jobs")} className={`rounded-md px-4 py-1.5 text-sm font-medium ${tab === "jobs" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>Active Jobs ({jobs.length})</button>
          <button onClick={() => setTab("applications")} className={`rounded-md px-4 py-1.5 text-sm font-medium ${tab === "applications" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>My Applications ({apps.length})</button>
        </div>

        {loading ? (
          <p className="mt-8 text-sm text-muted-foreground">Loading...</p>
        ) : tab === "jobs" ? (
          <div className="mt-6 grid gap-4">
            {jobs.length === 0 && <p className="text-sm text-muted-foreground">No jobs posted yet. Check back soon.</p>}
            {jobs.map(j => (
              <div key={j.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold">{j.title}</h3>
                      <SectorBadge sector={j.sector} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{companies[j.company_id] ?? "Company"}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-foreground">${j.min_salary}–${j.max_salary}<span className="text-xs font-medium text-muted-foreground">/mo</span></div>
                    <div className="text-xs text-muted-foreground">{j.work_pass_type}</div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground sm:grid-cols-4">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{j.location}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{j.work_hours}</span>
                  <span className="inline-flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{j.contract_duration}</span>
                  <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{j.workers_needed} needed</span>
                </div>
                <p className="mt-3 text-sm text-foreground line-clamp-3">{j.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Starts {new Date(j.start_date).toLocaleDateString()}</span>
                  {appliedIds.has(j.id) ? (
                    <span className="inline-flex items-center rounded-md bg-success/10 px-3 py-1.5 text-sm font-semibold text-success">Applied</span>
                  ) : (
                    <button onClick={() => apply(j.id)} className="rounded-md bg-accent px-4 py-1.5 text-sm font-semibold text-accent-foreground hover:opacity-90">Apply</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 grid gap-3">
            {apps.length === 0 && <p className="text-sm text-muted-foreground">You haven't applied to any jobs yet.</p>}
            {apps.map(a => (
              <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{a.jobs?.title ?? "Job"}</h4>
                    {a.jobs?.sector && <SectorBadge sector={a.jobs.sector} />}
                  </div>
                  <p className="text-xs text-muted-foreground">{a.jobs?.location}</p>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
