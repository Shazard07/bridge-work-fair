import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useState } from "react";
import { DISTRICTS } from "@/lib/data";
import { LangToggle, useLang } from "@/lib/lang";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/signup/worker")({
  head: () => ({ meta: [{ title: "Worker Signup — BridgeWork" }] }),
  component: WorkerSignup,
});

function WorkerSignup() {
  const nav = useNavigate();
  const { t } = useLang();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", district: "Chennai" });
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const upd = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { emailRedirectTo: `${window.location.origin}/worker` },
    });
    if (error) { setErr(error.message); setLoading(false); return; }
    const user = data.user;
    if (!user) { setErr(t("Check your email to confirm your account, then log in.", "உங்கள் கணக்கை உறுதிப்படுத்த மின்னஞ்சலைப் பார்க்கவும்.")); setLoading(false); return; }

    const { error: pErr } = await supabase.from("profiles").insert({
      user_id: user.id, role: "worker", full_name: form.name, phone: form.phone,
    });
    if (pErr) { setErr(pErr.message); setLoading(false); return; }

    const { error: wErr } = await supabase.from("worker_profiles").insert({
      user_id: user.id, district: form.district,
    });
    if (wErr) { setErr(wErr.message); setLoading(false); return; }

    setLoading(false);
    nav({ to: "/worker/profile" });
  }

  return (
    <AppShell role="public">
      <div className="mx-auto max-w-xl px-4 py-12 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← {t("Back", "திரும்பு")}</Link>
          <LangToggle />
        </div>
        <h1 className="mt-4 text-3xl font-bold font-tamil">{t("Worker signup", "தொழிலாளர் பதிவு")}</h1>
        <p className="mt-1 text-muted-foreground font-tamil">{t("Free for workers. Always.", "தொழிலாளர்களுக்கு இலவசம். எப்போதும்.")}</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6">
          <Field label={t("Full name", "முழு பெயர்")} value={form.name} onChange={upd("name")} required />
          <Field label={t("Email", "மின்னஞ்சல்")} type="email" value={form.email} onChange={upd("email")} required />
          <Field label={t("Phone number", "தொலைபேசி எண்")} value={form.phone} onChange={upd("phone")} placeholder="+91 ..." required />
          <Field label={t("Password", "கடவுச்சொல்")} type="password" value={form.password} onChange={upd("password")} required minLength={6} />

          <div>
            <span className="mb-1.5 block text-sm font-medium font-tamil">{t("District", "மாவட்டம்")}</span>
            <select value={form.district} onChange={upd("district")} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
              {DISTRICTS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-md bg-secondary/50 p-3 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Country</div>
              <div className="font-medium">India 🇮🇳</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">State</div>
              <div className="font-medium">Tamil Nadu</div>
            </div>
          </div>

          {err && <p className="text-sm text-destructive">{err}</p>}

          <button disabled={loading} className="w-full rounded-md bg-accent py-3 font-semibold text-accent-foreground transition-colors hover:opacity-90 disabled:opacity-60 font-tamil">
            {loading ? "..." : t("Create free account", "இலவச கணக்கை உருவாக்கு")}
          </button>
          <p className="text-center text-xs text-muted-foreground font-tamil">{t("You will never be charged. Ever.", "உங்களிடம் எப்போதும் கட்டணம் வசூலிக்கப்படாது.")}</p>
          <p className="text-center text-sm text-muted-foreground font-tamil">
            {t("Already have an account?", "ஏற்கனவே கணக்கு உள்ளதா?")}{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">{t("Log in", "உள்நுழை")}</Link>
          </p>
        </form>
      </div>
    </AppShell>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium font-tamil">{label}</span>
      <input {...props}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
    </label>
  );
}
