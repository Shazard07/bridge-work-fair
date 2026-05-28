// Central mock data + types
export type Sector = "Construction" | "Marine";
export type District =
  | "Chennai" | "Coimbatore" | "Madurai" | "Tiruchirappalli"
  | "Salem" | "Vellore" | "Tirunelveli" | "Erode" | "Thoothukudi" | "Other";

export const DISTRICTS: District[] = [
  "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli",
  "Salem", "Vellore", "Tirunelveli", "Erode", "Thoothukudi", "Other"
];

export const PIPELINE_STAGES = [
  "Applied",
  "Shortlisted",
  "Offer Sent",
  "Offer Accepted",
  "Documents Verified",
  "Work Permit In Progress",
  "Arrived in Singapore",
] as const;
export type Stage = typeof PIPELINE_STAGES[number];

export const STAGE_DESCRIPTIONS: Record<Stage, { en: string; ta: string }> = {
  "Applied": {
    en: "Your application has been received. The agent will review it soon.",
    ta: "உங்கள் விண்ணப்பம் பெறப்பட்டது. முகவர் விரைவில் பரிசீலிப்பார்.",
  },
  "Shortlisted": {
    en: "Great news — you've been shortlisted. Make sure all your documents are uploaded.",
    ta: "நற்செய்தி — நீங்கள் தேர்ந்தெடுக்கப்பட்டுள்ளீர்கள். உங்கள் ஆவணங்கள் அனைத்தும் பதிவேற்றப்பட்டுள்ளதா என்பதை உறுதிசெய்யவும்.",
  },
  "Offer Sent": {
    en: "An offer has been sent. Review the details carefully before accepting.",
    ta: "ஒரு வேலை வாய்ப்பு அனுப்பப்பட்டது. ஏற்கும் முன் விவரங்களை கவனமாக படிக்கவும்.",
  },
  "Offer Accepted": {
    en: "Offer accepted. Document verification will start shortly.",
    ta: "வேலை வாய்ப்பு ஏற்கப்பட்டது. ஆவண சரிபார்ப்பு விரைவில் தொடங்கும்.",
  },
  "Documents Verified": {
    en: "Your documents are verified. Your medical certificate should be uploaded if not already.",
    ta: "உங்கள் ஆவணங்கள் சரிபார்க்கப்பட்டுள்ளன. மருத்துவ சான்றிதழ் இன்னும் பதிவேற்றப்படவில்லை எனில் உடனே பதிவேற்றவும்.",
  },
  "Work Permit In Progress": {
    en: "Your Singapore work permit is being processed by the employer.",
    ta: "உங்கள் சிங்கப்பூர் வேலை அனுமதி பணியாளரால் செயலாக்கப்பட்டு வருகிறது.",
  },
  "Arrived in Singapore": {
    en: "Welcome to Singapore! Use the wellbeing check-in if you need support.",
    ta: "சிங்கப்பூருக்கு வரவேற்கிறோம்! உதவி தேவைப்பட்டால் நல்வாழ்வு செக்-இன்னைப் பயன்படுத்தவும்.",
  },
};

export type Agent = {
  id: string; company: string; license: string; contact: string;
  email: string; phone: string; verified: boolean; specialty: string;
};

export type Worker = {
  id: string; firstName: string; lastInitial: string; fullName: string;
  district: District; sector: Sector; years: "0" | "1-2" | "3-5" | "5+";
  documentsPct: number; skills: string; dob?: string; passport?: string;
  passportExpiry?: string; prevEmployer?: string;
};

export type Job = {
  id: string; title: string; agentId: string; sector: Sector;
  workersNeeded: number; salaryMin: number; salaryMax: number;
  duration: number; accommodation: boolean; minYears: number;
  skills: string; districts: District[]; startDate: string;
  status: "Draft" | "Active" | "Closed";
};

export type Application = {
  id: string; workerId: string; jobId: string; stage: Stage;
  daysInStage: number;
};

export const AGENTS: Agent[] = [
  { id: "a1", company: "BuildRight Pte Ltd", license: "EA123456", contact: "Lim Wei", email: "lim@buildright.sg", phone: "+65 9123 4567", verified: true, specialty: "Construction specialist" },
  { id: "a2", company: "SingaLink Manpower", license: "EA789012", contact: "Tan Mei", email: "mei@singalink.sg", phone: "+65 9234 5678", verified: true, specialty: "Marine and Construction" },
  { id: "a3", company: "ProSource EA", license: "EA345678", contact: "Goh Han", email: "han@prosource.sg", phone: "+65 9345 6789", verified: true, specialty: "Construction specialist" },
];

