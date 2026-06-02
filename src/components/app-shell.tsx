import { Link, useRouter } from "@tanstack/react-router";
import { Bell, Menu, X } from "lucide-react";
import { useState } from "react";
import { LangToggle, useLang } from "@/lib/lang";
import { NOTIFICATIONS_AGENT, NOTIFICATIONS_WORKER } from "@/lib/data";
import { useAuth } from "@/hooks/use-auth";

type Role = "agent" | "worker" | "public";

const NAV: Record<Role, { to: string; en: string; ta: string }[]> = {
  agent: [
    { to: "/agent", en: "Dashboard", ta: "Dashboard" },
    { to: "/agent/jobs/new", en: "Post Job", ta: "Post Job" },
    { to: "/agent/workers", en: "Browse Workers", ta: "Browse Workers" },
    { to: "/agent/pipeline", en: "Pipeline", ta: "Pipeline" },
    { to: "/fees", en: "Fee Promise", ta: "Fee Promise" },
  ],
  worker: [
    { to: "/worker", en: "Dashboard", ta: "முகப்பு" },
    { to: "/worker/jobs", en: "Browse Jobs", ta: "வேலைகள்" },
    { to: "/worker/applications", en: "My Applications", ta: "எனது விண்ணப்பங்கள்" },
    { to: "/worker/profile", en: "Profile", ta: "சுயவிவரம்" },
    { to: "/fees", en: "Fee Promise", ta: "கட்டண உறுதிமொழி" },
  ],
  public: [],
};

export function AppShell({ role, children }: { role: Role; children: React.ReactNode }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { signOut } = useAuth();
  const [bellOpen, setBellOpen] = useState(false);
  const notes = role === "agent" ? NOTIFICATIONS_AGENT : NOTIFICATIONS_WORKER;
  const unread = notes.filter(n => n.unread).length;
  const handleSignOut = async () => { await signOut(); router.navigate({ to: "/" }); };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">B</div>
            <span className="text-lg font-bold tracking-tight">BridgeWork</span>
          </Link>

          {role !== "public" && (
            <nav className="hidden items-center gap-1 lg:flex">
              {NAV[role].map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  activeProps={{ className: "rounded-md px-3 py-2 text-sm font-semibold bg-secondary text-foreground" }}
                >
                  <span className={role === "worker" ? "font-tamil" : ""}>{role === "worker" ? t(item.en, item.ta) : item.en}</span>
                </Link>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-2">
            {role === "worker" && <LangToggle />}
            {role !== "public" && (
              <div className="relative">
                <button onClick={() => setBellOpen(v => !v)} className="relative rounded-full p-2 hover:bg-secondary">
                  <Bell className="h-5 w-5" />
                  {unread > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-accent" />}
                </button>
                {bellOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
                    <div className="border-b border-border px-4 py-3 font-semibold">Notifications</div>
                    <div className="max-h-80 overflow-y-auto">
                      {notes.map(n => (
                        <div key={n.id} className={`border-b border-border px-4 py-3 text-sm last:border-b-0 ${n.unread ? "bg-secondary/50" : ""}`}>
                          <p>{n.text}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {role !== "public" && (
              <button onClick={handleSignOut} className="hidden rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground md:inline-block">
                Sign out
              </button>
            )}
            {role !== "public" && (
              <button className="rounded-md p-2 lg:hidden" onClick={() => setOpen(v => !v)}>
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            )}
          </div>
        </div>
        {open && role !== "public" && (
          <div className="border-t border-border lg:hidden">
            <nav className="flex flex-col p-2">
              {NAV[role].map(item => (
                <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-secondary">
                  <span className={role === "worker" ? "font-tamil" : ""}>{role === "worker" ? t(item.en, item.ta) : item.en}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
      <main>{children}</main>
      <footer className="mt-16 border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-muted-foreground md:px-6">
          <p className="font-medium text-foreground">Need help in Singapore?</p>
          <p className="mt-1">MOM Foreign Worker Helpline: <span className="font-semibold text-foreground">6438 5122</span> · Migrant Workers' Centre: <span className="font-semibold text-foreground">6536 2692</span></p>
          <p className="mt-4 text-xs">© BridgeWork. A transparent recruitment marketplace. Workers pay nothing — ever.</p>
        </div>
      </footer>
    </div>
  );
}

export function SectorBadge({ sector }: { sector: "Construction" | "Marine" }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{
        backgroundColor: sector === "Construction" ? "color-mix(in oklab, var(--construction) 15%, transparent)" : "color-mix(in oklab, var(--marine) 15%, transparent)",
        color: sector === "Construction" ? "var(--construction)" : "var(--marine)",
      }}
    >
      {sector}
    </span>
  );
}
