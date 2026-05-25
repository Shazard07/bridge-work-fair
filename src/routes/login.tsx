import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useLang } from "@/lib/lang";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — BridgeWork" },
      { name: "description", content: "Sign in to your BridgeWork worker profile." },
    ],
  }),
  component: Login,
});

function Login() {
  const { t } = useLang();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  return (
    <AppShell role="public">
      <div className="mx-auto max-w-md px-4 py-12 md:py-16">
        <h1 className="text-3xl font-bold">{t("Welcome back", "மீண்டும் வரவேற்கிறோம்")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("Sign in to your profile.", "உங்கள் சுயவிவரத்திற்கு உள்நுழையவும்.")}</p>
        <form
          className="mt-8 space-y-4"
          onSubmit={e => { e.preventDefault(); nav({ to: "/worker" }); }}
        >
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">{t("Email", "மின்னஞ்சல்")}</span>
            <Input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">{t("Password", "கடவுச்சொல்")}</span>
            <Input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </label>
          <Button type="submit" className="h-12 w-full bg-accent text-accent-foreground hover:opacity-90">
            {t("Sign in", "உள்நுழைக")}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t("New here?", "புதியவரா?")}{" "}
          <Link to="/signup" className="font-semibold text-primary hover:underline">{t("Create a profile", "சுயவிவரம் உருவாக்கு")}</Link>
        </p>
      </div>
    </AppShell>
  );
}
