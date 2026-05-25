import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { AppShell, StatusPill } from "@/components/app-shell";
import { useLang } from "@/lib/lang";
import { useProfile } from "@/lib/profile-store";
import {
  DISTRICTS, CONSTRUCTION_TITLES, MARINE_TITLES, YEARS_BANDS,
  STANDARD_CERT_KEYS, CERT_META, certStatus, certCompleteness,
  availabilityStatus, profileStrength, daysFromToday,
  type Sector, type WorkerProfile,
} from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2, Upload, Check } from "lucide-react";
import { z } from "zod";

const searchSchema = z.object({ step: z.coerce.number().min(1).max(5).optional() });

export const Route = createFileRoute("/worker/profile")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "My Profile — BridgeWork" },
      { name: "description", content: "Build your Singapore work profile: personal info, experience, certifications and availability." },
    ],
  }),
  component: ProfileBuilder,
});

const STEPS = [
  { en: "Personal", ta: "தனிப்பட்ட" },
  { en: "Experience", ta: "அனுபவம்" },
  { en: "Certifications", ta: "சான்றிதழ்கள்" },
  { en: "Availability", ta: "கிடைக்கும்" },
  { en: "Review", ta: "மறுபரிசீலனை" },
];

function ProfileBuilder() {
  const { t } = useLang();
  const { profile, save, ready } = useProfile();
  const search = useSearch({ from: "/worker/profile" });
  const [step, setStep] = useState<number>(search.step ?? 1);

  useEffect(() => { if (search.step) setStep(search.step); }, [search.step]);

  if (!ready) return <AppShell role="worker"><div className="p-8" /></AppShell>;

  const pct = Math.round((step / STEPS.length) * 100);

  return (
    <AppShell role="worker">
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
        <div className="sticky top-[57px] z-30 -mx-4 mb-6 border-b border-border bg-background/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold">{t("Step", "படி")} {step} {t("of", "/")} {STEPS.length} — {t(STEPS[step - 1].en, STEPS[step - 1].ta)}</span>
            <span className="text-muted-foreground">{pct}%</span>
          </div>
          <Progress value={pct} />
        </div>

        {step === 1 && <StepPersonal profile={profile} save={save} />}
        {step === 2 && <StepExperience profile={profile} save={save} />}
        {step === 3 && <StepCerts profile={profile} save={save} />}
        {step === 4 && <StepAvailability profile={profile} save={save} />}
        {step === 5 && <StepReview profile={profile} save={save} goTo={setStep} />}

        <div className="mt-8 flex items-center justify-between">
          <Button variant="outline" disabled={step === 1} onClick={() => setStep(s => s - 1)}>
            <ChevronLeft className="h-4 w-4" /> {t("Back", "பின்")}
          </Button>
          {step < STEPS.length ? (
            <Button onClick={() => setStep(s => s + 1)} className="bg-accent text-accent-foreground hover:opacity-90">
              {t("Next", "அடுத்து")} <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button asChild className="bg-accent text-accent-foreground hover:opacity-90">
              <Link to="/worker">{t("Complete My Profile", "என் சுயவிவரத்தை முடிக்கவும்")}</Link>
            </Button>
          )}
        </div>
      </div>
    </AppShell>
  );
}

// ---------- Field helpers ----------
function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

function Select<T extends string>({ value, onChange, options, placeholder }: { value: T | ""; onChange: (v: T) => void; options: readonly T[]; placeholder?: string }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value as T)}
      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      <option value="">{placeholder ?? "—"}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

type SaveFn = (updater: (p: WorkerProfile) => WorkerProfile) => void;

