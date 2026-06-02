import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/signup/company")({
  head: () => ({ meta: [{ title: "Company Signup — getWorkers" }] }),
  component: CompanySignup,
});

const SECTORS = ["Construction", "Marine"] as const;
const WORK_PASS = ["Work Permit", "S Pass", "Both"] as const;

function CompanySignup() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    companyName: "", uen: "",
    sector: "Construction" as typeof SECTORS[number],
    contactName: "", contactPhone: "",
    email: "", password: "",
    workPass: "Both" as typeof WORK_PASS[number],
  });
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const upd = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email, password: form.password,
      options: { emailRedirectTo: `${window.location.origin}/company` },
    });
    if (error) { setErr(error.message); setLoading(false); return; }
    const user = data.user;
    if (!user) { setErr("Check your email to confirm your account, then log in."); setLoading(false); return; }

    const { error: pErr } = await supabase.from("profiles").insert({
      user_id: user.id, role: "company", full_name: form.contactName, phone: form.contactPhone,
    });
    if (pErr) { setErr(pErr.message); setLoading(false); return; }

    const { error: cErr } = await supabase.from("company_profiles").insert({
      user_id: user.id,
      company_name: form.companyName,
      uen: form.uen,
      sector: form.sector,
      contact_name: form.contactName,
      contact_phone: form.contactPhone,
      work_pass_accepted: form.workPass,
    });
    if (cErr) { setErr(cErr.message); setLoading(false); return; }

    setLoading(false);
    nav({ to: "/company" });
  }

  return (
    <AppShell role="public">
      <div className="mx-auto max-w-xl px-4 py-12 md:px-6">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back</Link>
        <h1 className="mt-4 text-3xl font-bold">Company signup</h1>
        <p className="mt-1 text-muted-foreground">Post jobs and hire directly. Transparent hiring.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6">
          <Field label="Company name" value={form.companyName} onChange={upd("companyName")} required />
          <Field label="UEN" value={form.uen} onChange={upd("uen")} required />
          <Select label="Sector" value={form.sector} onChange={upd("sector")} options={SECTORS} />
          <Field label="Contact person name" value={form.contactName} onChange={upd("contactName")} required />
          <Field label="Contact person number" value={form.contactPhone} onChange={upd("contactPhone")} required />
          <Field label="Email" type="email" value={form.email} onChange={upd("email")} required />
          <Field label="Password" type="password" value={form.password} onChange={upd("password")} required minLength={6} />
          <Select label="Work pass types accepted" value={form.workPass} onChange={upd("workPass")} options={WORK_PASS} />

          {err && <p className="text-sm text-destructive">{err}</p>}

          <button disabled={loading} className="w-full rounded-md bg-primary py-3 font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">
            {loading ? "Creating..." : "Create company account"}
          </button>
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
