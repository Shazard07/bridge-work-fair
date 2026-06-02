import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell, SectorBadge, AvailabilityBadge } from "@/components/app-shell";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Search, Bookmark, BookmarkCheck, Phone, MapPin, GraduationCap, Briefcase, ShieldCheck, X } from "lucide-react";
import type { SgExperience, OverseasExperience } from "@/lib/countries";

export const Route = createFileRoute("/company/")({
  head: () => ({ meta: [{ title: "Find Workers — getWorkers" }] }),
  component: CompanyDashboard,
});

type Worker = {
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

type WorkerProfileMeta = { user_id: string; full_name: string; phone: string | null };

function CompanyDashboard() {
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState<"browse" | "saved" | "contacted">("browse");
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [profiles, setProfiles] = useState<Record<string, WorkerProfileMeta>>({});
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [contactedIds, setContactedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Filters
  const [q, setQ] = useState("");
  const [sector, setSector] = useState<"all" | "Construction" | "Marine">("all");
  const [nationality, setNationality] = useState<string>("all");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [minYears, setMinYears] = useState("");
  const [hasSgExp, setHasSgExp] = useState(false);
  const [certQuery, setCertQuery] = useState("");

  const [openProfile, setOpenProfile] = useState<Worker | null>(null);

  useEffect(() => { if (!authLoading && !user) nav({ to: "/login" }); }, [authLoading, user, nav]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: w }, { data: p }, { data: sv }, { data: ct }] = await Promise.all([
        supabase.from("worker_profiles").select("*"),
        supabase.from("profiles").select("user_id, full_name, phone"),
        supabase.from("saved_workers").select("worker_id").eq("company_id", user.id),
        supabase.from("worker_contacts").select("worker_id").eq("company_id", user.id),
      ]);
      setWorkers(((w as unknown) as Worker[]) ?? []);
      const pMap: Record<string, WorkerProfileMeta> = {};
      (p ?? []).forEach((r: WorkerProfileMeta) => { pMap[r.user_id] = r; });
      setProfiles(pMap);
      setSaved(new Set(((sv ?? []) as { worker_id: string }[]).map(x => x.worker_id)));
      setContactedIds(new Set(((ct ?? []) as { worker_id: string }[]).map(x => x.worker_id)));
      setLoading(false);
    })();
  }, [user]);

  const nationalities = useMemo(() => Array.from(new Set(workers.map(w => w.nationality))).sort(), [workers]);

  const filtered = useMemo(() => {
    return workers.filter(w => {
      if (sector !== "all" && w.sector !== sector) return false;
      if (nationality !== "all" && w.nationality !== nationality) return false;
      if (availableOnly && !w.available_now) return false;
      if (minYears && w.years_experience < parseInt(minYears, 10)) return false;
      if (hasSgExp && (!w.sg_experiences || w.sg_experiences.length === 0)) return false;
      if (certQuery && !(w.certifications ?? "").toLowerCase().includes(certQuery.toLowerCase())) return false;
      if (q) {
        const needle = q.toLowerCase();
        const haystack = [profiles[w.user_id]?.full_name, w.skills, w.education, w.certifications, w.nationality]
          .filter(Boolean).join(" ").toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });
  }, [workers, profiles, sector, nationality, availableOnly, minYears, hasSgExp, certQuery, q]);

  const tabbed = useMemo(() => {
    if (tab === "browse") return filtered;
    if (tab === "saved") return filtered.filter(w => saved.has(w.user_id));
    return filtered.filter(w => contactedIds.has(w.user_id));
  }, [filtered, tab, saved, contactedIds]);

  async function toggleSave(workerId: string) {
    if (!user) return;
    if (saved.has(workerId)) {
      await supabase.from("saved_workers").delete().eq("company_id", user.id).eq("worker_id", workerId);
      setSaved(prev => { const n = new Set(prev); n.delete(workerId); return n; });
    } else {
      await supabase.from("saved_workers").insert({ company_id: user.id, worker_id: workerId });
      setSaved(prev => new Set(prev).add(workerId));
    }
  }

  async function contactWorker(workerId: string) {
    if (!user) return;
    if (!contactedIds.has(workerId)) {
      await supabase.from("worker_contacts").insert({ company_id: user.id, worker_id: workerId });
      setContactedIds(prev => new Set(prev).add(workerId));
    }
  }

  return (
    <AppShell role="company">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Find verified workers</h1>
          <p className="mt-1 text-sm text-muted-foreground">Search, filter, and contact workers directly. Free during MVP.</p>
        </div>

        {/* Tabs */}
        <div className="mt-6 inline-flex flex-wrap rounded-md border border-border bg-card p-1">
          <TabBtn active={tab === "browse"} onClick={() => setTab("browse")}>Browse ({filtered.length})</TabBtn>
          <TabBtn active={tab === "saved"} onClick={() => setTab("saved")}>Saved ({saved.size})</TabBtn>
          <TabBtn active={tab === "contacted"} onClick={() => setTab("contacted")}>Contacted ({contactedIds.size})</TabBtn>
        </div>

        {/* Search + filters */}
        <div className="mt-4 rounded-xl border border-border bg-card p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, skill, certification..."
              className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <FilterSelect label="Sector" value={sector} onChange={(v) => setSector(v as typeof sector)} options={[["all", "All"], ["Construction", "Construction"], ["Marine", "Marine"]]} />
            <FilterSelect label="Nationality" value={nationality} onChange={setNationality} options={[["all", "All"], ...nationalities.map(n => [n, n] as [string, string])]} />
            <label className="block text-xs">
              <span className="mb-1 block font-medium text-muted-foreground">Min experience</span>
              <input type="number" min={0} value={minYears} onChange={(e) => setMinYears(e.target.value)} placeholder="years"
                className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </label>
            <label className="block text-xs">
              <span className="mb-1 block font-medium text-muted-foreground">Certifications</span>
              <input value={certQuery} onChange={(e) => setCertQuery(e.target.value)} placeholder="e.g. WSH"
                className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </label>
            <Toggle label="Available now" checked={availableOnly} onChange={setAvailableOnly} />
            <Toggle label="Has SG experience" checked={hasSgExp} onChange={setHasSgExp} />
          </div>
        </div>

        {loading ? (
          <p className="mt-8 text-sm text-muted-foreground">Loading workers...</p>
        ) : tabbed.length === 0 ? (
          <p className="mt-8 text-sm text-muted-foreground">No workers match your filters.</p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tabbed.map(w => (
              <WorkerCard key={w.user_id} w={w} name={profiles[w.user_id]?.full_name}
                isSaved={saved.has(w.user_id)} isContacted={contactedIds.has(w.user_id)}
                onSave={() => toggleSave(w.user_id)}
                onView={() => setOpenProfile(w)}
              />
            ))}
          </div>
        )}
      </div>

      {openProfile && (
        <ProfileModal
          w={openProfile}
          name={profiles[openProfile.user_id]?.full_name ?? "Worker"}
          phone={profiles[openProfile.user_id]?.phone ?? null}
          isContacted={contactedIds.has(openProfile.user_id)}
          isSaved={saved.has(openProfile.user_id)}
          onClose={() => setOpenProfile(null)}
          onSave={() => toggleSave(openProfile.user_id)}
          onContact={() => contactWorker(openProfile.user_id)}
        />
      )}
    </AppShell>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`rounded-md px-4 py-1.5 text-sm font-medium ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
      {children}
    </button>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <label className="block text-xs">
      <span className="mb-1 block font-medium text-muted-foreground">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 self-end rounded-md border border-input bg-background px-3 py-1.5 text-xs">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-primary" />
      <span className="font-medium">{label}</span>
    </label>
  );
}

function WorkerCard({ w, name, isSaved, isContacted, onSave, onView }: {
  w: Worker; name?: string; isSaved: boolean; isContacted: boolean; onSave: () => void; onView: () => void;
}) {
  const sgYears = (w.sg_experiences ?? []).reduce((s, e) => s + Math.max(0, (e.end_year ?? new Date().getFullYear()) - e.start_year), 0);
  const certCount = (w.certifications ?? "").split(",").filter(s => s.trim()).length;
  return (
    <article className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold">{name ?? "Worker"}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{w.nationality} · {w.language}</p>
        </div>
        <button onClick={onSave} aria-label={isSaved ? "Unsave" : "Save"}
          className={`rounded-md p-1.5 ${isSaved ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
          {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <SectorBadge sector={w.sector} />
        <AvailabilityBadge available={w.available_now} />
        {isContacted && <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">Contacted</span>}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <Trust icon={<Briefcase className="h-3.5 w-3.5" />} label={`${w.years_experience}y exp`} />
        <Trust icon={<MapPin className="h-3.5 w-3.5" />} label={`${sgYears}y SG`} />
        <Trust icon={<ShieldCheck className="h-3.5 w-3.5" />} label={`${certCount} cert${certCount === 1 ? "" : "s"}`} />
      </div>
      {w.skills && <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{w.skills}</p>}
      <div className="mt-4 flex items-center justify-between">
        {w.expected_salary != null ? (
          <span className="text-sm font-semibold">${w.expected_salary}<span className="text-xs font-normal text-muted-foreground">/mo expected</span></span>
        ) : <span />}
        <button onClick={onView} className="rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90">View profile</button>
      </div>
    </article>
  );
}

function Trust({ icon, label }: { icon: React.ReactNode; label: string }) {
  return <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-muted-foreground"><span className="text-foreground">{icon}</span>{label}</span>;
}

function ProfileModal({ w, name, phone, isContacted, isSaved, onClose, onSave, onContact }: {
  w: Worker; name: string; phone: string | null; isContacted: boolean; isSaved: boolean;
  onClose: () => void; onSave: () => void; onContact: () => void;
}) {
  const [revealed, setRevealed] = useState(isContacted);

  function handleContact() {
    if (!revealed) onContact();
    setRevealed(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-card shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card/95 px-6 py-4 backdrop-blur">
          <div>
            <h2 className="text-xl font-bold">{name}</h2>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <SectorBadge sector={w.sector} />
              <AvailabilityBadge available={w.available_now} />
            </div>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 hover:bg-secondary"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-5 px-6 py-5">
          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <Stat label="Nationality" value={w.nationality} />
            <Stat label="Language" value={w.language} />
            <Stat label="Experience" value={`${w.years_experience} yrs`} />
            {w.expected_salary != null && <Stat label="Expected" value={`$${w.expected_salary}/mo`} />}
          </div>

          {w.skills && (
            <Section title="Skills"><p className="text-sm">{w.skills}</p></Section>
          )}
          {(w.education || w.certifications) && (
            <Section title={<><GraduationCap className="h-4 w-4" /> Education & certifications</>}>
              {w.education && <p className="text-sm"><span className="font-medium">Education:</span> {w.education}</p>}
              {w.certifications && <p className="mt-1 text-sm"><span className="font-medium">Certifications:</span> {w.certifications}</p>}
            </Section>
          )}
          {w.sg_experiences?.length > 0 && (
            <Section title={<><Briefcase className="h-4 w-4" /> Experience in Singapore</>}>
              <ExpList entries={w.sg_experiences} />
            </Section>
          )}
          {w.overseas_experiences?.length > 0 && (
            <Section title={<><MapPin className="h-4 w-4" /> Experience outside Singapore</>}>
              <ExpList entries={w.overseas_experiences} showCountry />
            </Section>
          )}

          <Section title={<><Phone className="h-4 w-4" /> Contact</>}>
            {revealed && phone ? (
              <div className="rounded-md border border-success/30 bg-success/5 p-3 text-sm">
                <div className="font-semibold text-foreground">{phone}</div>
                <p className="mt-1 text-xs text-muted-foreground">Reach out directly. This contact has been logged.</p>
              </div>
            ) : revealed ? (
              <p className="text-sm text-muted-foreground">No phone number on file.</p>
            ) : (
              <p className="text-sm text-muted-foreground">Click "Contact worker" below to reveal contact details. The worker will be notified.</p>
            )}
          </Section>
        </div>
        <div className="sticky bottom-0 flex items-center justify-between gap-2 border-t border-border bg-card/95 px-6 py-4 backdrop-blur">
          <button onClick={onSave} className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-secondary">
            {isSaved ? <><BookmarkCheck className="h-4 w-4 text-primary" /> Saved</> : <><Bookmark className="h-4 w-4" /> Save</>}
          </button>
          <button onClick={handleContact} className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90">
            {revealed ? "Contact details revealed" : "Contact worker"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">{title}</h3>
      {children}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-background p-3 text-sm">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-semibold">{value}</div>
    </div>
  );
}

function ExpList({ entries, showCountry }: { entries: (SgExperience | OverseasExperience)[]; showCountry?: boolean }) {
  return (
    <ul className="space-y-2">
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
              <div className="mt-1 text-xs text-muted-foreground">{(e as OverseasExperience).country}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
