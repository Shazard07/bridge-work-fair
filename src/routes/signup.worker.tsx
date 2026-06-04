import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2 } from "lucide-react";
import { COUNTRIES, YEARS, type SgExperience, type OverseasExperience } from "@/lib/countries";

export const Route = createFileRoute("/signup/worker")({
  head: () => ({ meta: [{ title: "Worker Signup — getWorkers" }] }),
  component: WorkerSignup,
});

const NATIONALITIES = ["India", "Bangladesh", "Thailand", "China"] as const;
const LANGUAGES = ["Tamil", "Hindi", "Bengali", "Thai", "Mandarin"] as const;
const SECTORS = ["Construction", "Marine"] as const;

function WorkerSignup() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", mobile: "",
    nationality: "India" as typeof NATIONALITIES[number],
    dob: "",
    language: "Tamil" as typeof LANGUAGES[number],
    sector: "Construction" as typeof SECTORS[number],
    skills: "",
    workPassEnd: "",
    education: "",
    certifications: "",
    lastSalary: "",
    expectedSalary: "",
    lastSalaryDay: "",
    expectedSalaryDay: "",
    availableNow: true,
    availableFrom: "",
  });
  const [sgExp, setSgExp] = useState<SgExperience[]>([]);
  const [overseasExp, setOverseasExp] = useState<OverseasExperience[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const upd = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const totalYears = (arr: SgExperience[]) => arr.reduce((sum, e) => {
    const end = e.end_year ?? new Date().getFullYear();
    return sum + Math.max(0, end - e.start_year);
  }, 0);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email, password: form.password,
      options: { emailRedirectTo: `${window.location.origin}/worker` },
    });
    if (error) { setErr(error.message); setLoading(false); return; }
    const user = data.user;
    if (!user) { setErr("Check your email to confirm your account, then log in."); setLoading(false); return; }

    const { error: pErr } = await supabase.from("profiles").insert({
      user_id: user.id, role: "worker", full_name: form.name,
    });
    if (pErr) { setErr(pErr.message); setLoading(false); return; }

    const { error: sErr } = await supabase.from("worker_sensitive").insert({
      user_id: user.id, phone: form.mobile,
    });
    if (sErr) { setErr(sErr.message); setLoading(false); return; }

    const yearsTotal = totalYears(sgExp) + totalYears(overseasExp);

    const { error: wErr } = await supabase.from("worker_profiles").insert({
      user_id: user.id,
      nationality: form.nationality,
      date_of_birth: form.dob,
      language: form.language,
      sector: form.sector,
      years_experience: yearsTotal,
      skills: form.skills,
      work_pass_end_date: form.workPassEnd || null,
      education: form.education || null,
      certifications: form.certifications || null,
      last_drawn_salary: form.lastSalary ? parseInt(form.lastSalary, 10) : null,
      expected_salary: form.expectedSalary ? parseInt(form.expectedSalary, 10) : null,
      last_drawn_salary_day: form.lastSalaryDay ? parseInt(form.lastSalaryDay, 10) : null,
      expected_salary_day: form.expectedSalaryDay ? parseInt(form.expectedSalaryDay, 10) : null,
      available_now: form.availableNow,
      available_from: form.availableNow ? null : (form.availableFrom || null),
      sg_experiences: sgExp,
      overseas_experiences: overseasExp,
    });
    if (wErr) { setErr(wErr.message); setLoading(false); return; }

    setLoading(false);
    nav({ to: "/worker" });
  }

  return (
    <AppShell role="public">
      <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back</Link>
        <h1 className="mt-4 text-3xl font-bold">Create your worker profile</h1>
        <p className="mt-1 text-muted-foreground">Free during MVP. Get discovered by Singapore companies.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          {/* Account */}
          <Card title="Account">
            <Field label="Full name" value={form.name} onChange={upd("name")} required />
            <Field label="Email" type="email" value={form.email} onChange={upd("email")} required />
            <PasswordField value={form.password} onChange={upd("password")} />
            <Field label="Mobile number" value={form.mobile} onChange={upd("mobile")} placeholder="+65 / +91 ..." required />
          </Card>

          {/* Basics */}
          <Card title="Basic details">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select label="Nationality" value={form.nationality} onChange={upd("nationality")} options={NATIONALITIES} />
              <Field label="Date of birth" type="date" value={form.dob} onChange={upd("dob")} required />
              <Select label="Language" value={form.language} onChange={upd("language")} options={LANGUAGES} />
              <Select label="Sector" value={form.sector} onChange={upd("sector")} options={SECTORS} />
            </div>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Skills</span>
              <textarea value={form.skills} onChange={upd("skills")} rows={3} placeholder="e.g. scaffolding, welding, rigging"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </label>
            <Field label="Work pass end date (optional)" type="date" value={form.workPassEnd} onChange={upd("workPassEnd")} />
          </Card>

          {/* Availability */}
          <Card title="Availability">
            <label className="flex items-center justify-between rounded-md border border-input bg-background p-3">
              <div>
                <div className="text-sm font-medium">Available now</div>
                <div className="text-xs text-muted-foreground">Companies will see an "Available now" badge on your profile.</div>
              </div>
              <input type="checkbox" checked={form.availableNow}
                onChange={(e) => setForm({ ...form, availableNow: e.target.checked })}
                className="h-5 w-5 accent-primary" />
            </label>
            {!form.availableNow && (
              <Field label="Available from" type="date" value={form.availableFrom} onChange={upd("availableFrom")} />
            )}
          </Card>

          {/* Education */}
          <Card title="Education & certifications">
            <Field label="Education" value={form.education} onChange={upd("education")} placeholder="e.g. High school, Diploma in welding" />
            <Field label="Certifications" value={form.certifications} onChange={upd("certifications")} placeholder="e.g. WSH, Forklift license" />
          </Card>

          {/* SG experience */}
          <Card
            title="Experience in Singapore"
            subtitle={sgExp.length > 0 ? `Total: ${totalYears(sgExp)} year${totalYears(sgExp) === 1 ? "" : "s"}` : "Add each role you've held in Singapore."}
            action={
              <button type="button" onClick={() => setSgExp([...sgExp, { role: "", company: "", start_year: YEARS[0], end_year: null }])}
                className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-foreground hover:bg-secondary/80">
                <Plus className="h-4 w-4" /> Add
              </button>
            }
          >
            {sgExp.length === 0 && <EmptyHint>No Singapore experience added yet.</EmptyHint>}
            {sgExp.map((e, i) => (
              <ExperienceRow key={i} entry={e}
                onChange={(updated) => setSgExp(sgExp.map((x, idx) => idx === i ? updated : x))}
                onRemove={() => setSgExp(sgExp.filter((_, idx) => idx !== i))}
              />
            ))}
          </Card>

          {/* Overseas experience */}
          <Card
            title="Experience outside Singapore"
            subtitle="Add each country and role separately."
            action={
              <button type="button" onClick={() => setOverseasExp([...overseasExp, { country: COUNTRIES[0], role: "", company: "", start_year: YEARS[0], end_year: null }])}
                className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-foreground hover:bg-secondary/80">
                <Plus className="h-4 w-4" /> Add
              </button>
            }
          >
            {overseasExp.length === 0 && <EmptyHint>No overseas experience added yet.</EmptyHint>}
            {overseasExp.map((e, i) => (
              <ExperienceRow key={i} entry={e} withCountry
                onChange={(updated) => setOverseasExp(overseasExp.map((x, idx) => idx === i ? updated as OverseasExperience : x))}
                onRemove={() => setOverseasExp(overseasExp.filter((_, idx) => idx !== i))}
              />
            ))}
          </Card>

          {/* Salary */}
          <Card title="Salary expectations">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Last drawn salary (SGD/month)" type="number" min={0} value={form.lastSalary} onChange={upd("lastSalary")} />
              <Field label="Expected salary (SGD/month)" type="number" min={0} value={form.expectedSalary} onChange={upd("expectedSalary")} />
              <Field label="Last drawn salary (SGD/day)" type="number" min={0} value={form.lastSalaryDay} onChange={upd("lastSalaryDay")} />
              <Field label="Expected salary (SGD/day)" type="number" min={0} value={form.expectedSalaryDay} onChange={upd("expectedSalaryDay")} />
            </div>
          </Card>

          {err && <p className="text-sm text-destructive">{err}</p>}

          <button disabled={loading} className="w-full rounded-md bg-accent py-3 font-semibold text-accent-foreground hover:opacity-90 disabled:opacity-60">
            {loading ? "Creating..." : "Create free account"}
          </button>
          <p className="text-center text-xs text-muted-foreground">Free during MVP. No payment ever required from workers.</p>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Log in</Link>
          </p>
        </form>
      </div>
    </AppShell>
  );
}

