import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { LangToggle, useLang } from "@/lib/lang";

type Role = "worker" | "public";

const NAV: { to: string; en: string; ta: string }[] = [
  { to: "/worker",                en: "Dashboard",      ta: "முகப்பு" },
  { to: "/worker/profile",        en: "My Profile",     ta: "சுயவிவரம்" },
  { to: "/worker/preview",   en: "Preview",        ta: "முன்னோட்டம்" },
  { to: "/guide/certifications",  en: "Cert Guide",     ta: "சான்றிதழ் வழிகாட்டி" },
];

export function AppShell({ role, children }: { role: Role; children: React.ReactNode }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">B</div>
            <span className="text-lg font-bold tracking-tight">BridgeWork</span>
          </Link>

          {role === "worker" && (
            <nav className="hidden items-center gap-1 lg:flex">
              {NAV.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  activeProps={{ className: "rounded-md px-3 py-2 text-sm font-semibold bg-secondary text-foreground" }}
                >
                  {t(item.en, item.ta)}
                </Link>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-2">
            <LangToggle />
            {role === "worker" ? (
              <Link to="/" className="hidden rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground md:inline-block">
                {t("Sign out", "வெளியேறு")}
              </Link>
            ) : (
              <Link to="/login" className="hidden rounded-md px-3 py-1.5 text-sm font-medium text-primary hover:underline md:inline-block">
                {t("Login", "உள்நுழைக")}
              </Link>
            )}
            {role === "worker" && (
              <button className="rounded-md p-2 lg:hidden" onClick={() => setOpen(v => !v)} aria-label="Menu">
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            )}
          </div>
        </div>
        {open && role === "worker" && (
          <div className="border-t border-border lg:hidden">
            <nav className="flex flex-col p-2">
              {NAV.map(item => (
                <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-secondary">
                  {t(item.en, item.ta)}
                </Link>
              ))}
              <Link to="/" onClick={() => setOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary">
                {t("Sign out", "வெளியேறு")}
              </Link>
            </nav>
          </div>
        )}
      </header>
      <main>{children}</main>
      <footer className="mt-16 border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground md:px-6">
          <p className="font-medium text-foreground">{t("Need help in Singapore?", "சிங்கப்பூரில் உதவி தேவையா?")}</p>
          <p className="mt-1">
            MOM Helpline: <a href="tel:64385122" className="font-semibold text-foreground hover:underline">6438 5122</a>
            {" · "}
            Migrant Workers' Centre: <a href="tel:65362692" className="font-semibold text-foreground hover:underline">6536 2692</a>
          </p>
          <p className="mt-4 text-xs">© BridgeWork. {t("Free for workers. Always.", "எப்போதும் இலவசம்.")}</p>
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

export function StatusPill({ kind, children }: { kind: "success" | "warning" | "danger" | "muted"; children: React.ReactNode }) {
  const map = {
    success: "bg-[color-mix(in_oklab,var(--success)_15%,transparent)] text-success",
    warning: "bg-[color-mix(in_oklab,var(--warning)_20%,transparent)] text-[color-mix(in_oklab,var(--warning)_70%,black)]",
    danger:  "bg-[color-mix(in_oklab,var(--danger)_12%,transparent)] text-danger",
    muted:   "bg-secondary text-muted-foreground",
  } as const;
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[kind]}`}>{children}</span>;
}
