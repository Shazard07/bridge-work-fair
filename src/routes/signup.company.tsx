import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Building2, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/signup/company")({
  head: () => ({ meta: [{ title: "Company Signup — Coming Soon — getWorkers" }] }),
  component: CompanySignupClosed,
});

function CompanySignupClosed() {
  return (
    <AppShell role="public">
      <div className="mx-auto max-w-xl px-4 py-12 md:px-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="mt-8 rounded-xl border border-border bg-card p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <h1 className="mt-4 text-2xl font-bold">Company sign-ups are temporarily closed</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We are currently focused on onboarding workers. Company registrations will reopen soon.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/signup/worker"
              className="inline-flex w-full items-center justify-center rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground hover:opacity-90"
            >
              I'm a Worker — Sign Up
            </Link>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

