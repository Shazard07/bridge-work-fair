import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in — BridgeWork" }] }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setErr(error.message); setLoading(false); return; }
    const userId = data.user.id;
    const { data: profile } = await supabase.from("profiles").select("role").eq("user_id", userId).maybeSingle();
    setLoading(false);
    nav({ to: profile?.role === "agent" ? "/agent" : "/worker" });
  }

  return (
    <AppShell role="public">
      <div className="mx-auto max-w-md px-4 py-12 md:px-6">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back</Link>
        <h1 className="mt-4 text-3xl font-bold">Log in</h1>
        <p className="mt-1 text-muted-foreground">Welcome back to BridgeWork.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Password</span>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </label>

          {err && <p className="text-sm text-destructive">{err}</p>}

          <button disabled={loading} className="w-full rounded-md bg-primary py-2.5 font-semibold text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-60">
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link to="/signup/agent" className="font-medium text-primary hover:underline">Agent</Link>
            {" · "}
            <Link to="/signup/worker" className="font-medium text-primary hover:underline">Worker</Link>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
