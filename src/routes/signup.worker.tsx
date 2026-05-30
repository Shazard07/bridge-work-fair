import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useState } from "react";
import { SECTORS } from "@/lib/data";

export const Route = createFileRoute("/signup/worker")({
  head: () => ({ meta: [{ title: "Worker Signup — BridgeWork" }] }),
  component: WorkerSignup,
});

function WorkerSignup() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "", fin: "", dob: "", years: "1-2", sector: "Construction",
    salaryExpect: 1800, phone: "",
  });
  const upd = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.name === "salaryExpect" ? +e.target.value : e.target.value });

  return (
    <AppShell role="public">
      <div className="mx-auto max-w-xl px-4 py-12 md:px-6">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back</Link>
        <h1 className="mt-4 text-3xl font-bold">Worker signup</h1>
        <p className="mt-1 text-muted-foreground">Free for workers. Always.</p>

        <form
          onSubmit={(e) => { e.preventDefault(); nav({ to: "/worker" }); }}
          className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6"
        >
          <L label="Full name">
            <input className={inp} value={form.name} onChange={upd("name")} required />
          </L>
          <L label="FIN number">
            <input className={inp} value={form.fin} onChange={upd("fin")} placeholder="e.g. G1234567X" required />
          </L>
          <L label="Date of birth">
            <input type="date" className={inp} value={form.dob} onChange={upd("dob")} required />
          </L>
          <div className="grid grid-cols-2 gap-4">
            <L label="Years of experience">
              <select className={inp} value={form.years} onChange={upd("years")}>
                <option>0</option><option>1-2</option><option>3-5</option><option>5+</option>
              </select>
            </L>
            <L label="Sector">
              <select className={inp} value={form.sector} onChange={upd("sector")}>
                {SECTORS.map(s => <option key={s}>{s}</option>)}
              </select>
            </L>
          </div>
          <L label="Salary expectation (SGD / month)">
            <input type="number" name="salaryExpect" className={inp} value={form.salaryExpect} onChange={upd("salaryExpect")} required />
          </L>
          <L label="Contact number (WhatsApp)">
            <input className={inp} value={form.phone} onChange={upd("phone")} placeholder="+91 ..." required />
          </L>

          <button className="w-full rounded-md bg-accent py-3 font-semibold text-accent-foreground transition-colors hover:opacity-90">
            Create free account
          </button>
          <p className="text-center text-xs text-muted-foreground">You will never be charged. Ever.</p>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">Log in</Link>
          </p>
        </form>
      </div>
    </AppShell>
  );
}

const inp = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-medium">{label}</span>{children}</label>;
}