function Card({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
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

type ExperienceEntry = SgExperience | OverseasExperience;

function ExperienceRow({ entry, withCountry, onChange, onRemove }: {
  entry: ExperienceEntry;
  withCountry?: boolean;
  onChange: (e: ExperienceEntry) => void;
  onRemove: () => void;
}) {
  const start = entry.start_year;
  const end = entry.end_year ?? new Date().getFullYear();
  const duration = Math.max(0, end - start);

  return (
    <div className="rounded-lg border border-border bg-background/50 p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {withCountry && (
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">Country</span>
            <select value={(entry as OverseasExperience).country}
              onChange={(e) => onChange({ ...entry, country: e.target.value } as OverseasExperience)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
        )}
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">Role / trade</span>
          <input value={entry.role} onChange={(e) => onChange({ ...entry, role: e.target.value })}
            placeholder="e.g. Welder" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">Company</span>
          <input value={entry.company} onChange={(e) => onChange({ ...entry, company: e.target.value })}
            placeholder="Company name" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">Start year</span>
            <select value={entry.start_year} onChange={(e) => onChange({ ...entry, start_year: parseInt(e.target.value, 10) })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">End year</span>
            <select value={entry.end_year ?? ""} onChange={(e) => onChange({ ...entry, end_year: e.target.value ? parseInt(e.target.value, 10) : null })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
              <option value="">Present</option>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </label>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Duration: <span className="font-semibold text-foreground">{duration} year{duration === 1 ? "" : "s"}</span></span>
        <button type="button" onClick={onRemove} className="inline-flex items-center gap-1 text-destructive hover:underline">
          <Trash2 className="h-3.5 w-3.5" /> Remove
        </button>
      </div>
    </div>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input {...props} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
    </label>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: React.ChangeEventHandler<HTMLSelectElement>; options: readonly string[] }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <select value={value} onChange={onChange} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function PasswordField({ value, onChange }: { value: string; onChange: React.ChangeEventHandler<HTMLInputElement> }) {
  const [show, setShow] = useState(false);
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">Password</span>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          required
          placeholder="Choose a password"
          className="w-full rounded-md border border-input bg-background px-3 py-2 pr-16 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </label>
  );
}
