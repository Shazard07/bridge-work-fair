import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useLang } from "@/lib/lang";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Smile, Meh, Frown, Phone } from "lucide-react";
import { useState } from "react";
import { HELPLINES } from "@/lib/data";

export const Route = createFileRoute("/worker/wellbeing")({
  head: () => ({
    meta: [
      { title: "Wellbeing check-in — BridgeWork" },
      { name: "description", content: "Check in on how things are going. Find Singapore migrant worker support resources." },
    ],
  }),
  component: Wellbeing,
});

function Wellbeing() {
  const { t } = useLang();
  const [mood, setMood] = useState<"good" | "okay" | "issues" | null>(null);
  const [notes, setNotes] = useState("");
  return (
    <AppShell role="worker">
      <div className="mx-auto max-w-2xl px-4 py-8 md:px-6">
        <h1 className="text-2xl font-bold md:text-3xl">{t("Wellbeing check-in", "நல்வாழ்வு செக்-இன்")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("Your answers are private.", "உங்கள் பதில்கள் தனிப்பட்டவை.")}</p>

        <Card className="mt-6">
          <CardHeader><CardTitle>{t("How are things going at work?", "வேலையில் எப்படி இருக்கிறது?")}</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <Btn active={mood === "good"} onClick={() => setMood("good")} icon={<Smile className="h-7 w-7" />} label={t("Good", "நன்று")} />
              <Btn active={mood === "okay"} onClick={() => setMood("okay")} icon={<Meh className="h-7 w-7" />} label={t("Okay", "சரி")} />
              <Btn active={mood === "issues"} onClick={() => setMood("issues")} icon={<Frown className="h-7 w-7" />} label={t("Having issues", "சிக்கல்")} />
            </div>
            {mood === "issues" && (
              <Textarea
                rows={4}
                className="mt-4"
                placeholder={t("Tell us what's happening (private)", "என்ன நடக்கிறது என்று சொல்லுங்கள் (தனிப்பட்டது)")}
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            )}
            {mood && mood !== "issues" && <p className="mt-4 text-sm text-success">{t("Thanks for checking in. We're glad you're doing well.", "சரிபார்த்ததற்கு நன்றி.")}</p>}
          </CardContent>
        </Card>

        <Card className="mt-5">
          <CardHeader><CardTitle>{t("Support helplines", "ஆதரவு உதவி எண்கள்")}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {HELPLINES.map(h => (
              <a key={h.name} href={`tel:${h.number.replace(/\s/g, "")}`} className="flex items-center justify-between rounded-md border border-border p-4 hover:bg-secondary">
                <div>
                  <p className="font-semibold">{h.name}</p>
                  <p className="text-xs text-muted-foreground">{t("Tap to call", "அழைக்க தட்டவும்")}</p>
                </div>
                <span className="inline-flex items-center gap-2 font-mono text-base font-bold text-primary"><Phone className="h-4 w-4" />{h.number}</span>
              </a>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function Btn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${active ? "border-accent bg-accent/10 text-accent" : "border-border hover:bg-secondary"}`}>
      {icon}<span className="text-sm font-medium">{label}</span>
    </button>
  );
}
