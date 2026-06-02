import { Link, useRouter } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

type Role = "worker" | "company" | "public";

const NAV: Record<Exclude<Role, "public">, { to: string; label: string }[]> = {
  worker: [
    { to: "/worker", label: "My Profile" },
  ],
  company: [
    { to: "/company", label: "Find Workers" },
  ],
};

export function AppShell({ role, children }: { role: Role; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { signOut, user } = useAuth();
  const handleSignOut = async () => { await signOut(); router.navigate({ to: "/" }); };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">g</div>
            <span className="text-lg font-bold tracking-tight">getWorkers</span>
          </Link>

          {role !== "public" && (
            <nav className="hidden items-center gap-1 md:flex">
              {NAV[role].map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                  activeProps={{ className: "rounded-md px-3 py-2 text-sm font-semibold bg-secondary text-foreground" }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-2">
            {role === "public" && !user && (
              <Link to="/login" className="hidden rounded-md px-3 py-1.5 text-sm font-medium hover:bg-secondary sm:inline-block">Log in</Link>
            )}
            {role !== "public" && (
              <button onClick={handleSignOut} className="hidden rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground md:inline-block">
                Sign out
              </button>
            )}
            {role !== "public" && (
              <button className="rounded-md p-2 md:hidden" onClick={() => setOpen(v => !v)}>
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            )}
          </div>
        </div>
        {open && role !== "public" && (
          <div className="border-t border-border md:hidden">
            <nav className="flex flex-col p-2">
              {NAV[role].map(item => (
                <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-secondary">
                  {item.label}
                </Link>
              ))}
              <button onClick={handleSignOut} className="rounded-md px-3 py-2.5 text-left text-sm font-medium text-muted-foreground hover:bg-secondary">Sign out</button>
            </nav>
          </div>
        )}
      </header>
      <main>{children}</main>
      <footer className="mt-16 border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-muted-foreground md:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">Free during MVP</span>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">Workers pay nothing</span>
          </div>
          <p className="mt-4 font-medium text-foreground">Need help in Singapore?</p>
          <p className="mt-1">MOM Foreign Worker Helpline: <span className="font-semibold text-foreground">6438 5122</span></p>
          <p className="mt-4 text-xs">© getWorkers. Verified worker discovery platform.</p>
        </div>
      </footer>
    </div>
  );
}

export function SectorBadge({ sector }: { sector: "Construction" | "Marine" }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${sector === "Construction" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
      {sector}
    </span>
  );
}

export function AvailabilityBadge({ available }: { available: boolean }) {
  return available ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">
      <span className="h-1.5 w-1.5 rounded-full bg-success" /> Available now
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">Not available</span>
  );
}
