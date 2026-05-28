import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, SectorBadge } from "@/components/app-shell";
import { useLang } from "@/lib/lang";
import { APPLICATIONS, JOBS, AGENTS, WORKERS, PIPELINE_STAGES, STAGE_DESCRIPTIONS } from "@/lib/data";
import { useState } from "react";
import { Briefcase, Share2, Copy, Smile, Meh, Frown } from "lucide-react";

export const Route = createFileRoute("/worker/")({
  head: () => ({ meta: [{ title: "My Dashboard — BridgeWork" }] }),
  component: WorkerDash,
});

function WorkerDash() {
  const { t, lang } = useLang();
  const me = WORKERS[0]; // mock: logged in as Murugan (arrived)
  const myApps = APPLICATIONS.filter(a => a.workerId === me.id);
  const hasArrived = myApps.some(a => a.stage === "Arrived in Singapore");
  const [checkin, setCheckin] = useState<"good" | "okay" | "issues" | null>(null);
  const [issueText, setIssueText] = useState("");

  return (
    <AppShell role="worker">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <h1 className="text-3xl font-bold font-tamil">{t(`Welcome, ${me.firstName}`, `வணக்கம், ${me.firstName}`)}</h1>
        <p className="mt-1 text-muted-foreground font-tamil">{t("Your free path to working in Singapore", "சிங்கப்பூரில் வேலை செய்வதற்கான உங்கள் இலவச பாதை")}</p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-lg font-semibold font-tamil">{t("My applications", "எனது விண்ணப்பங்கள்")}</h2>
            <div className="mt-3 space-y-3">
              {myApps.map(a => {
                const j = JOBS.find(j => j.id === a.jobId)!;
                const ag = AGENTS.find(x => x.id === j.agentId)!;
                return (
                  <Link key={a.id} to="/worker/applications" className="block rounded-lg border border-border p-4 hover:bg-secondary/30">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{j.title}</p>
                        <p className="text-xs text-muted-foreground">{ag.company}</p>
                      </div>
                      <SectorBadge sector={j.sector} />
                    </div>
                    <p className="mt-2 text-sm text-primary font-medium">{a.stage}</p>
                  </Link>
                );
              })}
              {myApps.length === 0 && <p className="text-sm text-muted-foreground font-tamil">{t("No applications yet.", "இன்னும் விண்ணப்பங்கள் இல்லை.")}</p>}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-lg font-semibold font-tamil">{t("Browse jobs", "வேலைகளைப் பாருங்கள்")}</h2>
            <p className="mt-1 text-sm text-muted-foreground font-tamil">{t(`${JOBS.filter(j=>j.status==="Active").length} jobs available now`, `${JOBS.filter(j=>j.status==="Active").length} வேலைகள் தற்போது உள்ளன`)}</p>
            <Link to="/worker/jobs" className="mt-4 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90 font-tamil">
              <Briefcase className="h-4 w-4" /> {t("View jobs", "வேலைகளைப் பார்")}
            </Link>
          </div>
        </div>

        {hasArrived && (
          <div className="mt-6 rounded-xl border border-success/30 bg-success/5 p-6">
            <h2 className="text-lg font-semibold font-tamil">{t("How are things going?", "எப்படி இருக்கிறீர்கள்?")}</h2>
            <p className="mt-1 text-sm text-muted-foreground font-tamil">{t("Monthly check-in. Confidential.", "மாதாந்திர செக்-இன். ரகசியமானது.")}</p>
            <div className="mt-4 flex gap-3">
              <CheckinBtn active={checkin === "good"} onClick={() => setCheckin("good")} icon={Smile} label={t("Good", "நன்றாக")} />
              <CheckinBtn active={checkin === "okay"} onClick={() => setCheckin("okay")} icon={Meh} label={t("Okay", "சரி")} />
              <CheckinBtn active={checkin === "issues"} onClick={() => setCheckin("issues")} icon={Frown} label={t("Having issues", "சிக்கல்கள்")} />
            </div>
            {checkin === "issues" && (
              <div className="mt-4">
                <textarea value={issueText} onChange={e => setIssueText(e.target.value)} rows={3} className="w-full rounded-md border border-input bg-background p-3 text-sm font-tamil" placeholder={t("Tell us what's happening — this is confidential", "என்ன நடக்கிறது என்று சொல்லுங்கள் — இது ரகசியம்")} />
                <div className="mt-3 rounded-md bg-card p-3 text-sm">
                  <p className="font-semibold font-tamil">{t("Get help now:", "உடனடி உதவி பெற:")}</p>
                  <p className="mt-1">MOM Helpline: <strong>6438 5122</strong></p>
                  <p>Migrant Workers' Centre: <strong>6536 2692</strong></p>
                </div>
              </div>
            )}
            {checkin && checkin !== "issues" && (
              <p className="mt-3 text-sm text-success font-tamil">{t("Thanks for letting us know. See you next month!", "சொன்னதற்கு நன்றி. அடுத்த மாதம் பார்க்கலாம்!")}</p>
            )}
            <div className="mt-5 border-t border-border pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground font-tamil">{t("Past check-ins", "கடந்த செக்-இன்கள்")}</p>
              <div className="mt-2 flex gap-2 text-xs">
                <span className="rounded-full bg-success/10 px-2 py-1 text-success">May · Good</span>
                <span className="rounded-full bg-success/10 px-2 py-1 text-success">Apr · Good</span>
                <span className="rounded-full bg-warning/20 px-2 py-1 text-warning-foreground">Mar · Okay</span>
              </div>
            </div>
          </div>
        )}

        {/* Referral */}
        <div className="mt-6 rounded-xl border border-accent/30 bg-accent/5 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground"><Share2 className="h-5 w-5" /></div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold font-tamil">{t("Know someone looking for work in Singapore?", "சிங்கப்பூரில் வேலை தேடும் யாரையாவது தெரியுமா?")}</h2>
              <p className="mt-1 text-sm text-muted-foreground font-tamil">{t("Invite them to BridgeWork. Help them avoid broker fees too.", "அவர்களை BridgeWork-க்கு அழைக்கவும். தரகர் கட்டணத்தைத் தவிர்க்க உதவுங்கள்.")}</p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <code className="flex-1 truncate rounded-md border border-border bg-card px-3 py-2 text-sm">bridgework.sg/join/{me.firstName.toLowerCase()}</code>
                <button onClick={() => navigator.clipboard?.writeText(`bridgework.sg/join/${me.firstName.toLowerCase()}`)} className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
                  <Copy className="h-4 w-4" /> {t("Copy", "நகலெடு")}
                </button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground font-tamil">{t("You have referred 0 workers so far", "இதுவரை 0 தொழிலாளர்களைப் பரிந்துரைத்துள்ளீர்கள்")}</p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function CheckinBtn({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <button onClick={onClick} className={`flex flex-1 flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${active ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-secondary"}`}>
      <Icon className="h-7 w-7" />
      <span className="text-sm font-semibold font-tamil">{label}</span>
    </button>
  );
}
