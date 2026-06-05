import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell, SectorBadge, AvailabilityBadge } from "@/components/app-shell";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Briefcase, GraduationCap, MapPin, Plus, Trash2 } from "lucide-react";
import { COUNTRIES, YEARS, type SgExperience, type OverseasExperience } from "@/lib/countries";

export const Route = createFileRoute("/worker/")({
  head: () => ({ meta: [{ title: "My Profile — getWorkers" }] }),
  component: WorkerDashboard,
});

type WorkerProfile = {
  user_id: string;
  nationality: string;
  language: string;
  sector: "Construction" | "Marine";
  years_experience: number;
  skills: string;
  work_pass_end_date: string | null;
  education: string | null;
  certifications: string | null;
  last_drawn_salary: number | null;
  expected_salary: number | null;
  last_drawn_salary_day: number | null;
  expected_salary_day: number | null;
  available_now: boolean;
  available_from: string | null;
  sg_experiences: SgExperience[];
  overseas_experiences: OverseasExperience[];
};

type Contact = {
  id: string;
  company_id: string;
  message: string | null;
  created_at: string;
};

type JobPosting = {
  id: string;
  title: string;
  company_name: string;
  sector: "Construction" | "Marine";
  location: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_period: string;
  description: string;
  requirements: string | null;
  work_pass_accepted: string;
  created_at: string;
};

type JobApplication = {
  id: string;
  job_id: string;
  worker_id: string;
  status: string;
  note: string | null;
  created_at: string;
};

const NATIONALITIES = ["India", "Bangladesh", "Thailand", "China"] as const;
const LANGUAGES = ["Tamil", "Hindi", "Bengali", "Thai", "Mandarin"] as const;
const SECTORS = ["Construction", "Marine"] as const;

type Tab = "view" | "edit" | "jobs" | "applied" | "contacts";

function WorkerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("view");

  useEffect(() => { if (!authLoading && !user) nav({ to: "/login" }); }, [authLoading, user, nav]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: w }, { data: ct }, { data: cp }] = await Promise.all([
        supabase.from("worker_profiles").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("worker_contacts").select("*").eq("worker_id", user.id).order("created_at", { ascending: false }),
        supabase.from("company_profiles").select("user_id, company_name"),
      ]);
      setProfile(((w as unknown) as WorkerProfile | null));
      setContacts((ct as Contact[]) ?? []);
      const map: Record<string, string> = {};
      (cp ?? []).forEach((r: { user_id: string; company_name: string }) => { map[r.user_id] = r.company_name; });
      setCompanies(map);
      setLoading(false);
    })();
  }, [user]);

  return (
    <AppShell role="worker">
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        <h1 className="text-2xl font-bold md:text-3xl">My profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Companies discover you through your profile. Keep it up to date.</p>

        <div className="mt-6 flex gap-1 border-b border-border">
          {([["view", "Profile"], ["edit", "Edit profile"], ["contacts", `Contacts (${contacts.length})`]] as const).map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === k ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="mt-8 text-sm text-muted-foreground">Loading...</p>
        ) : !profile ? (
          <p className="mt-8 text-sm text-muted-foreground">No profile found.</p>
        ) : (
          <div className="mt-6">
            {tab === "view" && <ViewTab profile={profile} />}
            {tab === "edit" && <EditTab profile={profile} onSaved={(p) => { setProfile(p); setTab("view"); }} />}
            {tab === "contacts" && <ContactsTab contacts={contacts} companies={companies} />}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function ViewTab({ profile }: { profile: WorkerProfile }) {
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold">Availability</h2>
            <div className="mt-2"><AvailabilityBadge available={profile.available_now} /></div>
            {!profile.available_now && profile.available_from && (
              <p className="mt-1 text-xs text-muted-foreground">Available from {new Date(profile.available_from).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Profile summary</h2>
          <SectorBadge sector={profile.sector} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          <Stat label="Nationality" value={profile.nationality} />
          <Stat label="Language" value={profile.language} />
          <Stat label="Experience" value={`${profile.years_experience} yrs`} />
          {profile.expected_salary != null && <Stat label="Expected (mo)" value={`$${profile.expected_salary}`} />}
          {profile.expected_salary_day != null && <Stat label="Expected (day)" value={`$${profile.expected_salary_day}`} />}
          {profile.work_pass_end_date && <Stat label="Pass ends" value={new Date(profile.work_pass_end_date).toLocaleDateString()} />}
        </div>
        {profile.skills && <p className="mt-4 text-sm"><span className="font-medium">Skills:</span> {profile.skills}</p>}
      </section>

      {(profile.education || profile.certifications) && (
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-base font-semibold"><GraduationCap className="h-4 w-4" /> Education & certifications</h2>
          {profile.education && <p className="mt-2 text-sm"><span className="font-medium">Education:</span> {profile.education}</p>}
          {profile.certifications && <p className="mt-1 text-sm"><span className="font-medium">Certifications:</span> {profile.certifications}</p>}
        </section>
      )}

      <ExperienceSection title="Experience in Singapore" entries={profile.sg_experiences} />
      <ExperienceSection title="Experience outside Singapore" entries={profile.overseas_experiences} showCountry />
    </div>
  );
}

function ContactsTab({ contacts, companies }: { contacts: Contact[]; companies: Record<string, string> }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-base font-semibold">Companies that contacted you</h2>
      {contacts.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No contacts yet. Companies will reach out when they find your profile.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {contacts.map(c => (
            <li key={c.id} className="rounded-md border border-border bg-background p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">{companies[c.company_id] ?? "Company"}</span>
                <span className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</span>
              </div>
              {c.message && <p className="mt-1 text-muted-foreground">{c.message}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

const totalYears = (arr: { start_year: number; end_year: number | null }[]) => arr.reduce((sum, e) => {
  const end = e.end_year ?? new Date().getFullYear();
  return sum + Math.max(0, end - e.start_year);
}, 0);

function EditTab({ profile, onSaved }: { profile: WorkerProfile; onSaved: (p: WorkerProfile) => void }) {
  const [f, setF] = useState({
    nationality: profile.nationality,
    language: profile.language,
    sector: profile.sector,
    skills: profile.skills ?? "",
    work_pass_end_date: profile.work_pass_end_date ?? "",
    education: profile.education ?? "",
    certifications: profile.certifications ?? "",
    last_drawn_salary: profile.last_drawn_salary?.toString() ?? "",
    expected_salary: profile.expected_salary?.toString() ?? "",
    last_drawn_salary_day: profile.last_drawn_salary_day?.toString() ?? "",
    expected_salary_day: profile.expected_salary_day?.toString() ?? "",
    available_now: profile.available_now,
    available_from: profile.available_from ?? "",
  });
  const [sgExp, setSgExp] = useState<SgExperience[]>(profile.sg_experiences ?? []);
  const [overseasExp, setOverseasExp] = useState<OverseasExperience[]>(profile.overseas_experiences ?? []);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setErr(null); setMsg(null);
    const yearsTotal = totalYears(sgExp) + totalYears(overseasExp);
    const update = {
      nationality: f.nationality,
      language: f.language,
      sector: f.sector,
      skills: f.skills,
      work_pass_end_date: f.work_pass_end_date || null,
      education: f.education || null,
      certifications: f.certifications || null,
      last_drawn_salary: f.last_drawn_salary ? parseInt(f.last_drawn_salary, 10) : null,
      expected_salary: f.expected_salary ? parseInt(f.expected_salary, 10) : null,
      last_drawn_salary_day: f.last_drawn_salary_day ? parseInt(f.last_drawn_salary_day, 10) : null,
      expected_salary_day: f.expected_salary_day ? parseInt(f.expected_salary_day, 10) : null,
      available_now: f.available_now,
      available_from: f.available_now ? null : (f.available_from || null),
      sg_experiences: sgExp,
      overseas_experiences: overseasExp,
      years_experience: yearsTotal,
    };
    const { error } = await supabase.from("worker_profiles").update(update as never).eq("user_id", profile.user_id);
    setSaving(false);
    if (error) { setErr(error.message); return; }
    setMsg("Saved");
    onSaved({ ...profile, ...update } as WorkerProfile);
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <Card title="Availability">
        <label className="flex items-center justify-between rounded-md border border-input bg-background p-3">
          <div>
            <div className="text-sm font-medium">Available now</div>
            <div className="text-xs text-muted-foreground">Shows an "Available now" badge to companies.</div>
          </div>
          <input type="checkbox" checked={f.available_now}
            onChange={(e) => setF({ ...f, available_now: e.target.checked })}
            className="h-5 w-5 accent-primary" />
        </label>
        {!f.available_now && (
          <FieldRow label="Available from" type="date" value={f.available_from} onChange={(v) => setF({ ...f, available_from: v })} />
        )}
      </Card>

      <Card title="Basic details">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectRow label="Nationality" value={f.nationality} onChange={(v) => setF({ ...f, nationality: v })} options={NATIONALITIES} />
          <SelectRow label="Language" value={f.language} onChange={(v) => setF({ ...f, language: v })} options={LANGUAGES} />
          <SelectRow label="Sector" value={f.sector} onChange={(v) => setF({ ...f, sector: v as typeof SECTORS[number] })} options={SECTORS} />
          <FieldRow label="Work pass end date" type="date" value={f.work_pass_end_date} onChange={(v) => setF({ ...f, work_pass_end_date: v })} />
        </div>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Skills</span>
          <textarea value={f.skills} onChange={(e) => setF({ ...f, skills: e.target.value })} rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </label>
      </Card>

      <Card title="Education & certifications">
        <FieldRow label="Education" value={f.education} onChange={(v) => setF({ ...f, education: v })} />
        <FieldRow label="Certifications" value={f.certifications} onChange={(v) => setF({ ...f, certifications: v })} />
      </Card>

      <Card title="Experience in Singapore"
        subtitle={sgExp.length > 0 ? `Total: ${totalYears(sgExp)} year${totalYears(sgExp) === 1 ? "" : "s"}` : "Add each role you've held in Singapore."}
        action={
          <button type="button" onClick={() => setSgExp([...sgExp, { role: "", company: "", start_year: YEARS[0], end_year: null }])}
            className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-sm font-medium hover:bg-secondary/80">
            <Plus className="h-4 w-4" /> Add
          </button>
        }>
        {sgExp.length === 0 && <EmptyHint>No Singapore experience added.</EmptyHint>}
        {sgExp.map((e, i) => (
          <ExperienceRow key={i} entry={e}
            onChange={(u) => setSgExp(sgExp.map((x, idx) => idx === i ? u as SgExperience : x))}
            onRemove={() => setSgExp(sgExp.filter((_, idx) => idx !== i))} />
        ))}
      </Card>

      <Card title="Experience outside Singapore"
        action={
          <button type="button" onClick={() => setOverseasExp([...overseasExp, { country: COUNTRIES[0], role: "", company: "", start_year: YEARS[0], end_year: null }])}
            className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-sm font-medium hover:bg-secondary/80">
            <Plus className="h-4 w-4" /> Add
          </button>
        }>
        {overseasExp.length === 0 && <EmptyHint>No overseas experience added.</EmptyHint>}
        {overseasExp.map((e, i) => (
          <ExperienceRow key={i} entry={e} withCountry
            onChange={(u) => setOverseasExp(overseasExp.map((x, idx) => idx === i ? u as OverseasExperience : x))}
            onRemove={() => setOverseasExp(overseasExp.filter((_, idx) => idx !== i))} />
        ))}
      </Card>

      <Card title="Salary expectations">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldRow label="Last drawn salary (SGD/month)" type="number" value={f.last_drawn_salary} onChange={(v) => setF({ ...f, last_drawn_salary: v })} />
          <FieldRow label="Expected salary (SGD/month)" type="number" value={f.expected_salary} onChange={(v) => setF({ ...f, expected_salary: v })} />
          <FieldRow label="Last drawn salary (SGD/day)" type="number" value={f.last_drawn_salary_day} onChange={(v) => setF({ ...f, last_drawn_salary_day: v })} />
          <FieldRow label="Expected salary (SGD/day)" type="number" value={f.expected_salary_day} onChange={(v) => setF({ ...f, expected_salary_day: v })} />
        </div>
      </Card>

      {err && <p className="text-sm text-destructive">{err}</p>}
      {msg && <p className="text-sm text-primary">{msg}</p>}

      <button disabled={saving} className="w-full rounded-md bg-accent py-3 font-semibold text-accent-foreground hover:opacity-90 disabled:opacity-60">
        {saving ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}

function Card({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function EmptyHint({ children }: { children: React.ReactNode }) {
  return <p className="rounded-md border border-dashed border-border px-4 py-6 text-center text-xs text-muted-foreground">{children}</p>;
}

function FieldRow({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
    </label>
  );
}

function SelectRow({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: readonly string[] }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

type ExperienceEntry = SgExperience | OverseasExperience;

function ExperienceRow({ entry, withCountry, onChange, onRemove }: {
  entry: ExperienceEntry; withCountry?: boolean;
  onChange: (e: ExperienceEntry) => void; onRemove: () => void;
}) {
  const end = entry.end_year ?? new Date().getFullYear();
  const dur = Math.max(0, end - entry.start_year);
  return (
    <div className="rounded-lg border border-border bg-background/50 p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {withCountry && (
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">Country</span>
            <select value={(entry as OverseasExperience).country}
              onChange={(e) => onChange({ ...entry, country: e.target.value } as OverseasExperience)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
        )}
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">Role / trade</span>
          <input value={entry.role} onChange={(e) => onChange({ ...entry, role: e.target.value })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">Company</span>
          <input value={entry.company} onChange={(e) => onChange({ ...entry, company: e.target.value })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">Start year</span>
            <select value={entry.start_year} onChange={(e) => onChange({ ...entry, start_year: parseInt(e.target.value, 10) })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">End year</span>
            <select value={entry.end_year ?? ""} onChange={(e) => onChange({ ...entry, end_year: e.target.value ? parseInt(e.target.value, 10) : null })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">Present</option>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </label>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Duration: <span className="font-semibold text-foreground">{dur} year{dur === 1 ? "" : "s"}</span></span>
        <button type="button" onClick={onRemove} className="inline-flex items-center gap-1 text-destructive hover:underline">
          <Trash2 className="h-3.5 w-3.5" /> Remove
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-background p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-semibold text-foreground">{value}</div>
    </div>
  );
}

function ExperienceSection({ title, entries, showCountry }: { title: string; entries: (SgExperience | OverseasExperience)[]; showCountry?: boolean }) {
  if (!entries || entries.length === 0) return null;
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-base font-semibold"><Briefcase className="h-4 w-4" /> {title}</h2>
      <ul className="mt-3 space-y-3">
        {entries.map((e, i) => {
          const end = e.end_year ?? new Date().getFullYear();
          const dur = Math.max(0, end - e.start_year);
          return (
            <li key={i} className="rounded-md border border-border bg-background p-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <div className="font-medium">{e.role || "—"} {e.company && <span className="font-normal text-muted-foreground">· {e.company}</span>}</div>
                <span className="text-xs text-muted-foreground">{e.start_year} – {e.end_year ?? "Present"} · {dur}y</span>
              </div>
              {showCountry && (e as OverseasExperience).country && (
                <div className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{(e as OverseasExperience).country}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
