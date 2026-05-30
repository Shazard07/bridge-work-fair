import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell, SectorBadge } from "@/components/app-shell";
import { JOBS, AGENTS } from "@/lib/data";
import { useLang } from "@/lib/lang";
import { Check, Home, Calendar, Briefcase } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/worker/jobs/$id")({
  loader: ({ params }) => {
    const job = JOBS.find(j => j.id === params.id);
    if (!job) throw notFound();
    return { job, agent: AGENTS.find(a => a.id === job.agentId)! };
  },
  head: () => ({ meta: [{ title: "Job Detail — BridgeWork" }] }),
  component: JobDetail,
  notFoundComponent: () => <AppShell role="worker"><div className="p-8 text-center"><Link to="/worker/jobs" className="text-primary">Back to jobs</Link></div></AppShell>,
});

function JobDetail() {
  const { job, agent } = Route.useLoaderData();
  const { t } = useLang();
  const [applied, setApplied] = useState(false);

  return (
    <AppShell role="worker">
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
        <Link to="/worker/jobs" className="text-sm text-muted-foreground hover:text-foreground font-tamil">← {t("Back", "திரும்பு")}</Link>

        <div className="mt-4 rounded-xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold">{job.title}</h1>
              <p className="mt-1 text-muted-foreground">{agent.company} · {agent.license}</p>
            </div>
            <SectorBadge sector={job.sector} />
          </div>

          <p className="mt-6 text-3xl font-bold">${job.salaryMin}–${job.salaryMax}<span className="text-base font-normal text-muted-foreground">/month SGD</span></p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Info icon={Calendar} label={t("Contract", "ஒப்பந்தம்")} value={`${job.duration} ${t("months", "மாதங்கள்")}`} />
            <Info icon={Home} label={t("Accommodation", "தங்குமிடம்")} value={job.accommodation ? t("Provided", "வழங்கப்படும்") : t("Not provided", "இல்லை")} />
            <Info icon={Briefcase} label={t("Workers needed", "தேவையானவர்கள்")} value={`${job.workersNeeded}`} />
            <Info icon={Calendar} label={t("Start date", "தொடக்க தேதி")} value={job.startDate || "—"} />
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground font-tamil">{t("Skills required", "தேவையான திறமைகள்")}</h3>
            <p className="mt-2 text-sm">{job.skills}</p>
          </div>

          {/* Fee box */}
          <div className="mt-6 rounded-lg border-2 border-success/40 bg-success/5 p-5 text-center">
            <p className="text-sm font-semibold text-success font-tamil">{t("Fees you will be charged", "நீங்கள் செலுத்த வேண்டிய கட்டணம்")}</p>
            <p className="mt-1 text-4xl font-extrabold text-success">$0</p>
            <p className="mt-1 text-xs text-muted-foreground font-tamil">{t("Always. Guaranteed.", "எப்போதும். உத்தரவாதம்.")}</p>
          </div>

          {!applied ? (
            <button onClick={() => setApplied(true)} className="mt-6 w-full rounded-md bg-accent py-3 text-base font-semibold text-accent-foreground hover:opacity-90 font-tamil">
              {t("Apply now", "இப்போதே விண்ணப்பி")}
            </button>
          ) : (
            <div className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-success/10 py-3 text-success font-tamil">
              <Check className="h-5 w-5" /> {t("Application sent!", "விண்ணப்பம் அனுப்பப்பட்டது!")}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function Info({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-border p-3">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div>
        <div className="text-xs text-muted-foreground font-tamil">{label}</div>
        <div className="text-sm font-semibold font-tamil">{value}</div>
      </div>
    </div>
  );
}
