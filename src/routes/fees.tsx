import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useLang } from "@/lib/lang";
import { X, Check, Phone, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/fees")({
  head: () => ({
    meta: [
      { title: "Our Fee Promise — BridgeWork" },
      { name: "description", content: "Workers pay $0. Always. Full transparency on all fees in our recruitment process." },
    ],
  }),
  component: Fees,
});

function Fees() {
  const { t } = useLang();
  return (
    <AppShell role="public">
      <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
        <h1 className="text-4xl font-bold font-tamil">{t("Our Fee Promise", "எங்கள் கட்டண உறுதிமொழி")}</h1>
        <p className="mt-2 text-lg text-muted-foreground font-tamil">{t("Transparency you can verify.", "சரிபார்க்கக்கூடிய வெளிப்படைத்தன்மை.")}</p>

        {/* Section 1 — Fee table */}
        <section className="mt-10">
          <h2 className="text-xl font-bold font-tamil">{t("What workers pay", "தொழிலாளர்கள் என்ன செலுத்துகிறார்கள்")}</h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-left">
                <tr><th className="p-3 font-semibold">Item</th><th className="p-3 font-semibold">Paid to</th><th className="p-3 text-right font-semibold">Worker pays</th></tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {[
                  ["Platform fee", "BridgeWork", "$0"],
                  ["Placement fee", "Agent", "$0"],
                  ["Overseas broker fee", "None — no broker used", "$0"],
                  ["Work permit fee", "Singapore Government (paid by employer)", "~$35"],
                  ["Medical exam", "Paid by employer", "~$40"],
                ].map(r => (
                  <tr key={r[0]}><td className="p-3 font-medium">{r[0]}</td><td className="p-3 text-muted-foreground">{r[1]}</td><td className="p-3 text-right font-bold text-success">{r[2]}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2 — Comparison */}
        <section className="mt-12">
          <h2 className="text-xl font-bold font-tamil">{t("Two paths to Singapore", "சிங்கப்பூருக்கு இரண்டு வழிகள்")}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border-2 border-danger/30 bg-danger/5 p-6">
              <div className="flex items-center gap-2 text-danger"><X className="h-5 w-5" /><span className="text-sm font-bold uppercase tracking-wide">Traditional route</span></div>
              <ul className="mt-4 space-y-2 text-sm">
                <li>• Worker pays broker $5,000–$15,000 SGD</li>
                <li>• Arrives in debt</li>
                <li>• Spends 6–12 months repaying</li>
                <li>• Vulnerable to exploitation</li>
              </ul>
            </div>
            <div className="rounded-xl border-2 border-success/40 bg-success/5 p-6">
              <div className="flex items-center gap-2 text-success"><Check className="h-5 w-5" /><span className="text-sm font-bold uppercase tracking-wide">BridgeWork route</span></div>
              <ul className="mt-4 space-y-2 text-sm">
                <li>• Worker pays $0</li>
                <li>• Arrives debt-free</li>
                <li>• Keeps full salary from day one</li>
                <li>• Protected by direct licensed channel</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="mt-12 rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-bold">How we stay sustainable</h2>
          <p className="mt-3 text-muted-foreground">
            Agents pay BridgeWork a small subscription fee. Workers never pay anything. This is how we stay sustainable without exploiting workers.
          </p>
        </section>

        {/* Section 4 — MOM */}
        <section className="mt-12">
          <h2 className="text-xl font-bold font-tamil">{t("Get help in Singapore", "சிங்கப்பூரில் உதவி பெறுங்கள்")}</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <a href="tel:64385122" className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 hover:bg-secondary">
              <Phone className="h-5 w-5 text-primary" />
              <div><p className="text-xs text-muted-foreground">MOM Foreign Worker Helpline</p><p className="font-bold">6438 5122</p></div>
            </a>
            <a href="tel:65362692" className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 hover:bg-secondary">
              <Phone className="h-5 w-5 text-primary" />
              <div><p className="text-xs text-muted-foreground">Migrant Workers' Centre Singapore</p><p className="font-bold">6536 2692</p></div>
            </a>
            <a href="https://mom.gov.sg" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 hover:bg-secondary md:col-span-2">
              <ExternalLink className="h-5 w-5 text-primary" />
              <div><p className="text-xs text-muted-foreground">Singapore Ministry of Manpower</p><p className="font-bold">mom.gov.sg</p></div>
            </a>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
