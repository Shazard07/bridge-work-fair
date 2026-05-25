import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Lang = "en" | "ta";
type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (en: string, ta: string) => string };

const LangCtx = createContext<Ctx>({ lang: "en", setLang: () => {}, t: (en) => en });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("bw_lang") : null;
    if (stored === "ta" || stored === "en") setLangState(stored);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("bw_lang", l);
  };
  const t = (en: string, ta: string) => (lang === "ta" ? ta : en);
  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);

export function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`inline-flex items-center rounded-full border border-border bg-card p-0.5 text-xs font-semibold ${className}`}>
      <button
        onClick={() => setLang("en")}
        className={`rounded-full px-3 py-1.5 transition-colors ${lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
      >EN</button>
      <button
        onClick={() => setLang("ta")}
        className={`rounded-full px-3 py-1.5 font-tamil transition-colors ${lang === "ta" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
      >தமிழ்</button>
    </div>
  );
}
