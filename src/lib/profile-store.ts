import { useEffect, useState, useCallback } from "react";
import { emptyProfile, type WorkerProfile } from "./data";

const KEY = "bw_profile";

function read(): WorkerProfile {
  if (typeof window === "undefined") return seed();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    return { ...emptyProfile(), ...JSON.parse(raw) };
  } catch {
    return seed();
  }
}

function seed(): WorkerProfile {
  // Seed with Murugan R.'s data so the dashboard isn't empty on first visit.
  const today = new Date();
  const inDays = (n: number) => new Date(today.getTime() + n * 86400000).toISOString().slice(0, 10);
  return {
    ...emptyProfile(),
    fullName: "Murugan R.",
    dob: "1990-05-12",
    phone: "+65 9123 4567",
    district: "Chennai",
    sgAddress: "Blk 43, Tuas South Ave 4, #02-12",
    wpNumber: "G1234567P",
    wpExpiry: inDays(400),
    employer: "BuildRight Pte Ltd",
    contractEnd: inDays(45),
    sector: "Construction",
    jobTitle: "Formwork Carpenter",
    yearsBand: "3–5",
    previousEmployers: [
      { company: "SkyHigh Builders", jobTitle: "Formwork Carpenter", sector: "Construction", startMonth: "2021-03", endMonth: "2023-08" },
    ],
    skillsText: "Concrete formwork, rebar tying, scaffolding. 5+ years in Singapore highrise projects.",
    certs: {
      CSOC: { fileName: "csoc-card.jpg", noExpiry: true },
    },
    otherCerts: [],
    availableFrom: inDays(46),
    nextSector: "Construction",
    preferredDuration: "2 years",
    openTo: "Any",
    availabilityNotes: "",
    visibleToAgents: false,
  };
}

export function useProfile() {
  const [profile, setProfile] = useState<WorkerProfile>(() => emptyProfile());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProfile(read());
    setReady(true);
  }, []);

  const save = useCallback((updater: (p: WorkerProfile) => WorkerProfile) => {
    setProfile(prev => {
      const next = updater(prev);
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    try { localStorage.removeItem(KEY); } catch {}
    setProfile(seed());
  }, []);

  return { profile, save, reset, ready };
}
