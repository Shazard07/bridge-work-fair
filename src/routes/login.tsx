import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in — BridgeWork" }] }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [role, setRole] = useState<"worker" | "business">("worker");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AppShell role="public">
      <div className="mx-auto max-w-md px-4 py-12 md:px-6">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back</Link>
        <h1 className="mt-4 text-3xl font-bold">Log in</h1>
        <p className="mt-1 text-muted-foreground">Welcome back to BridgeWork.</p>

        <div className="mt-6 grid grid-cols-2 rounded-md border border-border bg-card p-1">
          {(["worker", "business"] as const).map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`rounded px-3 py-2 text-sm font-semibold capitalize transition-colors ${role === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
            >
              I'm a {r}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); nav({ to: role === "worker" ? "/worker" : "/agent" }); }}
          className="mt-6 space-y-4 rounded-xl border border-border bg-card p-6"
        >
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Email</span>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Password</span>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </label>
          <button className="w-full rounded-md bg-primary py-2.5 font-semibold text-primary-foreground hover:opacity-90">
            Log in
          </button>
          <p className="text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link to={role === "worker" ? "/signup/worker" : "/signup/agent"} className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </AppShell>
  );
}
