import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useLang } from "@/lib/lang";
import { useState } from "react";
import { DISTRICTS } from "@/lib/data";
import { Check, AlertCircle, Clock, Upload } from "lucide-react";

export const Route = createFileRoute("/worker/profile")({
  head: () => ({ meta: [{ title: "Build Your Profile — BridgeWork" }] }),
  component: ProfileBuilder,
});

const inp = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

function ProfileBuilder() {
  const { t } = useLang();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    name: "Murugan Rajan", dob: "1990-04-12", district: "Chennai", passport: "", passportExpiry: "",
    sector: "Construction", years: "5+", prevEmployer: "", skills: "",
    docs: { passport: "Uploaded" as Status, medical: "Missing" as Status, history: "Missing" as Status, police: "Missing" as Status },
    agreed: false,
  });

  const steps = [
    t("Personal", "தனிப்பட்ட"),
    t("Experience", "அனுபவம்"),
    t("Documents", "ஆவணங்கள்"),
    t("Fees", "கட்டணம்"),
    t("Done", "முடிந்தது"),
  ];

  const completion = () => {
    let pct = 0;
    if (data.name && data.dob && data.passport) pct += 25;
    if (data.skills) pct += 25;
    if (Object.values(data.docs).filter(s => s === "Uploaded").length >= 2) pct += 25;
    if (data.agreed) pct += 25;
    return pct;
  };

  return (
    <AppShell role="worker">
      <div className="mx-auto max-w-2xl px-4 py-8 md:px-6">
        <h1 className="text-3xl font-bold font-tamil">{t("Build your profile", "உங்கள் சுயவிவரத்தை உருவாக்கவும்")}</h1>

        {/* Stepper */}
        <div className="mt-6 flex items-center gap-1">
          {steps.map((s, i) => (
            <div key={i} className="flex flex-1 items-center gap-1">
              <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${step > i ? "bg-success text-success-foreground" : step === i + 1 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                {step > i ? <Check className="h-3 w-3" /> : i + 1}
              </div>
              {i < steps.length - 1 && <div className={`h-0.5 flex-1 ${step > i + 1 ? "bg-success" : "bg-secondary"}`} />}
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground font-tamil">{t(`Step ${step} of ${steps.length}`, `படி ${step}/${steps.length}`)} · {steps[step-1]}</p>

        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold font-tamil">{t("Personal info", "தனிப்பட்ட தகவல்")}</h2>
              <L label={t("Full name", "முழு பெயர்")}><input className={inp} value={data.name} onChange={e => setData({ ...data, name: e.target.value })} /></L>
              <L label={t("Date of birth", "பிறந்த தேதி")}><input type="date" className={inp} value={data.dob} onChange={e => setData({ ...data, dob: e.target.value })} /></L>
              <L label={t("District", "மாவட்டம்")}>
                <select className={inp} value={data.district} onChange={e => setData({ ...data, district: e.target.value })}>
                  {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </L>
              <L label={t("Passport number", "பாஸ்போர்ட் எண்")}><input className={inp} value={data.passport} onChange={e => setData({ ...data, passport: e.target.value })} /></L>
              <L label={t("Passport expiry", "பாஸ்போர்ட் காலாவதி")}><input type="date" className={inp} value={data.passportExpiry} onChange={e => setData({ ...data, passportExpiry: e.target.value })} /></L>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold font-tamil">{t("Work experience", "வேலை அனுபவம்")}</h2>
              <L label={t("Sector", "துறை")}>
                <select className={inp} value={data.sector} onChange={e => setData({ ...data, sector: e.target.value })}>
                  <option>Construction</option><option>Marine</option>
                </select>
              </L>
              <L label={t("Years in Singapore", "சிங்கப்பூரில் ஆண்டுகள்")}>
                <select className={inp} value={data.years} onChange={e => setData({ ...data, years: e.target.value })}>
                  <option>0</option><option>1-2</option><option>3-5</option><option>5+</option>
                </select>
              </L>
              <L label={t("Previous Singapore employer (optional)", "முந்தைய சிங்கப்பூர் முதலாளி (விருப்பம்)")}>
                <input className={inp} value={data.prevEmployer} onChange={e => setData({ ...data, prevEmployer: e.target.value })} />
              </L>
              <L label={t("Skills (max 300 chars)", "திறமைகள் (அதிகபட்சம் 300)")}>
                <textarea rows={4} maxLength={300} className={inp} value={data.skills} onChange={e => setData({ ...data, skills: e.target.value })} />
                <span className="text-xs text-muted-foreground">{data.skills.length}/300</span>
              </L>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold font-tamil">{t("Documents", "ஆவணங்கள்")}</h2>
              {([
                ["passport", t("Passport copy", "பாஸ்போர்ட் நகல்")],
                ["medical", t("Medical certificate", "மருத்துவ சான்றிதழ்")],
                ["history", t("Work history", "வேலை வரலாறு")],
                ["police", t("Police clearance", "காவல் துறை சான்றிதழ்")],
              ] as const).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between rounded-md border border-border p-3">
                  <div>
                    <p className="text-sm font-medium font-tamil">{label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{data.docs[key] === "Uploaded" ? "filename.pdf" : "—"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <DocBadge status={data.docs[key]} />
                    <button onClick={() => setData({ ...data, docs: { ...data.docs, [key]: "Uploaded" } })} className="inline-flex items-center gap-1 rounded-md border border-input px-2.5 py-1 text-xs font-medium hover:bg-secondary">
                      <Upload className="h-3 w-3" /> {t("Upload", "பதிவேற்று")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold font-tamil">{t("What you will pay", "நீங்கள் செலுத்த வேண்டியது")}</h2>
              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-secondary text-left">
                    <tr><th className="p-3 font-semibold">Item</th><th className="p-3 font-semibold">Paid to</th><th className="p-3 text-right font-semibold">You pay</th></tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      ["Platform fee", "BridgeWork", "$0"],
                      ["Placement fee", "Agent", "$0"],
                      ["Overseas broker fee", "None — no broker used", "$0"],
                      ["Work permit fee", "Singapore Government, paid by employer", "~$35"],
                      ["Medical exam", "Paid by employer", "~$40"],
                    ].map(r => (
                      <tr key={r[0]}><td className="p-3">{r[0]}</td><td className="p-3 text-muted-foreground">{r[1]}</td><td className="p-3 text-right font-bold text-success">{r[2]}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="rounded-md bg-success/10 p-3 text-center text-sm font-bold text-success font-tamil">
                {t("BridgeWork charges workers nothing. Ever.", "BridgeWork தொழிலாளர்களிடம் எந்த கட்டணமும் வசூலிக்காது. எப்போதும்.")}
              </p>
              <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-3">
                <input type="checkbox" checked={data.agreed} onChange={e => setData({ ...data, agreed: e.target.checked })} className="mt-0.5 h-4 w-4 accent-primary" />
                <span className="text-sm font-tamil">{t("I understand and agree — I will not be charged by BridgeWork or the agent", "நான் புரிந்துகொண்டு ஒப்புக்கொள்கிறேன் — BridgeWork அல்லது முகவரால் என்னிடம் கட்டணம் வசூலிக்கப்படாது")}</span>
              </label>
            </div>
          )}

          {step === 5 && (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10"><Check className="h-8 w-8 text-success" /></div>
              <h2 className="mt-4 text-2xl font-bold font-tamil">{t("Profile complete!", "சுயவிவரம் முழுமை!")}</h2>
              <div className="mx-auto mt-6 max-w-xs">
                <div className="text-sm text-muted-foreground">Profile strength</div>
                <div className="mt-2 text-4xl font-extrabold text-primary">{completion()}%</div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-primary" style={{ width: `${completion()}%` }} />
                </div>
              </div>
              {completion() < 100 && (
                <div className="mx-auto mt-6 max-w-sm rounded-md bg-warning/10 p-4 text-left text-sm">
                  <p className="font-semibold">Still missing:</p>
                  <ul className="ml-5 mt-2 list-disc text-muted-foreground">
                    {!data.passport && <li>Passport number</li>}
                    {!data.skills && <li>Skills description</li>}
                    {Object.values(data.docs).filter(s => s === "Uploaded").length < 4 && <li>Some documents</li>}
                    {!data.agreed && <li>Fee declaration</li>}
                  </ul>
                </div>
              )}
              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
                <Link to="/worker" className="rounded-md border border-input bg-card px-4 py-2 text-sm font-semibold hover:bg-secondary font-tamil">{t("View my profile", "எனது சுயவிவரத்தைப் பார்")}</Link>
                <Link to="/worker/jobs" className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90 font-tamil">{t("Browse jobs", "வேலைகளைப் பார்")}</Link>
              </div>
            </div>
          )}

          {/* Navigation */}
          {step < 5 && (
            <div className="mt-6 flex justify-between border-t border-border pt-4">
              <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1} className="rounded-md border border-input px-4 py-2 text-sm font-medium disabled:opacity-50 hover:bg-secondary font-tamil">
                {t("Back", "முந்தைய")}
              </button>
              <button onClick={() => setStep(s => Math.min(5, s + 1))} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 font-tamil">
                {step === 4 ? t("Finish", "முடி") : t("Next", "அடுத்து")}
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

type Status = "Uploaded" | "Missing" | "Expired";
function DocBadge({ status }: { status: Status }) {
  const cfg = {
    Uploaded: { Icon: Check, cls: "bg-success/10 text-success" },
    Missing: { Icon: AlertCircle, cls: "bg-danger/10 text-danger" },
    Expired: { Icon: Clock, cls: "bg-warning/20 text-warning-foreground" },
  }[status];
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${cfg.cls}`}><cfg.Icon className="h-3 w-3" /> {status}</span>;
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-medium font-tamil">{label}</span>{children}</label>;
}
