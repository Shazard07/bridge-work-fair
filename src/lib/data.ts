// Mock data + types for BridgeWork (worker-only profile platform)

export type Sector = "Construction" | "Marine";

export const DISTRICTS = [
  "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli",
  "Salem", "Vellore", "Tirunelveli", "Erode", "Thoothukudi", "Other",
] as const;
export type District = typeof DISTRICTS[number];

export const CONSTRUCTION_TITLES = [
  "Formwork Carpenter", "Scaffolder", "Concretor", "Steel Bar Worker",
  "Plasterer", "General Worker", "Supervisor",
] as const;

export const MARINE_TITLES = [
  "Welder", "Pipe Fitter", "Rigger", "Blaster/Painter",
  "Crane Operator", "General Worker",
] as const;

export const YEARS_BANDS = ["Less than 1", "1–2", "3–5", "5–10", "10+"] as const;
export type YearsBand = typeof YEARS_BANDS[number];

export const STANDARD_CERT_KEYS = [
  "CSOC", "Welding", "Crane", "Forklift", "FirstAid", "BizSAFE",
] as const;
export type CertKey = typeof STANDARD_CERT_KEYS[number];

export const CERT_META: Record<CertKey, { en: string; ta: string; mandatoryFor?: Sector }> = {
  CSOC:     { en: "CSOC Green Card",         ta: "CSOC பச்சை அட்டை", mandatoryFor: "Construction" },
  Welding:  { en: "Welding Certification",   ta: "வெல்டிங் சான்றிதழ்" },
  Crane:    { en: "Crane Operator License",  ta: "க்ரேன் ஆபரேட்டர் உரிமம்" },
  Forklift: { en: "Forklift License",        ta: "ஃபோர்க்லிஃப்ட் உரிமம்" },
  FirstAid: { en: "First Aid Certification", ta: "முதலுதவி சான்றிதழ்" },
  BizSAFE:  { en: "BizSAFE",                 ta: "BizSAFE" },
};

export type CertStatus = "Valid" | "Expiring Soon" | "Expired" | "Not uploaded";

export type CertEntry = {
  fileName?: string;
  expiryDate?: string; // ISO yyyy-mm-dd
  noExpiry?: boolean;
};

export type PreviousEmployer = {
  company: string;
  jobTitle: string;
  sector: Sector;
  startMonth: string; // yyyy-mm
  endMonth: string;
};

export type WorkerProfile = {
  id: string;
  // Personal
  fullName: string;
  dob: string;
  phone: string;
  district: District | "";
  sgAddress: string;
  wpNumber: string;
  wpExpiry: string;
  employer: string;
  contractEnd: string;
  // Experience
  sector: Sector | "";
  jobTitle: string;
  yearsBand: YearsBand | "";
  previousEmployers: PreviousEmployer[];
  skillsText: string;
  // Certifications
  certs: Partial<Record<CertKey, CertEntry>>;
  otherCerts: { label: string; entry: CertEntry }[];
  // Availability
  availableFrom: string;
  nextSector: "Construction" | "Marine" | "Open to both" | "";
  preferredDuration: "1 year" | "2 years" | "Any" | "";
  openTo: "Main contractor" | "Subcontractor" | "Any" | "";
  availabilityNotes: string;
  // Visibility
  visibleToAgents: boolean;
};

export function emptyProfile(): WorkerProfile {
  return {
    id: "me",
    fullName: "", dob: "", phone: "", district: "", sgAddress: "",
    wpNumber: "", wpExpiry: "", employer: "", contractEnd: "",
    sector: "", jobTitle: "", yearsBand: "", previousEmployers: [], skillsText: "",
    certs: {}, otherCerts: [],
    availableFrom: "", nextSector: "", preferredDuration: "", openTo: "", availabilityNotes: "",
    visibleToAgents: false,
  };
}

// ---------- Derivations ----------
const MS_DAY = 86400000;
export function daysFromToday(iso: string): number | null {
  if (!iso) return null;
  const d = new Date(iso + "T00:00:00").getTime();
  const t = new Date(new Date().toISOString().slice(0,10) + "T00:00:00").getTime();
  return Math.round((d - t) / MS_DAY);
}

export function certStatus(c?: CertEntry): CertStatus {
  if (!c || !c.fileName) return "Not uploaded";
  if (c.noExpiry) return "Valid";
  if (!c.expiryDate) return "Valid";
  const days = daysFromToday(c.expiryDate);
  if (days === null) return "Valid";
  if (days < 0) return "Expired";
  if (days <= 90) return "Expiring Soon";
  return "Valid";
}

