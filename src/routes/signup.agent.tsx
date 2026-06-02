import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/signup/agent")({
  head: () => ({ meta: [{ title: "Agent Signup — BridgeWork" }] }),
  component: AgentSignup,
});

function AgentSignup() {
  const nav = useNavigate();
  const [form, setForm] = useState({ company: "", license: "", contact: "", email: "", password: "", phone: "" });
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const upd = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { emailRedirectTo: `${window.location.origin}/agent` },
    });
    if (error) { setErr(error.message); setLoading(false); return; }
    const user = data.user;
    if (!user) { setErr("Check your email to confirm your account, then log in."); setLoading(false); return; }

    const { error: pErr } = await supabase.from("profiles").insert({
      user_id: user.id, role: "agent", full_name: form.contact, phone: form.phone,
    });
    if (pErr) { setErr(pErr.message); setLoading(false); return; }

    const { error: aErr } = await supabase.from("agent_profiles").insert({
      user_id: user.id, company_name: form.company, ea_license_number: form.license, contact_name: form.contact,
    });
    if (aErr) { setErr(aErr.message); setLoading(false); return; }

    setLoading(false);
    nav({ to: "/agent" });
  }

  return (
    <AppShell role="public">
      <div className="mx-auto max-w-xl px-4 py-12 md:px-6">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back</Link>
        <h1 className="mt-4 text-3xl font-bold">Agent signup</h1>
        <p className="mt-1 text-muted-foreground">Licensed Singapore EA agencies only.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6">
          <Field label="Company name" value={form.company} onChange={upd("company")} required />
          <Field label="EA license number" value={form.license} onChange={upd("license")} placeholder="e.g. EA123456" required />
          <Field label="Contact person name" value={form.contact} onChange={upd("contact")} required />
          <Field label="Email" type="email" value={form.email} onChange={upd("email")} required />
          <Field label="Phone number" value={form.phone} onChange={upd("phone")} placeholder="+65 ..." required />
          <Field label="Password" type="password" value={form.password} onChange={upd("password")} required minLength={6} />

          <div className="flex items-start gap-3 rounded-md bg-secondary/50 p-3 text-sm text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
            <p>Your account will be marked <strong>Pending Verification</strong> until we confirm your EA license.</p>
          </div>

          {err && <p className="text-sm text-destructive">{err}</p>}

          <button disabled={loading} className="w-full rounded-md bg-primary py-2.5 font-semibold text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-60">
            {loading ? "Creating..." : "Create account"}
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
      <input {...props}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
    </label>
  );
}
