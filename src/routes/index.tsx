import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { UserPlus, Handshake, Plane, ShieldCheck, X, Check } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BridgeWork — Find work in Singapore. Pay nothing." },
      { name: "description", content: "Direct, transparent recruitment between licensed Singapore businesses and migrant workers. Workers always pay $0." },
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
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-success" />
              Licensed Singapore businesses · Zero worker fees
            </div>
            <h1 className="text-balance text-5xl font-extrabold tracking-tight text-foreground md:text-6xl">
              Find work in Singapore. <span className="text-accent">Pay nothing.</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              Workers and licensed Singapore businesses, connected directly. No middlemen, no fees.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/signup/agent"
                className="inline-flex w-full items-center justify-center rounded-md border border-primary bg-card px-6 py-3 text-base font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground sm:w-auto"
              >
                I'm a Business
              </Link>
              <Link
                to="/signup/worker"
                className="inline-flex w-full items-center justify-center rounded-md bg-accent px-6 py-3 text-base font-semibold text-accent-foreground shadow-sm transition-colors hover:opacity-90 sm:w-auto"
              >
                I'm a Worker
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-primary hover:underline">Log in</Link>
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <h2 className="text-center text-3xl font-bold tracking-tight">How it works</h2>
        <p className="mt-2 text-center text-muted-foreground">Three steps. No middlemen. No fees.</p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: UserPlus, title: "Create your free profile", body: "Sign up in minutes with just the basics." },
            { icon: Handshake, title: "Apply directly", body: "Browse jobs and apply. The business contacts you on WhatsApp." },
            { icon: Plane, title: "Go to Singapore — $0", body: "Accept an offer and travel. You pay nothing for placement." },
          ].map((s, i) => (
            <div key={i} className="relative rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
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
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">No broker. No debt. No hidden fees.</h2>
            <p className="mt-4 text-muted-foreground">
              BridgeWork connects you directly to licensed Singapore businesses. No middleman. No debt before you even start working.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-2">
            <div className="rounded-xl border-2 border-danger/30 bg-danger/5 p-6">
              <div className="flex items-center gap-2 text-danger">
                <X className="h-5 w-5" />
                <span className="text-sm font-bold uppercase tracking-wide">Traditional Route</span>
              </div>
              <p className="mt-4 text-3xl font-extrabold">$5,000–$15,000 <span className="text-base font-medium text-muted-foreground">SGD</span></p>
              <p className="mt-2 text-sm text-muted-foreground">Worker pays brokers before arriving. Arrives in debt.</p>
            </div>
            <div className="rounded-xl border-2 border-success/40 bg-success/5 p-6">
              <div className="flex items-center gap-2 text-success">
                <Check className="h-5 w-5" />
                <span className="text-sm font-bold uppercase tracking-wide">BridgeWork</span>
              </div>
              <p className="mt-4 text-3xl font-extrabold">$0 <span className="text-base font-medium text-muted-foreground">Always.</span></p>
              <p className="mt-2 text-sm text-muted-foreground">Worker pays nothing. Keeps full salary from day one.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border bg-primary text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center md:px-6">
          <h2 className="text-3xl font-bold md:text-4xl">Ready to start?</h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/signup/worker" className="inline-flex w-full items-center justify-center rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground hover:opacity-90 sm:w-auto">I'm a Worker</Link>
            <Link to="/signup/agent" className="inline-flex w-full items-center justify-center rounded-md border border-primary-foreground/30 bg-transparent px-6 py-3 font-semibold text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto">I'm a Business</Link>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
