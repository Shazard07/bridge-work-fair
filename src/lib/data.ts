// Central mock data + types
export type Sector = "Construction" | "Marine";

export const SECTORS: Sector[] = ["Construction", "Marine"];

export const PIPELINE_STAGES = [
  "Applied",
  "Shortlisted",
  "Offer Sent",
  "Offer Accepted",
  "Work Permit In Progress",
  "Arrived in Singapore",
] as const;
export type Stage = typeof PIPELINE_STAGES[number];

export const STAGE_DESCRIPTIONS: Record<Stage, string> = {
  "Applied": "Your application has been received. The business will review it soon.",
  "Shortlisted": "You've been shortlisted. Expect a WhatsApp message from the business.",
  "Offer Sent": "An offer has been sent. Review the details carefully before accepting.",
  "Offer Accepted": "Offer accepted. Document verification will start shortly.",
  "Work Permit In Progress": "Your Singapore work permit is being processed by the employer.",
  "Arrived in Singapore": "Welcome to Singapore! Use the helplines below if you need support.",
};

export type Business = {
  id: string; company: string; license: string; contact: string;
  email: string; phone: string; whatsapp: string; verified: boolean;
};

export type Worker = {
  id: string;
  name: string;
  fin: string;
  dob: string;
  years: "0" | "1-2" | "3-5" | "5+";
  sector: Sector;
  salaryExpect: number; // SGD/month
  phone: string;
};

export type Job = {
  id: string; title: string; businessId: string; sector: Sector;
  workersNeeded: number; salaryMin: number; salaryMax: number;
  duration: number; accommodation: boolean; minYears: number;
  skills: string; startDate: string;
  status: "Draft" | "Active" | "Closed";
};

export type Application = {
  id: string; workerId: string; jobId: string; stage: Stage;
  daysInStage: number;
};

export const BUSINESSES: Business[] = [
  { id: "a1", company: "BuildRight Pte Ltd", license: "EA123456", contact: "Lim Wei", email: "lim@buildright.sg", phone: "+65 9123 4567", whatsapp: "6591234567", verified: true },
  { id: "a2", company: "SingaLink Manpower", license: "EA789012", contact: "Tan Mei", email: "mei@singalink.sg", phone: "+65 9234 5678", whatsapp: "6592345678", verified: true },
  { id: "a3", company: "ProSource EA", license: "EA345678", contact: "Goh Han", email: "han@prosource.sg", phone: "+65 9345 6789", whatsapp: "6593456789", verified: true },
];

export const WORKERS: Worker[] = [
  { id: "w1", name: "Murugan Rajan", fin: "G1234567X", dob: "1990-04-12", years: "5+", sector: "Construction", salaryExpect: 2000, phone: "+91 98765 43210" },
  { id: "w2", name: "Selvam Kumar", fin: "G2345678X", dob: "1992-08-05", years: "3-5", sector: "Marine", salaryExpect: 2200, phone: "+91 98765 11111" },
  { id: "w3", name: "Anand Thiru", fin: "G3456789X", dob: "1995-01-22", years: "1-2", sector: "Construction", salaryExpect: 1700, phone: "+91 98765 22222" },
  { id: "w4", name: "Priya Senthil", fin: "G4567890X", dob: "1993-11-30", years: "3-5", sector: "Marine", salaryExpect: 2100, phone: "+91 98765 33333" },
  { id: "w5", name: "Karthik Manoharan", fin: "G5678901X", dob: "1988-06-18", years: "5+", sector: "Construction", salaryExpect: 2300, phone: "+91 98765 44444" },
  { id: "w6", name: "Rajan Velu", fin: "G6789012X", dob: "1998-03-09", years: "0", sector: "Construction", salaryExpect: 1500, phone: "+91 98765 55555" },
];

export const JOBS: Job[] = [
  { id: "j1", title: "Marine Welder", businessId: "a2", sector: "Marine", workersNeeded: 5, salaryMin: 1800, salaryMax: 2200, duration: 24, accommodation: true, minYears: 3, skills: "Marine MIG/TIG welding, blueprint reading", startDate: "2026-07-15", status: "Active" },
  { id: "j2", title: "Construction Formwork", businessId: "a1", sector: "Construction", workersNeeded: 10, salaryMin: 1600, salaryMax: 1900, duration: 18, accommodation: true, minYears: 1, skills: "Formwork, rebar, basic carpentry", startDate: "2026-06-30", status: "Active" },
  { id: "j3", title: "Scaffolder", businessId: "a3", sector: "Construction", workersNeeded: 3, salaryMin: 1700, salaryMax: 2000, duration: 12, accommodation: false, minYears: 3, skills: "Scaffolding certification, height safety", startDate: "2026-07-01", status: "Active" },
  { id: "j4", title: "Pipe Fitter Marine", businessId: "a2", sector: "Marine", workersNeeded: 4, salaryMin: 2000, salaryMax: 2500, duration: 24, accommodation: true, minYears: 3, skills: "Marine pipe fitting, welding, blueprint reading", startDate: "2026-08-01", status: "Active" },
];

export const APPLICATIONS: Application[] = [
  { id: "ap1", workerId: "w1", jobId: "j2", stage: "Arrived in Singapore", daysInStage: 12 },
  { id: "ap2", workerId: "w2", jobId: "j1", stage: "Offer Sent", daysInStage: 3 },
  { id: "ap3", workerId: "w3", jobId: "j2", stage: "Shortlisted", daysInStage: 2 },
  { id: "ap4", workerId: "w4", jobId: "j4", stage: "Applied", daysInStage: 1 },
  { id: "ap5", workerId: "w5", jobId: "j3", stage: "Offer Accepted", daysInStage: 7 },
  { id: "ap6", workerId: "w6", jobId: "j2", stage: "Applied", daysInStage: 1 },
];

export const NOTIFICATIONS_BUSINESS = [
  { id: "n1", text: "3 new workers match your Construction posting", time: "2h ago", unread: true },
  { id: "n2", text: "Murugan R. accepted your offer", time: "5h ago", unread: true },
  { id: "n3", text: "Your job posting expires in 3 days", time: "1d ago", unread: false },
];

export const NOTIFICATIONS_WORKER = [
  { id: "n1", text: "A business viewed your profile", time: "1h ago", unread: true },
  { id: "n2", text: "You have a new job offer from BuildRight Pte Ltd", time: "3h ago", unread: true },
  { id: "n3", text: "Your application moved to Shortlisted", time: "2d ago", unread: false },
];
