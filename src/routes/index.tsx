import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useLang } from "@/lib/lang";
import { ShieldCheck, FolderOpen, Coins, UserPlus, FileText, Search, Quote } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BridgeWork — Your Singapore work record. Always with you." },
      { name: "description", content: "Free digital work profile for Tamil migrant workers in Singapore. Upload certifications, record skills and work history. Zero fees." },
      { property: "og:title", content: "BridgeWork — Your Singapore work record. Always with you." },
      { property: "og:description", content: "Free digital work profile for Tamil migrant workers in Singapore. Upload certifications, record skills and work history. Zero fees." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { t } = useLang();
  return (
    <AppShell role="public">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-success" />
              {t("Free for workers · Always", "தொழிலாளர்களுக்கு இலவசம் · எப்போதும்")}
            </div>
            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-foreground md:text-6xl">
              {t("Your Singapore work record.", "உங்கள் சிங்கப்பூர் பணி சாதனை.")}{" "}
              <span className="text-accent">{t("Always with you.", "எப்போதும் உங்களுடன்.")}</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              {t(
                "Build a digital profile of your skills, work history and certifications. Keep it for life.",
                "உங்கள் திறன், வேலை வரலாறு, சான்றிதழ்களின் டிஜிட்டல் சுயவிவரத்தை உருவாக்குங்கள்.",
              )}
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-md bg-accent px-8 py-4 text-base font-semibold text-accent-foreground shadow-sm transition-transform hover:scale-[1.02] hover:opacity-95"
              >
                {t("Create Your Free Profile", "உங்கள் இலவச சுயவிவரத்தை உருவாக்குங்கள்")}
              </Link>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{t("Takes 2 minutes. No payment ever.", "2 நிமிடங்கள். எந்த கட்டணமும் இல்லை.")}</p>
          </div>
        </div>
      </section>

      {/* Why it matters */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <h2 className="text-center text-3xl font-bold tracking-tight">{t("Why it matters", "ஏன் முக்கியம்")}</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: ShieldCheck, en: "Prove your skills and experience to future employers", ta: "எதிர்கால முதலாளிகளுக்கு உங்கள் திறன்களை நிரூபிக்கவும்" },
            { icon: FolderOpen,  en: "Keep all your certifications in one place",            ta: "உங்கள் சான்றிதழ்களை ஒரே இடத்தில் வைக்கவும்" },
            { icon: Coins,       en: "Find your next job in Singapore without paying broker fees", ta: "தரகர் கட்டணம் இல்லாமல் அடுத்த வேலையைக் கண்டறியவும்" },
          ].map((s, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <s.icon className="h-6 w-6 text-accent" strokeWidth={1.75} />
              </div>
              <p className="mt-4 text-base font-medium leading-snug">{t(s.en, s.ta)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <h2 className="text-center text-3xl font-bold tracking-tight">{t("How it works", "எப்படி செயல்படுகிறது")}</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { icon: UserPlus, en_t: "Sign up free", ta_t: "இலவசமாக பதிவு செய்யுங்கள்", en: "Takes 2 minutes on your phone.",                                ta: "உங்கள் தொலைபேசியில் 2 நிமிடங்கள்." },
              { icon: FileText, en_t: "Build your profile", ta_t: "உங்கள் சுயவிவரத்தை உருவாக்குங்கள்", en: "Add your work history and upload certifications.", ta: "வேலை வரலாற்றை சேர்த்து சான்றிதழ்களை பதிவேற்றவும்." },
              { icon: Search,   en_t: "Get found", ta_t: "கண்டுபிடிக்கப்படுங்கள்", en: "When your contract ends, licensed agents can find you directly.",      ta: "உங்கள் ஒப்பந்தம் முடியும்போது, ​​உரிமம் பெற்ற முகவர்கள் உங்களை நேரடியாக கண்டுபிடிக்க முடியும்." },
            ].map((s, i) => (
              <div key={i} className="relative rounded-xl border border-border bg-card p-6">
                <div className="absolute -top-3 left-6 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</div>
                <s.icon className="h-7 w-7 text-primary" strokeWidth={1.5} />
                <h3 className="mt-3 text-lg font-semibold">{t(s.en_t, s.ta_t)}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t(s.en, s.ta)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fee promise */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center md:px-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/70">{t("Fee promise", "கட்டண உறுதிமொழி")}</p>
          <h2 className="mt-3 text-4xl font-extrabold md:text-5xl">{t("Free for workers. Always.", "தொழிலாளர்களுக்கு இலவசம். எப்போதும்.")}</h2>
          <p className="mt-3 font-tamil text-lg text-primary-foreground/80">எப்போதும் இலவசம்.</p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <h2 className="text-center text-3xl font-bold">{t("Workers using BridgeWork", "BridgeWork பயன்படுத்தும் தொழிலாளர்கள்")}</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { name: "Murugan R.", role: "Formwork Carpenter", quote: "I uploaded my CSOC card and work history. Everything is in one place now." },
            { name: "Selvam K.",  role: "Welder",              quote: "My profile shows all my Singapore experience. No more explaining from scratch." },
            { name: "Anand T.",   role: "Scaffolder",          quote: "It took 10 minutes to set up. Now my certifications are always with me." },
          ].map(tm => (
            <figure key={tm.name} className="rounded-xl border border-border bg-card p-6">
              <Quote className="h-6 w-6 text-accent/60" />
              <blockquote className="mt-4 text-foreground">"{tm.quote}"</blockquote>
              <figcaption className="mt-6 border-t border-border pt-4">
                <div className="text-sm font-semibold">{tm.name}</div>
                <div className="text-xs text-muted-foreground">{tm.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center md:px-6">
          <h2 className="text-3xl font-bold">{t("Start your profile today", "இன்றே உங்கள் சுயவிவரத்தை தொடங்குங்கள்")}</h2>
          <div className="mt-8">
            <Link to="/signup" className="inline-flex items-center justify-center rounded-md bg-accent px-8 py-4 font-semibold text-accent-foreground hover:opacity-90">
              {t("Create Your Free Profile", "உங்கள் இலவச சுயவிவரத்தை உருவாக்குங்கள்")}
            </Link>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
