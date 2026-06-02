import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/signup/worker")({
  head: () => ({ meta: [{ title: "Worker Signup — getWorkers" }] }),
  component: WorkerSignup,
});

const NATIONALITIES = ["India", "Bangladesh", "Thailand", "China"] as const;
const LANGUAGES = ["Tamil", "Hindi", "Bengali", "Thai", "Mandarin"] as const;
const SECTORS = ["Construction", "Marine"] as const;

function WorkerSignup() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", mobile: "",
    nationality: "India" as typeof NATIONALITIES[number],
    dob: "",
    language: "Tamil" as typeof LANGUAGES[number],
    sector: "Construction" as typeof SECTORS[number],
    years: "0",
    skills: "",
    workPassEnd: "",
    education: "",
    certifications: "",
    sgYears: "",
    sgPeriod: "",
    otherYears: "",
    otherPeriod: "",
    lastSalary: "",
    expectedSalary: "",
  });
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const upd = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email, password: form.password,
      options: { emailRedirectTo: `${window.location.origin}/worker` },
    });
    if (error) { setErr(error.message); setLoading(false); return; }
    const user = data.user;
    if (!user) { setErr("Check your email to confirm your account, then log in."); setLoading(false); return; }

    const { error: pErr } = await supabase.from("profiles").insert({
      user_id: user.id, role: "worker", full_name: form.name, phone: form.mobile,
    });
    if (pErr) { setErr(pErr.message); setLoading(false); return; }

    const { error: wErr } = await supabase.from("worker_profiles").insert({
      user_id: user.id,
      nationality: form.nationality,
      date_of_birth: form.dob,
      language: form.language,
      sector: form.sector,
      years_experience: parseInt(form.years || "0", 10),
      skills: form.skills,
      work_pass_end_date: form.workPassEnd || null,
      education: form.education || null,
      certifications: form.certifications || null,
      sg_experience_years: form.sgYears ? parseFloat(form.sgYears) : null,
      sg_experience_period: form.sgPeriod || null,
      other_experience_years: form.otherYears ? parseFloat(form.otherYears) : null,
      other_experience_period: form.otherPeriod || null,
      last_drawn_salary: form.lastSalary ? parseInt(form.lastSalary, 10) : null,
      expected_salary: form.expectedSalary ? parseInt(form.expectedSalary, 10) : null,
    });
    if (wErr) { setErr(wErr.message); setLoading(false); return; }

    setLoading(false);
    nav({ to: "/worker" });
  }

  return (
    <AppShell role="public">
      <div className="mx-auto max-w-xl px-4 py-12 md:px-6">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back</Link>
        <h1 className="mt-4 text-3xl font-bold">Worker signup</h1>
        <p className="mt-1 text-muted-foreground">Free for workers. Always.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6">
          <Field label="Full name" value={form.name} onChange={upd("name")} required />
          <Field label="Email" type="email" value={form.email} onChange={upd("email")} required />
          <PasswordField value={form.password} onChange={upd("password")} />
          <Field label="Mobile number" value={form.mobile} onChange={upd("mobile")} placeholder="+65 / +91 ..." required />

          <Select label="Nationality" value={form.nationality} onChange={upd("nationality")} options={NATIONALITIES} />
          <Field label="Date of birth" type="date" value={form.dob} onChange={upd("dob")} required />
          <Select label="Language" value={form.language} onChange={upd("language")} options={LANGUAGES} />
          <Select label="Sector" value={form.sector} onChange={upd("sector")} options={SECTORS} />
          <Field label="Years of experience" type="number" min={0} value={form.years} onChange={upd("years")} required />

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Skills</span>
            <textarea value={form.skills} onChange={upd("skills")} rows={3} placeholder="e.g. scaffolding, welding, rigging"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </label>

          <Field label="Work pass end date (optional)" type="date" value={form.workPassEnd} onChange={upd("workPassEnd")} />

          <div className="pt-2">
            <h2 className="text-sm font-semibold text-muted-foreground">Education & experience</h2>
          </div>
          <Field label="Education" value={form.education} onChange={upd("education")} placeholder="e.g. High school, Diploma in welding" />
          <Field label="Certifications (optional)" value={form.certifications} onChange={upd("certifications")} placeholder="e.g. WSH, Forklift license" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Singapore experience (years)" type="number" min={0} step="0.5" value={form.sgYears} onChange={upd("sgYears")} />
            <Field label="Period (e.g. 2019–2024)" value={form.sgPeriod} onChange={upd("sgPeriod")} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Other experience (years)" type="number" min={0} step="0.5" value={form.otherYears} onChange={upd("otherYears")} />
            <Field label="Period (e.g. 2015–2019)" value={form.otherPeriod} onChange={upd("otherPeriod")} />
          </div>

          <Field label="Last drawn salary (SGD/month)" type="number" min={0} value={form.lastSalary} onChange={upd("lastSalary")} />
          <Field label="Expected salary (SGD/month)" type="number" min={0} value={form.expectedSalary} onChange={upd("expectedSalary")} />


          {err && <p className="text-sm text-destructive">{err}</p>}

          <button disabled={loading} className="w-full rounded-md bg-accent py-3 font-semibold text-accent-foreground hover:opacity-90 disabled:opacity-60">
            {loading ? "Creating..." : "Create free account"}
          </button>
          <p className="text-center text-xs text-muted-foreground">You will never be charged. Ever.</p>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Log in</Link>
          </p>
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

function PasswordField({ value, onChange }: { value: string; onChange: React.ChangeEventHandler<HTMLInputElement> }) {
  const [show, setShow] = useState(false);
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">Password</span>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          required
          placeholder="Choose a password"
          className="w-full rounded-md border border-input bg-background px-3 py-2 pr-16 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </label>
  );
}