// ---------- Step 1 ----------
function StepPersonal({ profile, save }: { profile: WorkerProfile; save: SaveFn }) {
  const { t } = useLang();
  const set = <K extends keyof WorkerProfile>(k: K, v: WorkerProfile[K]) => save(p => ({ ...p, [k]: v }));
  return (
    <Card>
      <CardHeader><CardTitle>{t("Personal information", "தனிப்பட்ட தகவல்")}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Field label={t("Full name", "முழு பெயர்")}><Input value={profile.fullName} onChange={e => set("fullName", e.target.value)} /></Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={t("Date of birth", "பிறந்த தேதி")}><Input type="date" value={profile.dob} onChange={e => set("dob", e.target.value)} /></Field>
          <Field label={t("Singapore phone", "சிங்கப்பூர் தொலைபேசி")}><Input type="tel" value={profile.phone} onChange={e => set("phone", e.target.value)} /></Field>
        </div>
        <Field label={t("District of origin", "சொந்த மாவட்டம்")}>
          <Select value={profile.district} onChange={v => set("district", v)} options={DISTRICTS} placeholder={t("Select district", "மாவட்டத்தைத் தேர்ந்தெடுக்கவும்")} />
        </Field>
        <Field label={t("Current Singapore address", "தற்போதைய சிங்கப்பூர் முகவரி")} hint={t("Dormitory or employer housing — block, street, unit", "தொகுதி, தெரு, அலகு")}>
          <Textarea rows={2} value={profile.sgAddress} onChange={e => set("sgAddress", e.target.value)} />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={t("Work Permit number", "வேலை அனுமதி எண்")}><Input value={profile.wpNumber} onChange={e => set("wpNumber", e.target.value)} /></Field>
          <Field label={t("Work Permit expiry", "வேலை அனுமதி காலாவதி")}><Input type="date" value={profile.wpExpiry} onChange={e => set("wpExpiry", e.target.value)} /></Field>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={t("Current employer", "தற்போதைய முதலாளி")}><Input value={profile.employer} onChange={e => set("employer", e.target.value)} /></Field>
          <Field label={t("Contract end date", "ஒப்பந்த முடிவு தேதி")}>
            <Input type="date" value={profile.contractEnd} onChange={e => {
              const v = e.target.value;
              save(p => ({
                ...p,
                contractEnd: v,
                availableFrom: p.availableFrom || (v ? new Date(new Date(v).getTime() + 86400000).toISOString().slice(0, 10) : ""),
              }));
            }} />
          </Field>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------- Step 2 ----------
function StepExperience({ profile, save }: { profile: WorkerProfile; save: SaveFn }) {
  const { t } = useLang();
  const titles = profile.sector === "Marine" ? MARINE_TITLES : profile.sector === "Construction" ? CONSTRUCTION_TITLES : [];
  const set = <K extends keyof WorkerProfile>(k: K, v: WorkerProfile[K]) => save(p => ({ ...p, [k]: v }));
  return (
    <Card>
      <CardHeader><CardTitle>{t("Work experience", "வேலை அனுபவம்")}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={t("Sector", "துறை")}>
            <Select value={profile.sector} onChange={v => save(p => ({ ...p, sector: v as Sector, jobTitle: "" }))} options={["Construction", "Marine"] as const} />
          </Field>
          <Field label={t("Job title / trade", "வேலை தலைப்பு")}>
            <Select value={profile.jobTitle} onChange={v => set("jobTitle", v)} options={titles} placeholder={profile.sector ? t("Select", "தேர்ந்தெடு") : t("Pick sector first", "முதலில் துறையைத் தேர்ந்தெடு")} />
          </Field>
        </div>
        <Field label={t("Total years of Singapore experience", "மொத்த சிங்கப்பூர் அனுபவம்")}>
          <Select value={profile.yearsBand} onChange={v => set("yearsBand", v)} options={YEARS_BANDS} />
        </Field>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">{t("Previous Singapore employers", "முந்தைய சிங்கப்பூர் முதலாளிகள்")} <span className="text-xs text-muted-foreground">({t("up to 3", "மூன்று வரை")})</span></span>
            {profile.previousEmployers.length < 3 && (
              <Button variant="outline" size="sm" onClick={() => save(p => ({ ...p, previousEmployers: [...p.previousEmployers, { company: "", jobTitle: "", sector: "Construction", startMonth: "", endMonth: "" }] }))}>
                <Plus className="h-3 w-3" /> {t("Add", "சேர்")}
              </Button>
            )}
          </div>
          <div className="space-y-3">
            {profile.previousEmployers.map((emp, i) => (
              <div key={i} className="rounded-md border border-border p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">#{i + 1}</span>
                  <button onClick={() => save(p => ({ ...p, previousEmployers: p.previousEmployers.filter((_, j) => j !== i) }))} className="rounded p-1 text-muted-foreground hover:bg-secondary"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <Input placeholder={t("Company name", "நிறுவன பெயர்")} value={emp.company} onChange={e => updateEmp(save, i, "company", e.target.value)} />
                  <Input placeholder={t("Job title", "வேலை தலைப்பு")} value={emp.jobTitle} onChange={e => updateEmp(save, i, "jobTitle", e.target.value)} />
                  <Select value={emp.sector} onChange={v => updateEmp(save, i, "sector", v)} options={["Construction", "Marine"] as const} />
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="month" value={emp.startMonth} onChange={e => updateEmp(save, i, "startMonth", e.target.value)} />
                    <Input type="month" value={emp.endMonth} onChange={e => updateEmp(save, i, "endMonth", e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
            {profile.previousEmployers.length === 0 && (
              <p className="rounded-md border border-dashed border-border p-4 text-center text-sm text-muted-foreground">{t("No previous employers added.", "முந்தைய முதலாளிகள் சேர்க்கப்படவில்லை.")}</p>
            )}
          </div>
        </div>

        <Field label={t("Skills description", "திறன்கள் விவரம்")} hint={t("Describe what you are good at in your own words (max 300 chars)", "உங்கள் சொற்களில் விவரிக்கவும் (அதிகபட்சம் 300)")}>
          <Textarea maxLength={300} rows={4} value={profile.skillsText} onChange={e => save(p => ({ ...p, skillsText: e.target.value }))} />
          <span className="mt-1 block text-right text-xs text-muted-foreground">{profile.skillsText.length}/300</span>
        </Field>
      </CardContent>
    </Card>
  );
}

function updateEmp(save: SaveFn, i: number, k: keyof WorkerProfile["previousEmployers"][number], v: string) {
  save(p => ({ ...p, previousEmployers: p.previousEmployers.map((e, j) => j === i ? { ...e, [k]: v } : e) }));
}

// ---------- Step 3 ----------
function StepCerts({ profile, save }: { profile: WorkerProfile; save: SaveFn }) {
  const { t } = useLang();
  const pct = certCompleteness(profile);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Your certifications", "உங்கள் சான்றிதழ்கள்")}</CardTitle>
        <p className="text-sm text-muted-foreground">{t("Upload a photo or scan of each certification you have.", "ஒவ்வொரு சான்றிதழின் புகைப்படம் அல்லது ஸ்கேன் பதிவேற்றவும்.")}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-border bg-secondary/30 p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold">{t("Certification completeness", "சான்றிதழ் முழுமை")}</span>
            <span>{pct === 100 ? "🏆 100%" : `${pct}%`}</span>
          </div>
          <Progress value={pct} />
        </div>

        {STANDARD_CERT_KEYS.map(k => {
          const entry = profile.certs[k];
          const status = certStatus(entry);
          const mandatory = CERT_META[k].mandatoryFor === "Construction" && profile.sector === "Construction";
          return (
            <div key={k} className={`rounded-lg border p-4 ${entry?.fileName ? "border-success/30 bg-success/5" : "border-border"}`}>
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{t(CERT_META[k].en, CERT_META[k].ta)}</p>
                  {mandatory && <p className="text-xs font-medium text-danger">{t("Mandatory for construction workers", "கட்டுமான தொழிலாளர்களுக்கு கட்டாயம்")}</p>}
                </div>
                <CertStatusPill status={status} />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="flex h-10 cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 text-sm hover:bg-secondary">
                  <Upload className="h-4 w-4" />
                  <span className="truncate flex-1">{entry?.fileName ?? t("Upload photo / PDF", "புகைப்படம் / PDF பதிவேற்று")}</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      save(p => ({ ...p, certs: { ...p.certs, [k]: { ...(p.certs[k] ?? {}), fileName: f.name } } }));
                    }}
                  />
                </label>
                <div className="space-y-2">
                  <Input type="date" disabled={entry?.noExpiry} value={entry?.expiryDate ?? ""} onChange={e => save(p => ({ ...p, certs: { ...p.certs, [k]: { ...(p.certs[k] ?? {}), expiryDate: e.target.value } } }))} />
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={!!entry?.noExpiry}
                      onChange={e => save(p => ({ ...p, certs: { ...p.certs, [k]: { ...(p.certs[k] ?? {}), noExpiry: e.target.checked, expiryDate: e.target.checked ? undefined : p.certs[k]?.expiryDate } } }))}
                    />
                    {t("No expiry date", "காலாவதி தேதி இல்லை")}
                  </label>
                </div>
              </div>
            </div>
          );
        })}

        <Link to="/guide/certifications" className="block text-center text-sm text-primary hover:underline">
          {t("Which certifications matter? See the guide →", "எந்த சான்றிதழ்கள் முக்கியம்? வழிகாட்டியைப் பார்க்கவும் →")}
        </Link>
      </CardContent>
    </Card>
  );
}

function CertStatusPill({ status }: { status: ReturnType<typeof certStatus> }) {
  if (status === "Valid") return <StatusPill kind="success">Valid</StatusPill>;
  if (status === "Expiring Soon") return <StatusPill kind="warning">Expiring Soon</StatusPill>;
  if (status === "Expired") return <StatusPill kind="danger">Expired</StatusPill>;
  return <StatusPill kind="muted">Not uploaded</StatusPill>;
}

// ---------- Step 4 ----------
function StepAvailability({ profile, save }: { profile: WorkerProfile; save: SaveFn }) {
  const { t } = useLang();
  const status = availabilityStatus(profile.contractEnd);
  const set = <K extends keyof WorkerProfile>(k: K, v: WorkerProfile[K]) => save(p => ({ ...p, [k]: v }));
  return (
    <Card>
      <CardHeader><CardTitle>{t("Availability", "கிடைக்கும் தன்மை")}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={t("Contract end date", "ஒப்பந்த முடிவு தேதி")}><Input type="date" value={profile.contractEnd} onChange={e => set("contractEnd", e.target.value)} /></Field>
          <Field label={t("Available from", "எப்போதிலிருந்து கிடைக்கும்")}><Input type="date" value={profile.availableFrom} onChange={e => set("availableFrom", e.target.value)} /></Field>
        </div>
        <div>
          <span className="mb-1.5 block text-sm font-medium">{t("Availability status", "கிடைக்கும் நிலை")}</span>
          {status === "Available Now" && <StatusPill kind="success">{t("Available Now", "இப்போது கிடைக்கும்")}</StatusPill>}
          {status === "Available Soon" && <StatusPill kind="warning">{t("Available Soon", "விரைவில் கிடைக்கும்")}</StatusPill>}
          {status === "Currently Employed" && <StatusPill kind="muted">{t("Currently Employed", "தற்போது வேலையில்")}</StatusPill>}
          {status === "Unknown" && <StatusPill kind="muted">—</StatusPill>}
        </div>
        <Field label={t("Preferred next sector", "விருப்பமான அடுத்த துறை")}>
          <Select value={profile.nextSector} onChange={v => set("nextSector", v as WorkerProfile["nextSector"])} options={["Construction", "Marine", "Open to both"] as const} />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={t("Preferred contract duration", "விருப்ப ஒப்பந்த காலம்")}>
            <Select value={profile.preferredDuration} onChange={v => set("preferredDuration", v as WorkerProfile["preferredDuration"])} options={["1 year", "2 years", "Any"] as const} />
          </Field>
          <Field label={t("Open to", "ஏற்க தயார்")}>
            <Select value={profile.openTo} onChange={v => set("openTo", v as WorkerProfile["openTo"])} options={["Main contractor", "Subcontractor", "Any"] as const} />
          </Field>
        </div>
        <Field label={t("Additional notes", "கூடுதல் குறிப்புகள்")} hint={t("Optional, max 200 characters", "விருப்பத் தேர்வு, அதிகபட்சம் 200")}>
          <Textarea rows={3} maxLength={200} value={profile.availabilityNotes} onChange={e => set("availabilityNotes", e.target.value)} />
        </Field>
      </CardContent>
    </Card>
  );
}

// ---------- Step 5 ----------
function StepReview({ profile, save, goTo }: { profile: WorkerProfile; save: SaveFn; goTo: (n: number) => void }) {
  const { t } = useLang();
  const strength = useMemo(() => profileStrength(profile), [profile]);
  const days = daysFromToday(profile.contractEnd);
  return (
    <Card>
      <CardHeader><CardTitle>{t("Review and submit", "மறுபரிசீலித்து சமர்ப்பிக்கவும்")}</CardTitle></CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-lg border border-border bg-secondary/30 p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold">{t("Profile strength", "சுயவிவர வலிமை")}</span>
            <span>{strength.pct === 100 ? "🏆 100%" : `${strength.pct}%`}</span>
          </div>
          <Progress value={strength.pct} />
          {strength.missing.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
              {strength.missing.map(m => <li key={m}>• {m}</li>)}
            </ul>
          )}
        </div>

        <Summary title={t("Personal", "தனிப்பட்ட")} onEdit={() => goTo(1)}>
          <p><b>{profile.fullName || "—"}</b> · {profile.district || "—"} · {profile.phone || "—"}</p>
          <p className="text-muted-foreground">{t("WP", "WP")} {profile.wpNumber || "—"} · {t("expires", "காலாவதி")} {profile.wpExpiry || "—"}</p>
          <p className="text-muted-foreground">{t("Employer", "முதலாளி")}: {profile.employer || "—"} · {t("ends", "முடிவு")} {profile.contractEnd || "—"}{days !== null && days > 0 ? ` (${days} ${t("days", "நாட்கள்")})` : ""}</p>
        </Summary>
        <Summary title={t("Experience", "அனுபவம்")} onEdit={() => goTo(2)}>
          <p>{profile.sector || "—"} · {profile.jobTitle || "—"} · {profile.yearsBand || "—"} {t("years", "ஆண்டுகள்")}</p>
          <p className="text-muted-foreground">{profile.previousEmployers.length} {t("previous employer(s)", "முந்தைய முதலாளி(கள்)")}</p>
          {profile.skillsText && <p className="mt-1 italic">"{profile.skillsText}"</p>}
        </Summary>
        <Summary title={t("Certifications", "சான்றிதழ்கள்")} onEdit={() => goTo(3)}>
          <div className="flex flex-wrap gap-1.5">
            {STANDARD_CERT_KEYS.map(k => {
              const s = certStatus(profile.certs[k]);
              return <CertStatusPill key={k} status={s} />;
            })}
          </div>
        </Summary>
        <Summary title={t("Availability", "கிடைக்கும்")} onEdit={() => goTo(4)}>
          <p>{t("From", "தேதியிலிருந்து")} {profile.availableFrom || "—"} · {profile.nextSector || "—"} · {profile.preferredDuration || "—"} · {profile.openTo || "—"}</p>
        </Summary>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold">{t("Make my profile visible to licensed agents", "என் சுயவிவரத்தை உரிமம் பெற்ற முகவர்களுக்கு தெரியும்படி செய்")}</p>
              <p className="text-xs text-muted-foreground">{t("Off by default. You can change this any time.", "இயல்பாக ஆஃப். எப்போது வேண்டுமானாலும் மாற்றலாம்.")}</p>
            </div>
            <button
              onClick={() => save(p => ({ ...p, visibleToAgents: !p.visibleToAgents }))}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors ${profile.visibleToAgents ? "bg-success" : "bg-input"}`}
              aria-label="Toggle visibility"
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${profile.visibleToAgents ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          <Check className="mr-1 inline h-3 w-3 text-success" />
          {t("Your profile is private until you choose to make it visible to agents.", "முகவர்களுக்கு தெரியும்படி நீங்கள் தேர்ந்தெடுக்கும் வரை உங்கள் சுயவிவரம் தனிப்பட்டது.")}
        </p>
      </CardContent>
    </Card>
  );
}

function Summary({ title, children, onEdit }: { title: string; children: React.ReactNode; onEdit: () => void }) {
  const { t } = useLang();
  return (
    <div className="rounded-lg border border-border p-4 text-sm">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <button onClick={onEdit} className="text-xs font-medium text-primary hover:underline">{t("Edit", "திருத்து")}</button>
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
