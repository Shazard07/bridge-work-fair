import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useLang } from "@/lib/lang";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";

export const Route = createFileRoute("/guide/certifications")({
  head: () => ({
    meta: [
      { title: "Certification Guide — BridgeWork" },
      { name: "description", content: "Which Singapore work certifications matter, who needs them, and where to renew." },
    ],
  }),
  component: Guide,
});

function Guide() {
  const { t } = useLang();
  const rows = [
    { cert: "CSOC Green Card",        who: "All construction workers", validity: "No expiry", renew: "BCA-approved centres" },
    { cert: "Crane Operator License", who: "Crane operators",          validity: "3 years",   renew: "MOM" },
    { cert: "Forklift License",       who: "Forklift operators",       validity: "3 years",   renew: "WSH Council" },
    { cert: "Welding Cert",           who: "Welders",                  validity: "Varies",    renew: "SIWPC" },
    { cert: "First Aid",              who: "Supervisors",              validity: "2 years",   renew: "Approved centres" },
  ];
  return (
    <AppShell role="worker">
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        <h1 className="text-2xl font-bold md:text-3xl">{t("Certifications that matter in Singapore", "சிங்கப்பூரில் முக்கியமான சான்றிதழ்கள்")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("Keep all your certifications on BridgeWork. You will never lose them.", "உங்கள் சான்றிதழ்களை BridgeWork-இல் வைக்கவும்.")}</p>

        <Card className="mt-6">
          <CardContent className="p-0">
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">{t("Certification", "சான்றிதழ்")}</th>
                    <th className="px-4 py-3">{t("Who needs it", "யாருக்கு தேவை")}</th>
                    <th className="px-4 py-3">{t("Validity", "செல்லுபடி")}</th>
                    <th className="px-4 py-3">{t("Where to renew", "எங்கே புதுப்பிக்க")}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(r => (
                    <tr key={r.cert} className="border-b border-border last:border-b-0">
                      <td className="px-4 py-3 font-semibold"><Award className="mr-2 inline h-4 w-4 text-accent" />{r.cert}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.who}</td>
                      <td className="px-4 py-3">{r.validity}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.renew}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden">
              {rows.map(r => (
                <div key={r.cert} className="border-b border-border p-4 last:border-b-0">
                  <p className="flex items-center gap-2 font-semibold"><Award className="h-4 w-4 text-accent" />{r.cert}</p>
                  <dl className="mt-2 grid grid-cols-3 gap-2 text-xs">
                    <dt className="text-muted-foreground">{t("Who", "யார்")}</dt><dd className="col-span-2">{r.who}</dd>
                    <dt className="text-muted-foreground">{t("Validity", "செல்லுபடி")}</dt><dd className="col-span-2">{r.validity}</dd>
                    <dt className="text-muted-foreground">{t("Renew", "புதுப்பி")}</dt><dd className="col-span-2">{r.renew}</dd>
                  </dl>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-5 border-accent/30 bg-accent/5">
          <CardHeader><CardTitle className="text-base">📸 {t("Tip", "குறிப்பு")}</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm">{t("Keep photos of all your certifications on BridgeWork. You will never lose them — even if you lose the physical card.", "உங்கள் அனைத்து சான்றிதழ்களின் புகைப்படங்களையும் BridgeWork-இல் வைக்கவும். உடல் அட்டையை இழந்தாலும், நீங்கள் அவற்றை இழக்க மாட்டீர்கள்.")}</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
