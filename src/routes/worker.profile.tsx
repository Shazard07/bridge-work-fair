import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useState } from "react";
import { SECTORS, WORKERS } from "@/lib/data";
import { Check } from "lucide-react";

export const Route = createFileRoute("/worker/profile")({
  head: () => ({ meta: [{ title: "My Profile — BridgeWork" }] }),
  component: Profile,
});

function Profile() {
  const me = WORKERS[0];
  const [data, setData] = useState({
    name: me.name, fin: me.fin, dob: me.dob, years: me.years,
    sector: me.sector as string, salaryExpect: me.salaryExpect, phone: me.phone,
  });
  const [saved, setSaved] = useState(false);

  return (
    <AppShell role="worker">
      <div className="mx-auto max-w-2xl px-4 py-8 md:px-6">
        <h1 className="text-3xl font-bold">My profile</h1>
        <p className="mt-1 text-muted-foreground">Keep your details up to date so businesses can reach you.</p>

        <form
          onSubmit={(e) => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 2500); }}
          className="mt-6 space-y-4 rounded-xl border border-border bg-card p-6"
        >
          <L label="Full name"><input className={inp} value={data.name} onChange={e => setData({ ...data, name: e.target.value })} /></L>
          <L label="FIN number"><input className={inp} value={data.fin} onChange={e => setData({ ...data, fin: e.target.value })} /></L>
          <L label="Date of birth"><input type="date" className={inp} value={data.dob} onChange={e => setData({ ...data, dob: e.target.value })} /></L>
          <div className="grid grid-cols-2 gap-4">
            <L label="Years of experience">
              <select className={inp} value={data.years} onChange={e => setData({ ...data, years: e.target.value as typeof data.years })}>
                <option>0</option><option>1-2</option><option>3-5</option><option>5+</option>
              </select>
            </L>
            <L label="Sector">
              <select className={inp} value={data.sector} onChange={e => setData({ ...data, sector: e.target.value })}>
                {SECTORS.map(s => <option key={s}>{s}</option>)}
              </select>
            </L>
          </div>
          <L label="Salary expectation (SGD / month)">
            <input type="number" className={inp} value={data.salaryExpect} onChange={e => setData({ ...data, salaryExpect: +e.target.value })} />
          </L>
          <L label="Contact number (WhatsApp)">
            <input className={inp} value={data.phone} onChange={e => setData({ ...data, phone: e.target.value })} />
          </L>

          <div className="flex items-center justify-between gap-3 pt-2">
            <Link to="/worker/jobs" className="text-sm text-muted-foreground hover:text-foreground">Browse jobs →</Link>
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
              Save changes
            </button>
          </div>
          {saved && (
            <p className="inline-flex items-center gap-2 rounded-md bg-success/10 px-3 py-2 text-sm text-success">
              <Check className="h-4 w-4" /> Saved
            </p>
          )}
        </form>
      </div>
    </AppShell>
  );
}

const inp = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-medium">{label}</span>{children}</label>;
}
