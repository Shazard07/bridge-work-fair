import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { UserPlus, Building2, Handshake, ShieldCheck, CheckCircle, Eye, Users } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "getWorkers — Direct hiring in Singapore. $0 placement fees." },
      { name: "description", content: "Connect migrant workers and Singapore businesses directly. No agent fees, ever." },
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
              Direct hiring in Singapore. <span className="text-accent">Zero agent fees.</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              getWorkers connects migrant workers and Singapore businesses directly — no brokers, no debt, no hidden costs.
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
        <p className="mt-2 text-center text-muted-foreground">No middlemen. No fees.</p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: UserPlus, title: "Sign up free", body: "Workers and companies create profiles in minutes." },
            { icon: Handshake, title: "Match directly", body: "Workers apply, companies review. Connect without any agent in the middle." },
            { icon: Building2, title: "Hire — $0 fee", body: "No placement fee. No debt. Workers keep their full salary." },
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
            <h2 className="text-3xl font-bold md:text-4xl">No broker. No debt. No hidden fees.</h2>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-2">
            <div className="rounded-xl border-2 border-danger/30 bg-danger/5 p-6">
              <div className="flex items-center gap-2 text-danger"><X className="h-5 w-5" /><span className="text-sm font-bold uppercase tracking-wide">Traditional Agents</span></div>
              <p className="mt-4 text-3xl font-extrabold">$5,000–$15,000 <span className="text-base font-medium text-muted-foreground">SGD</span></p>
              <p className="mt-2 text-sm text-muted-foreground">Worker pays brokers before arriving. Arrives in debt.</p>
            </div>
            <div className="rounded-xl border-2 border-success/40 bg-success/5 p-6">
              <div className="flex items-center gap-2 text-success"><Check className="h-5 w-5" /><span className="text-sm font-bold uppercase tracking-wide">getWorkers</span></div>
              <p className="mt-4 text-3xl font-extrabold">$0 <span className="text-base font-medium text-muted-foreground">Always.</span></p>
              <p className="mt-2 text-sm text-muted-foreground">Worker pays nothing. Companies pay no commission to brokers.</p>
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
