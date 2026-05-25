import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useLang } from "@/lib/lang";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up — BridgeWork" },
      { name: "description", content: "Create your free BridgeWork worker profile." },
    ],
  }),
  component: Signup,
});

function Signup() {
  const { t } = useLang();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  return (
    <AppShell role="public">
      <div className="mx-auto max-w-md px-4 py-12 md:py-16">
        <h1 className="text-3xl font-bold">{t("Create your free profile", "உங்கள் இலவச சுயவிவரத்தை உருவாக்குங்கள்")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("Takes 2 minutes. No payment ever.", "2 நிமிடங்கள். எந்த கட்டணமும் இல்லை.")}</p>
        <form
          className="mt-8 space-y-4"
          onSubmit={e => { e.preventDefault(); nav({ to: "/worker/profile" }); }}
        >
          <Field label={t("Full name", "முழு பெயர்")}>
            <Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label={t("Email", "மின்னஞ்சல்")}>
            <Input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label={t("Singapore phone number", "சிங்கப்பூர் தொலைபேசி எண்")}>
            <Input type="tel" required placeholder="+65 ..." value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </Field>
          <Field label={t("Password", "கடவுச்சொல்")}>
            <Input type="password" required minLength={6} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </Field>
          <Button type="submit" className="h-12 w-full bg-accent text-accent-foreground hover:opacity-90">
            {t("Create profile", "சுயவிவரத்தை உருவாக்கு")}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t("Already have an account?", "ஏற்கனவே கணக்கு உள்ளதா?")}{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">{t("Login", "உள்நுழைக")}</Link>
        </p>
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
