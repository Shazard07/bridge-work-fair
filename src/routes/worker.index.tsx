import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell, SectorBadge, AvailabilityBadge } from "@/components/app-shell";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Briefcase, GraduationCap, MapPin } from "lucide-react";
import type { SgExperience, OverseasExperience } from "@/lib/countries";

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

function WorkerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!authLoading && !user) nav({ to: "/login" }); }, [authLoading, user, nav]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: w }, { data: ct }, { data: cp }] = await Promise.all([
        supabase.from("worker_profiles").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("worker_contacts").select("*").eq("worker_id", user.id).order("created_at", { ascending: false }),
        supabase.from("company_profiles").select("user_id, company_name"),
      ]);
      setProfile(w as WorkerProfile | null);
      setContacts((ct as Contact[]) ?? []);
      const map: Record<string, string> = {};
      (cp ?? []).forEach((r: { user_id: string; company_name: string }) => { map[r.user_id] = r.company_name; });
      setCompanies(map);
      setLoading(false);
    })();
  }, [user]);

  async function toggleAvailable() {
    if (!profile || !user) return;
    setSaving(true);
    const next = !profile.available_now;
    const { error } = await supabase.from("worker_profiles").update({ available_now: next }).eq("user_id", user.id);
    if (!error) setProfile({ ...profile, available_now: next });
    setSaving(false);
  }

  return (
    <AppShell role="worker">
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        <h1 className="text-2xl font-bold md:text-3xl">My profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Companies discover you through your profile. Keep it up to date.</p>

        {loading ? (
          <p className="mt-8 text-sm text-muted-foreground">Loading...</p>
        ) : !profile ? (
          <p className="mt-8 text-sm text-muted-foreground">No profile found.</p>
        ) : (
          <div className="mt-6 space-y-6">
            {/* Availability */}
            <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold">Availability</h2>
                  <div className="mt-2"><AvailabilityBadge available={profile.available_now} /></div>
                </div>
                <button onClick={toggleAvailable} disabled={saving}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">
                  {profile.available_now ? "Mark as unavailable" : "Mark as available"}
                </button>
              </div>
            </section>

            {/* Summary */}
            <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">Profile summary</h2>
                <SectorBadge sector={profile.sector} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                <Stat label="Nationality" value={profile.nationality} />
                <Stat label="Language" value={profile.language} />
                <Stat label="Experience" value={`${profile.years_experience} yrs`} />
                {profile.expected_salary != null && <Stat label="Expected salary" value={`$${profile.expected_salary}/mo`} />}
                {profile.work_pass_end_date && <Stat label="Pass ends" value={new Date(profile.work_pass_end_date).toLocaleDateString()} />}
              </div>
              {profile.skills && <p className="mt-4 text-sm"><span className="font-medium">Skills:</span> {profile.skills}</p>}
            </section>

            {/* Education */}
            {(profile.education || profile.certifications) && (
              <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <h2 className="flex items-center gap-2 text-base font-semibold"><GraduationCap className="h-4 w-4" /> Education & certifications</h2>
                {profile.education && <p className="mt-2 text-sm"><span className="font-medium">Education:</span> {profile.education}</p>}
                {profile.certifications && <p className="mt-1 text-sm"><span className="font-medium">Certifications:</span> {profile.certifications}</p>}
              </section>
            )}

            {/* SG experience */}
            <ExperienceSection title="Experience in Singapore" entries={profile.sg_experiences} />
            <ExperienceSection title="Experience outside Singapore" entries={profile.overseas_experiences} showCountry />

            {/* Contacts */}
            <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-base font-semibold">Companies that contacted you ({contacts.length})</h2>
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
          </div>
        )}
      </div>
    </AppShell>
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
