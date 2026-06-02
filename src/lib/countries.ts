export const COUNTRIES = [
  "Bangladesh", "India", "China", "Myanmar", "Philippines", "Indonesia",
  "Malaysia", "Thailand", "Vietnam", "Sri Lanka", "Nepal", "Pakistan",
  "Cambodia", "Laos", "Taiwan", "South Korea", "Japan", "UAE",
  "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman", "Australia",
  "New Zealand", "United Kingdom", "United States", "Canada", "Other",
] as const;

export type Country = typeof COUNTRIES[number];

export const CURRENT_YEAR = new Date().getFullYear();
export const YEARS = Array.from({ length: CURRENT_YEAR - 1979 }, (_, i) => CURRENT_YEAR - i);

export type SgExperience = { role: string; company: string; start_year: number; end_year: number | null };
export type OverseasExperience = SgExperience & { country: string };
