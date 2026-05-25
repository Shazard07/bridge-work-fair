import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, StatusPill } from "@/components/app-shell";
import { useLang } from "@/lib/lang";
import { useProfile } from "@/lib/profile-store";
import {
  STANDARD_CERT_KEYS, CERT_META, certStatus, daysFromToday,
  availabilityStatus, profileStrength,
} from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleProgress } from "@/components/circle-progress";
import { Eye, EyeOff, Copy, Heart, Frown, Meh, Smile, Phone } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/worker/")({
  head: () => ({
    meta: [
      { title: "Dashboard — BridgeWork" },
      { name: "description", content: "Your profile completion, contract countdown, certification status and visibility." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { t } = useLang();
  const { profile, save, ready } = useProfile();
  const [mood, setMood] = useState<"good" | "okay" | "issues" | null>(null);
  const [issueText, setIssueText] = useState("");

  if (!ready) return <AppShell role="worker"><div className="p-8" /></AppShell>;

  const strength = profileStrength(profile);
  const days = daysFromToday(profile.contractEnd);
  const availStatus = availabilityStatus(profile.contractEnd);
  const uploadedCerts = STANDARD_CERT_KEYS.filter(k => profile.certs[k]?.fileName);

  return (
    <AppShell role="worker">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <h1 className="text-2xl font-bold md:text-3xl">{t("Welcome", "வணக்கம்")}, {profile.fullName || t("Worker", "தொழிலாளி")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("Keep your profile up to date so you're ready for what's next.", "அடுத்தது வரும்போது தயாராக இருக்க உங்கள் சுயவிவரத்தை புதுப்பித்து வைக்கவும்.")}</p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {/* Profile completion */}
          <Card>
            <CardHeader><CardTitle>{t("Profile completion", "சுயவிவர முழுமை")}</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-5">
                <CircleProgress value={strength.pct} />
                <div className="flex-1">
                  <p className="text-2xl font-bold">{strength.pct}%</p>
                  {strength.missing.length > 0 ? (
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {strength.missing.slice(0, 3).map(m => <li key={m}>• {m}</li>)}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-success font-medium">🏆 {t("All done. Great work!", "அனைத்தும் முடிந்தது. சிறப்பு!")}</p>
                  )}
                </div>
              </div>
              <Button asChild className="mt-4 w-full"><Link to="/worker/profile">{t("Complete my profile", "என் சுயவிவரத்தை முடிக்கவும்")}</Link></Button>
            </CardContent>
          </Card>

          {/* Contract countdown */}
          <Card>
            <CardHeader><CardTitle>{t("Contract countdown", "ஒப்பந்த எண்ணிக்கை")}</CardTitle></CardHeader>
            <CardContent>
              {days === null ? (
                <p className="text-sm text-muted-foreground">{t("Add your contract end date to see this.", "இதை பார்க்க உங்கள் ஒப்பந்த முடிவு தேதியைச் சேர்க்கவும்.")}</p>
              ) : (
                <>
                  <p className="text-3xl font-extrabold">{days > 0 ? `${days} ${t("days", "நாட்கள்")}` : t("Contract ended", "ஒப்பந்தம் முடிந்தது")}</p>
                  <p className="text-sm text-muted-foreground">
                    {days > 0 ? t("until your contract ends", "உங்கள் ஒப்பந்தம் முடியும் வரை") : t("you're available now", "நீங்கள் இப்போது கிடைக்கிறீர்கள்")}
                  </p>
                  <div className="mt-3">
                    {availStatus === "Available Now" && <StatusPill kind="success">{t("Available Now", "இப்போது கிடைக்கும்")}</StatusPill>}
                    {availStatus === "Available Soon" && <StatusPill kind="warning">{t("Ending Soon", "விரைவில் முடிகிறது")}</StatusPill>}
                    {availStatus === "Currently Employed" && <StatusPill kind="muted">{t("Currently Employed", "தற்போது வேலையில்")}</StatusPill>}
                  </div>
                  {availStatus === "Available Soon" && (
                    <p className="mt-4 rounded-md border border-warning/30 bg-warning/10 p-3 text-sm">
                      {t("Make sure your profile is complete so agents can find you.", "முகவர்கள் உங்களை கண்டுபிடிக்க உங்கள் சுயவிவரம் முழுமையாக இருப்பதை உறுதிசெய்யவும்.")}
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Certification status */}
          <Card>
            <CardHeader><CardTitle>{t("Certification status", "சான்றிதழ் நிலை")}</CardTitle></CardHeader>
            <CardContent>
              {uploadedCerts.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("No certifications uploaded yet.", "இன்னும் சான்றிதழ்கள் எதுவும் பதிவேற்றப்படவில்லை.")}</p>
              ) : (
                <ul className="space-y-2">
                  {uploadedCerts.map(k => {
                    const status = certStatus(profile.certs[k]);
                    return (
                      <li key={k} className="flex items-center justify-between gap-2 rounded-md border border-border p-2.5 text-sm">
                        <span className="font-medium">{t(CERT_META[k].en, CERT_META[k].ta)}</span>
                        {status === "Valid" && <StatusPill kind="success">{t("Valid", "செல்லுபடியாகும்")}</StatusPill>}
                        {status === "Expiring Soon" && <StatusPill kind="warning">{t("Expiring", "காலாவதியாகிறது")}</StatusPill>}
                        {status === "Expired" && <StatusPill kind="danger">{t("Expired", "காலாவதியானது")}</StatusPill>}
                      </li>
                    );
                  })}
                </ul>
              )}
              <Button asChild variant="outline" className="mt-4 w-full"><Link to="/worker/profile">{t("Update certifications", "சான்றிதழ்களை புதுப்பிக்கவும்")}</Link></Button>
            </CardContent>
          </Card>

          {/* Visibility */}
          <Card>
            <CardHeader><CardTitle>{t("Profile visibility", "சுயவிவர தெரிவு")}</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${profile.visibleToAgents ? "bg-success/15 text-success" : "bg-secondary text-muted-foreground"}`}>
                    {profile.visibleToAgents ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-semibold">{profile.visibleToAgents ? t("Visible to agents", "முகவர்களுக்கு தெரியும்") : t("Private", "தனிப்பட்டது")}</p>
                    <p className="text-xs text-muted-foreground">{profile.visibleToAgents ? t("Licensed Singapore agents can find you.", "உரிமம் பெற்ற முகவர்கள் உங்களை கண்டுபிடிக்க முடியும்.") : t("Turn on when you're ready.", "தயாரானதும் இயக்கவும்.")}</p>
                  </div>
                </div>
                <button
                  onClick={() => save(p => ({ ...p, visibleToAgents: !p.visibleToAgents }))}
                  className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors ${profile.visibleToAgents ? "bg-success" : "bg-input"}`}
                  aria-label="Toggle visibility"
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${profile.visibleToAgents ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Profile views (mock) */}
          <Card>
            <CardHeader><CardTitle>{t("Profile views", "சுயவிவர பார்வைகள்")}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-extrabold">4</p>
              <p className="text-sm text-muted-foreground">{t("views this week", "இந்த வாரம் பார்வைகள்")}</p>
              <p className="mt-3 text-sm"><span className="font-semibold">2 {t("agents", "முகவர்கள்")}</span> {t("have saved your profile", "உங்கள் சுயவிவரத்தை சேமித்துள்ளனர்")}</p>
            </CardContent>
          </Card>

          {/* Referral */}
          <Card>
            <CardHeader><CardTitle>{t("Invite a friend", "நண்பரை அழைக்கவும்")}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm">{t("Know a Tamil worker in Singapore? Invite them to build their profile on BridgeWork.", "சிங்கப்பூரில் தமிழ் தொழிலாளர் தெரியுமா? அவர்களை அழைக்கவும்.")}</p>
              <div className="mt-3 flex items-center gap-2 rounded-md border border-border bg-secondary/40 p-2 text-sm">
                <code className="flex-1 truncate font-mono text-xs">bridgework.sg/join/murugan-r</code>
                <button onClick={() => navigator.clipboard?.writeText("bridgework.sg/join/murugan-r")} className="rounded p-1.5 hover:bg-secondary">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{t("You have referred 0 workers so far.", "நீங்கள் இதுவரை 0 தொழிலாளர்களை பரிந்துரைத்துள்ளீர்கள்.")}</p>
            </CardContent>
          </Card>

          {/* Wellbeing */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Heart className="h-4 w-4 text-accent" />{t("How are things going at work?", "வேலையில் எப்படி இருக்கிறது?")}</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                <MoodBtn active={mood === "good"}   onClick={() => setMood("good")}   icon={<Smile className="h-6 w-6" />} label={t("Good", "நன்று")} />
                <MoodBtn active={mood === "okay"}   onClick={() => setMood("okay")}   icon={<Meh className="h-6 w-6" />}   label={t("Okay", "சரி")} />
                <MoodBtn active={mood === "issues"} onClick={() => setMood("issues")} icon={<Frown className="h-6 w-6" />} label={t("Issues", "சிக்கல்")} />
              </div>
              {mood === "issues" && (
                <div className="mt-4 space-y-3 rounded-md border border-border bg-secondary/30 p-3">
                  <textarea
                    className="w-full rounded-md border border-input bg-background p-2 text-sm"
                    rows={3}
                    placeholder={t("What's happening? (private)", "என்ன நடக்கிறது? (தனிப்பட்டது)")}
                    value={issueText}
                    onChange={e => setIssueText(e.target.value)}
                  />
                  <div className="space-y-1.5 text-sm">
                    <Helpline name="MOM Foreign Worker Helpline" num="6438 5122" />
                    <Helpline name="Migrant Workers' Centre"      num="6536 2692" />
                    <Helpline name="TWC2"                          num="6247 7001" />
                  </div>
                </div>
              )}
              {mood && mood !== "issues" && <p className="mt-3 text-sm text-success">{t("Thanks for checking in.", "சரிபார்த்ததற்கு நன்றி.")}</p>}
              <Link to="/worker/wellbeing" className="mt-3 inline-block text-xs text-primary hover:underline">{t("More support resources →", "மேலும் ஆதரவு வளங்கள் →")}</Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function MoodBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-sm transition-colors ${active ? "border-accent bg-accent/10 text-accent" : "border-border hover:bg-secondary"}`}
    >
      {icon}<span className="font-medium">{label}</span>
    </button>
  );
}

function Helpline({ name, num }: { name: string; num: string }) {
  return (
    <a href={`tel:${num.replace(/\s/g, "")}`} className="flex items-center justify-between gap-2 rounded-md bg-background px-2.5 py-1.5 hover:bg-secondary">
      <span className="text-xs font-medium">{name}</span>
      <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-primary"><Phone className="h-3 w-3" />{num}</span>
    </a>
  );
}
