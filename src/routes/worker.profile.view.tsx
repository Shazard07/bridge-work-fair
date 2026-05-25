import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, SectorBadge, StatusPill } from "@/components/app-shell";
import { useLang } from "@/lib/lang";
import { useProfile } from "@/lib/profile-store";
import { STANDARD_CERT_KEYS, CERT_META, certStatus, availabilityStatus, daysFromToday } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, MapPin, Briefcase, Calendar } from "lucide-react";

export const Route = createFileRoute("/worker/profile/view")({
  head: () => ({
    meta: [
      { title: "Profile preview — BridgeWork" },
      { name: "description", content: "Preview your worker profile as agents will see it." },
    ],
  }),
  component: ProfileView,
});

function ProfileView() {
  const { t } = useLang();
  const { profile, ready } = useProfile();
  if (!ready) return <AppShell role="worker"><div className="p-8" /></AppShell>;

  const status = availabilityStatus(profile.contractEnd);
  const days = daysFromToday(profile.contractEnd);

  return (
    <AppShell role="worker">
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
        <p className="mb-4 rounded-md bg-secondary/60 px-3 py-2 text-center text-xs text-muted-foreground">
          {t("This is how agents will see your profile.", "முகவர்கள் உங்கள் சுயவிவரத்தை இப்படித்தான் பார்ப்பார்கள்.")}
        </p>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold">{profile.fullName || "—"}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                  {profile.sector && <SectorBadge sector={profile.sector} />}
                  {profile.jobTitle && <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold"><Briefcase className="h-3 w-3" />{profile.jobTitle}</span>}
                  {profile.district && <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{profile.district}</span>}
                </div>
              </div>
              <div>
                {status === "Available Now" && <StatusPill kind="success">{t("Available Now", "இப்போது கிடைக்கும்")}</StatusPill>}
                {status === "Available Soon" && <StatusPill kind="warning">{t(`Available from ${profile.availableFrom}`, `கிடைக்கும்: ${profile.availableFrom}`)}</StatusPill>}
                {status === "Currently Employed" && <StatusPill kind="muted">{t("Currently Employed", "தற்போது வேலையில்")}</StatusPill>}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4 text-sm">
              <span><b>{profile.yearsBand || "—"}</b> {t("years SG experience", "சிங்கப்பூர் அனுபவம்")}</span>
              {days !== null && days > 0 && <span className="text-muted-foreground">· {t("Contract ends in", "ஒப்பந்தம் முடிய")} {days} {t("days", "நாட்கள்")}</span>}
            </div>
          </CardContent>
        </Card>

        {profile.skillsText && (
          <SectionCard title={t("Skills", "திறன்கள்")} editStep={2}>
            <p className="text-sm leading-relaxed">{profile.skillsText}</p>
          </SectionCard>
        )}

        <SectionCard title={t("Certifications", "சான்றிதழ்கள்")} editStep={3}>
          <div className="grid gap-2 md:grid-cols-2">
            {STANDARD_CERT_KEYS.map(k => {
              const s = certStatus(profile.certs[k]);
              const uploaded = s !== "Not uploaded";
              return (
                <div key={k} className={`flex items-center gap-2 rounded-md border p-2.5 text-sm ${uploaded ? "border-border bg-background" : "border-dashed border-border bg-secondary/30 opacity-60"}`}>
                  <Award className={`h-4 w-4 ${s === "Valid" ? "text-success" : s === "Expiring Soon" ? "text-warning" : s === "Expired" ? "text-danger" : "text-muted-foreground"}`} />
                  <span className="flex-1 font-medium">{t(CERT_META[k].en, CERT_META[k].ta)}</span>
                  {uploaded && (
                    <>
                      {s === "Valid" && <StatusPill kind="success">Valid</StatusPill>}
                      {s === "Expiring Soon" && <StatusPill kind="warning">Expiring</StatusPill>}
                      {s === "Expired" && <StatusPill kind="danger">Expired</StatusPill>}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title={t("Work history", "வேலை வரலாறு")} editStep={2}>
          {profile.employer && (
            <Timeline entries={[
              { title: profile.jobTitle || t("Current role", "தற்போதைய பணி"), company: profile.employer, period: t("Now", "இப்போது"), current: true },
              ...profile.previousEmployers.map(e => ({
                title: e.jobTitle, company: e.company,
                period: `${e.startMonth || "?"} – ${e.endMonth || "?"}`,
                current: false,
              })),
            ]} />
          )}
        </SectionCard>

        <SectionCard title={t("Availability", "கிடைக்கும் தன்மை")} editStep={4}>
          <div className="grid gap-2 text-sm md:grid-cols-2">
            <Row icon={Calendar} label={t("From", "தேதியிலிருந்து")} value={profile.availableFrom || "—"} />
            <Row icon={Briefcase} label={t("Preferred sector", "விருப்ப துறை")} value={profile.nextSector || "—"} />
            <Row icon={Calendar} label={t("Duration", "காலம்")} value={profile.preferredDuration || "—"} />
            <Row icon={Briefcase} label={t("Open to", "ஏற்க தயார்")} value={profile.openTo || "—"} />
          </div>
          {profile.availabilityNotes && <p className="mt-3 rounded-md bg-secondary/40 p-3 text-sm">{profile.availabilityNotes}</p>}
        </SectionCard>

        <div className="mt-6 flex justify-center">
          <Button asChild variant="outline"><Link to="/worker/profile">{t("Edit profile", "சுயவிவரத்தை திருத்து")}</Link></Button>
        </div>
      </div>
    </AppShell>
  );
}

function SectionCard({ title, children, editStep }: { title: string; children: React.ReactNode; editStep: number }) {
  const { t } = useLang();
  return (
    <Card className="mt-5">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Link to="/worker/profile" search={{ step: editStep }} className="text-xs font-medium text-primary hover:underline">{t("Edit", "திருத்து")}</Link>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function Row({ icon: Icon, label, value }: { icon: typeof Calendar; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border p-2.5">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="text-xs text-muted-foreground">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function Timeline({ entries }: { entries: { title: string; company: string; period: string; current: boolean }[] }) {
  return (
    <ol className="relative ml-3 border-l border-border">
      {entries.map((e, i) => (
        <li key={i} className="mb-4 ml-4 last:mb-0">
          <div className={`absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full ${e.current ? "bg-accent ring-4 ring-accent/20" : "bg-border"}`} />
          <p className="font-semibold">{e.title}</p>
          <p className="text-sm text-muted-foreground">{e.company} · {e.period}</p>
        </li>
      ))}
    </ol>
  );
}
