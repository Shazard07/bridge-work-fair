import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/company/jobs/new")({
  head: () => ({ meta: [{ title: "Post Job — getWorkers" }] }),
  component: PostJob,
});

const SECTORS = ["Construction", "Marine"] as const;
const WORK_PASS = ["Work Permit", "S Pass", "Both"] as const;

function PostJob() {
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: "",
    sector: "Construction" as typeof SECTORS[number],
    workPass: "Work Permit" as typeof WORK_PASS[number],
    workersNeeded: "1",
    minSalary: "",
    maxSalary: "",
    location: "",
    contractDuration: "",
    startDate: "",
    workHours: "",
    description: "",
  });
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (!authLoading && !user) nav({ to: "/login" }); }, [authLoading, user, nav]);

  const upd = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setErr(null);
    setLoading(true);
    const { error } = await supabase.from("jobs").insert({
      company_id: user.id,
      title: form.title,
      sector: form.sector,
      work_pass_type: form.workPass,
      workers_needed: parseInt(form.workersNeeded || "1", 10),
      min_salary: parseInt(form.minSalary || "0", 10),
      max_salary: parseInt(form.maxSalary || "0", 10),
      location: form.location,
      contract_duration: form.contractDuration,
      start_date: form.startDate,
      work_hours: form.workHours,
      description: form.description,
    });
    setLoading(false);
    if (error) { setErr(error.message); return; }
    nav({ to: "/company" });
  }

  return (
    <AppShell role="company">
      <div className="mx-auto max-w-xl px-4 py-8 md:px-6">
        <Link to="/company" className="text-sm text-muted-foreground hover:text-foreground">← Back to dashboard</Link>
        <h1 className="mt-4 text-2xl font-bold md:text-3xl">Post a job</h1>
        <p className="mt-1 text-sm text-muted-foreground">Reach verified workers directly. Transparent hiring.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-xl border border-border bg-card p-6">
          <Field label="Job title" value={form.title} onChange={upd("title")} required />
          <Select label="Sector" value={form.sector} onChange={upd("sector")} options={SECTORS} />
          <Select label="Work pass type required" value={form.workPass} onChange={upd("workPass")} options={WORK_PASS} />
          <Field label="Number of workers needed" type="number" min={1} value={form.workersNeeded} onChange={upd("workersNeeded")} required />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Min salary (SGD/mo)" type="number" min={0} value={form.minSalary} onChange={upd("minSalary")} required />
            <Field label="Max salary (SGD/mo)" type="number" min={0} value={form.maxSalary} onChange={upd("maxSalary")} required />
          </div>
          <Field label="Work location" value={form.location} onChange={upd("location")} required />
          <Field label="Contract duration" value={form.contractDuration} onChange={upd("contractDuration")} placeholder="e.g. 2 years" required />
          <Field label="Expected start date" type="date" value={form.startDate} onChange={upd("startDate")} required />
          <Field label="Work hours" value={form.workHours} onChange={upd("workHours")} placeholder="e.g. Mon–Sat, 8am–6pm" required />

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Job description</span>
            <textarea value={form.description} onChange={upd("description")} rows={5} required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </label>

          {err && <p className="text-sm text-destructive">{err}</p>}

          <button disabled={loading} className="w-full rounded-md bg-primary py-3 font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">
            {loading ? "Posting..." : "Post job"}
          </button>
        </form>
      </div>
    </AppShell>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input {...props} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
    </label>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: React.ChangeEventHandler<HTMLSelectElement>; options: readonly string[] }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <select value={value} onChange={onChange} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
