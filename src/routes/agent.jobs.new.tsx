import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useState } from "react";
import { DISTRICTS, type District, type Sector } from "@/lib/data";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/agent/jobs/new")({
  head: () => ({ meta: [{ title: "Post a Job — BridgeWork" }] }),
  component: NewJob,
});

function NewJob() {
  const nav = useNavigate();
  const [f, setF] = useState({
    title: "", sector: "Construction" as Sector, workersNeeded: 1,
    salaryMin: 1600, salaryMax: 2000, duration: 24, accommodation: true,
    minYears: "1+", skills: "", districts: ["Chennai"] as District[],
    startDate: "", status: "Active",
  });

  const toggleDistrict = (d: District) => {
    setF(f => ({ ...f, districts: f.districts.includes(d) ? f.districts.filter(x => x !== d) : [...f.districts, d] }));
  };

  return (
    <AppShell role="agent">
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
        <h1 className="text-3xl font-bold">Post a new job</h1>
        <p className="mt-1 text-muted-foreground">Reach licensed workers directly from Tamil Nadu.</p>

        <form
          onSubmit={(e) => { e.preventDefault(); nav({ to: "/agent" }); }}
          className="mt-8 space-y-5 rounded-xl border border-border bg-card p-6"
        >
          <Field label="Job title">
            <input value={f.title} onChange={e => setF({ ...f, title: e.target.value })} required className={inp} placeholder="e.g. Marine Welder" />
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Sector">
              <select value={f.sector} onChange={e => setF({ ...f, sector: e.target.value as Sector })} className={inp}>
                <option>Construction</option><option>Marine</option>
              </select>
            </Field>
            <Field label="Number of workers needed">
              <input type="number" min={1} value={f.workersNeeded} onChange={e => setF({ ...f, workersNeeded: +e.target.value })} className={inp} />
            </Field>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Salary min (SGD/month)">
              <input type="number" value={f.salaryMin} onChange={e => setF({ ...f, salaryMin: +e.target.value })} className={inp} />
            </Field>
            <Field label="Salary max (SGD/month)">
              <input type="number" value={f.salaryMax} onChange={e => setF({ ...f, salaryMax: +e.target.value })} className={inp} />
            </Field>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <Field label="Contract duration (months)">
              <input type="number" value={f.duration} onChange={e => setF({ ...f, duration: +e.target.value })} className={inp} />
            </Field>
            <Field label="Accommodation provided">
              <select value={f.accommodation ? "yes" : "no"} onChange={e => setF({ ...f, accommodation: e.target.value === "yes" })} className={inp}>
                <option value="yes">Yes</option><option value="no">No</option>
              </select>
            </Field>
            <Field label="Required experience">
              <select value={f.minYears} onChange={e => setF({ ...f, minYears: e.target.value })} className={inp}>
                <option>0+</option><option>1+</option><option>3+</option><option>5+</option>
              </select>
            </Field>
          </div>

          <Field label="Skills required">
            <textarea value={f.skills} onChange={e => setF({ ...f, skills: e.target.value })} rows={3} className={inp} placeholder="Specific skills, certifications, equipment..." />
          </Field>

          <Field label="Preferred districts in Tamil Nadu">
            <div className="flex flex-wrap gap-2">
              {DISTRICTS.map(d => (
                <button type="button" key={d} onClick={() => toggleDistrict(d)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${f.districts.includes(d) ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-secondary"}`}>
                  {d}
                </button>
              ))}
            </div>
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Start date">
              <input type="date" value={f.startDate} onChange={e => setF({ ...f, startDate: e.target.value })} className={inp} />
            </Field>
            <Field label="Status">
              <select value={f.status} onChange={e => setF({ ...f, status: e.target.value })} className={inp}>
                <option>Draft</option><option>Active</option><option>Closed</option>
              </select>
            </Field>
          </div>

          {/* Locked fee field */}
          <div className="flex items-start gap-3 rounded-md border border-dashed border-border bg-secondary/40 p-4">
            <Lock className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Worker placement fee: $0</p>
              <p className="mt-0.5 text-xs text-muted-foreground">BridgeWork policy. Workers are never charged. This field cannot be edited.</p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => nav({ to: "/agent" })} className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-secondary">Cancel</button>
            <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">Post job</button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}

const inp = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-medium">{label}</span>{children}</label>;
}