export const WORKERS: Worker[] = [
  { id: "w1", firstName: "Murugan", lastInitial: "R", fullName: "Murugan Rajan", district: "Chennai", sector: "Construction", years: "5+", documentsPct: 100, skills: "Concrete formwork, rebar tying, scaffolding, 7+ years experience in Singapore highrise projects." },
  { id: "w2", firstName: "Selvam", lastInitial: "K", fullName: "Selvam Kumar", district: "Madurai", sector: "Marine", years: "3-5", documentsPct: 75, skills: "Marine welding, pipe fitting, MIG and TIG welding certified." },
  { id: "w3", firstName: "Anand", lastInitial: "T", fullName: "Anand Thiru", district: "Coimbatore", sector: "Construction", years: "1-2", documentsPct: 100, skills: "General construction labour, formwork assistant, basic scaffolding." },
  { id: "w4", firstName: "Priya", lastInitial: "S", fullName: "Priya Senthil", district: "Chennai", sector: "Marine", years: "3-5", documentsPct: 50, skills: "Marine electrical fitter, cable laying, junction box assembly." },
  { id: "w5", firstName: "Karthik", lastInitial: "M", fullName: "Karthik Manoharan", district: "Tiruchirappalli", sector: "Construction", years: "5+", documentsPct: 100, skills: "Senior scaffolder, supervisor experience, height safety certified." },
  { id: "w6", firstName: "Rajan", lastInitial: "V", fullName: "Rajan Velu", district: "Salem", sector: "Construction", years: "0", documentsPct: 25, skills: "Eager to learn, fresh worker, completed basic construction training in India." },
  { id: "w7", firstName: "Deepa", lastInitial: "L", fullName: "Deepa Lakshmi", district: "Vellore", sector: "Marine", years: "1-2", documentsPct: 75, skills: "Marine painter, surface preparation, sandblasting." },
  { id: "w8", firstName: "Surya", lastInitial: "P", fullName: "Surya Prakash", district: "Erode", sector: "Construction", years: "3-5", documentsPct: 100, skills: "Pipe fitter, welding, plumbing systems." },
];

export const JOBS: Job[] = [
  { id: "j1", title: "Marine Welder", agentId: "a2", sector: "Marine", workersNeeded: 5, salaryMin: 1800, salaryMax: 2200, duration: 24, accommodation: true, minYears: 3, skills: "Marine MIG/TIG welding, blueprint reading", districts: ["Madurai","Chennai","Tiruchirappalli"], startDate: "2026-07-15", status: "Active" },
  { id: "j2", title: "Construction Formwork", agentId: "a1", sector: "Construction", workersNeeded: 10, salaryMin: 1600, salaryMax: 1900, duration: 18, accommodation: true, minYears: 1, skills: "Formwork, rebar, basic carpentry", districts: ["Chennai","Coimbatore","Salem"], startDate: "2026-06-30", status: "Active" },
  { id: "j3", title: "Scaffolder", agentId: "a3", sector: "Construction", workersNeeded: 3, salaryMin: 1700, salaryMax: 2000, duration: 12, accommodation: false, minYears: 3, skills: "Scaffolding certification, height safety", districts: ["Tiruchirappalli","Vellore"], startDate: "2026-07-01", status: "Active" },
  { id: "j4", title: "Pipe Fitter Marine", agentId: "a2", sector: "Marine", workersNeeded: 4, salaryMin: 2000, salaryMax: 2500, duration: 24, accommodation: true, minYears: 3, skills: "Marine pipe fitting, welding, blueprint reading", districts: ["Erode","Madurai","Chennai"], startDate: "2026-08-01", status: "Active" },
];

export const APPLICATIONS: Application[] = [
  { id: "ap1", workerId: "w1", jobId: "j2", stage: "Arrived in Singapore", daysInStage: 12 },
  { id: "ap2", workerId: "w2", jobId: "j1", stage: "Offer Sent", daysInStage: 3 },
  { id: "ap3", workerId: "w3", jobId: "j2", stage: "Shortlisted", daysInStage: 2 },
  { id: "ap4", workerId: "w4", jobId: "j4", stage: "Applied", daysInStage: 1 },
  { id: "ap5", workerId: "w5", jobId: "j3", stage: "Documents Verified", daysInStage: 7 },
  { id: "ap6", workerId: "w6", jobId: "j2", stage: "Applied", daysInStage: 1 },
  { id: "ap7", workerId: "w7", jobId: "j1", stage: "Offer Accepted", daysInStage: 4 },
  { id: "ap8", workerId: "w8", jobId: "j4", stage: "Work Permit In Progress", daysInStage: 9 },
];

export const NOTIFICATIONS_AGENT = [
  { id: "n1", text: "3 new workers from Chennai match your Construction posting", time: "2h ago", unread: true },
  { id: "n2", text: "Murugan R. accepted your offer", time: "5h ago", unread: true },
  { id: "n3", text: "Your job posting expires in 3 days", time: "1d ago", unread: false },
];

export const NOTIFICATIONS_WORKER = [
  { id: "n1", text: "An agent viewed your profile", time: "1h ago", unread: true },
  { id: "n2", text: "You have a new job offer from BuildRight Pte Ltd", time: "3h ago", unread: true },
  { id: "n3", text: "Your medical certificate is expiring soon — please update", time: "2d ago", unread: false },
];