export function availabilityStatus(contractEnd: string): "Available Now" | "Available Soon" | "Currently Employed" | "Unknown" {
  const d = daysFromToday(contractEnd);
  if (d === null) return "Unknown";
  if (d <= 0) return "Available Now";
  if (d <= 60) return "Available Soon";
  return "Currently Employed";
}

export function profileStrength(p: WorkerProfile): { pct: number; missing: string[] } {
  const missing: string[] = [];
  let score = 0;
  // Personal (25)
  const personal = [p.fullName, p.dob, p.phone, p.district, p.sgAddress, p.wpNumber, p.wpExpiry, p.employer, p.contractEnd];
  const personalFilled = personal.filter(Boolean).length;
  score += Math.round((personalFilled / personal.length) * 25);
  if (personalFilled < personal.length) missing.push("Complete personal info");
  // Experience (25)
  const exp = [p.sector, p.jobTitle, p.yearsBand, p.skillsText];
  const expFilled = exp.filter(Boolean).length;
  score += Math.round((expFilled / exp.length) * 25);
  if (expFilled < exp.length) missing.push("Add your work experience");
  // Certs (30) — count of uploaded standard certs / 6
  const uploaded = STANDARD_CERT_KEYS.filter(k => p.certs[k]?.fileName).length;
  score += Math.round((uploaded / STANDARD_CERT_KEYS.length) * 30);
  if (uploaded === 0) missing.push("Upload your CSOC card");
  else if (uploaded < 2) missing.push("Add more certifications");
  // Availability (10)
  const avail = [p.availableFrom, p.nextSector, p.preferredDuration, p.openTo];
  const availFilled = avail.filter(Boolean).length;
  score += Math.round((availFilled / avail.length) * 10);
  if (availFilled < avail.length) missing.push("Set availability preferences");
  // Visibility-ready (10)
  if (p.visibleToAgents) score += 10;
  else missing.push("Turn on profile visibility when ready");
  return { pct: Math.min(100, score), missing };
}

export function certCompleteness(p: WorkerProfile): number {
  const uploaded = STANDARD_CERT_KEYS.filter(k => p.certs[k]?.fileName).length;
  return Math.round((uploaded / STANDARD_CERT_KEYS.length) * 100);
}

// ---------- Mock workers (for landing & internal reference) ----------
export type MockWorker = {
  id: string;
  name: string;
  district: District;
  sector: Sector;
  jobTitle: string;
  years: number;
  contractDays: number | "available";
  certs: string[];
  profilePct: number;
};

export const MOCK_WORKERS: MockWorker[] = [
  { id: "w1", name: "Murugan R.",  district: "Chennai",          sector: "Construction", jobTitle: "Formwork Carpenter", years: 5, contractDays: 45,          certs: ["CSOC"],                                 profilePct: 85 },
  { id: "w2", name: "Selvam K.",   district: "Madurai",          sector: "Marine",       jobTitle: "Welder",             years: 3, contractDays: 10,          certs: ["CSOC", "Welding"],                      profilePct: 100 },
  { id: "w3", name: "Anand T.",    district: "Coimbatore",       sector: "Construction", jobTitle: "Scaffolder",         years: 2, contractDays: 90,          certs: ["CSOC"],                                 profilePct: 70 },
  { id: "w4", name: "Priya S.",    district: "Chennai",          sector: "Marine",       jobTitle: "Pipe Fitter",        years: 4, contractDays: "available", certs: ["CSOC", "Welding", "FirstAid"],          profilePct: 100 },
  { id: "w5", name: "Karthik M.",  district: "Tiruchirappalli",  sector: "Construction", jobTitle: "Supervisor",         years: 7, contractDays: 30,          certs: ["CSOC", "FirstAid", "BizSAFE"],          profilePct: 100 },
  { id: "w6", name: "Rajan V.",    district: "Salem",            sector: "Construction", jobTitle: "General Worker",     years: 1, contractDays: 60,          certs: ["CSOC"],                                 profilePct: 60 },
  { id: "w7", name: "Deepa L.",    district: "Vellore",          sector: "Marine",       jobTitle: "Rigger",             years: 2, contractDays: "available", certs: ["CSOC", "Welding"],                      profilePct: 75 },
  { id: "w8", name: "Surya P.",    district: "Erode",            sector: "Construction", jobTitle: "Steel Bar Worker",   years: 6, contractDays: 20,          certs: ["CSOC", "Crane"],                        profilePct: 90 },
];

export const HELPLINES = [
  { name: "MOM Foreign Worker Helpline", number: "6438 5122" },
  { name: "Migrant Workers' Centre",     number: "6536 2692" },
  { name: "TWC2",                        number: "6247 7001" },
];
