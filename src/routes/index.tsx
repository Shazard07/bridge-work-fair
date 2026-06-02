import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { UserPlus, Building2, Handshake, ShieldCheck, CheckCircle, Eye, Users } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "getWorkers — Transparent hiring in Singapore. Verified workers. Trusted companies." },
      { name: "description", content: "Transparent hiring connecting verified migrant workers with trusted Singapore companies. No hidden fees." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <AppShell role="public">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-success" />
              $0 placement fee · Always
            </div>
            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Transparent hiring. <span className="text-accent">Verified workers.</span> Trusted companies.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              getWorkers connects verified workers with trusted Singapore companies — transparent, reliable, and efficient.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/signup/worker" className="inline-flex w-full items-center justify-center rounded-md bg-accent px-6 py-3 text-base font-semibold text-accent-foreground hover:opacity-90 sm:w-auto">
                I'm a Worker
              </Link>
              <Link to="/signup/company" className="inline-flex w-full items-center justify-center rounded-md border border-primary bg-card px-6 py-3 text-base font-semibold text-primary hover:bg-primary hover:text-primary-foreground sm:w-auto">
                I'm a Company
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Log in</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-secondary/30">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-4 py-10 md:grid-cols-4 md:px-6">
          {[
            { v: "$0", l: "Placement fee" },
            { v: "4", l: "Nationalities supported" },
            { v: "2", l: "Sectors (Construction & Marine)" },
            { v: "100%", l: "Direct connections" },
          ].map(s => (
            <div key={s.l} className="text-center">
              <div className="text-3xl font-extrabold text-foreground md:text-4xl">{s.v}</div>
              <div className="mt-1 text-xs text-muted-foreground md:text-sm">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight">How it works</h2>
        <p className="mt-2 text-center text-muted-foreground">Simple. Transparent. Direct.</p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: UserPlus, title: "Sign up free", body: "Workers and companies create verified profiles in minutes." },
            { icon: Handshake, title: "Match directly", body: "Workers apply, companies review. Connect transparently with full visibility." },
            { icon: Building2, title: "Hire with confidence", body: "Clear terms. Fair wages. No hidden costs. Both sides know exactly what to expect." },
          ].map((s, i) => (
            <div key={i} className="relative rounded-xl border border-border bg-card p-6">
              <div className="absolute -top-3 left-6 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</div>
              <s.icon className="h-8 w-8 text-accent" strokeWidth={1.5} />
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Transparent. Verified. Trusted.</h2>
            <p className="mt-3 text-muted-foreground">Built for clarity and confidence on both sides.</p>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-6">
              <Eye className="h-6 w-6 text-primary" strokeWidth={1.5} />
              <h3 className="mt-3 text-lg font-semibold">Transparent Process</h3>
              <p className="mt-2 text-sm text-muted-foreground">Salaries, terms, and expectations are visible upfront. No surprises.</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <Users className="h-6 w-6 text-accent" strokeWidth={1.5} />
              <h3 className="mt-3 text-lg font-semibold">Verified Profiles</h3>
              <p className="mt-2 text-sm text-muted-foreground">Worker skills and company details visible to both sides before any connection.</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <CheckCircle className="h-6 w-6 text-success" strokeWidth={1.5} />
              <h3 className="mt-3 text-lg font-semibold">Trusted Connections</h3>
              <p className="mt-2 text-sm text-muted-foreground">Direct communication between workers and companies. No delays, no opacity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-primary text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center md:px-6">
          <h2 className="text-3xl font-bold md:text-4xl">Ready to start?</h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/signup/worker" className="inline-flex w-full items-center justify-center rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground hover:opacity-90 sm:w-auto">I'm a Worker</Link>
            <Link to="/signup/company" className="inline-flex w-full items-center justify-center rounded-md border border-primary-foreground/30 bg-transparent px-6 py-3 font-semibold text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto">I'm a Company</Link>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
