"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { copy, type Copy, type Lang } from "./copy";
import { profiles, type Profile } from "./profiles";

export type GrievanceDraft = {
  configured: boolean;
  subject: string;
  category: string;
  complaint: string;
  suggestedRecords: string[];
};

type AppState = {
  language: Lang;
  setLanguage: (l: Lang) => void;
  t: Copy;
  profileIndex: number;
  setProfileIndex: (i: number) => void;
  profile: Profile;
  draft: GrievanceDraft | null;
  setDraft: (d: GrievanceDraft | null) => void;
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Lang>("hi");
  const [profileIndex, setProfileIndex] = useState(0);
  const [draft, setDraft] = useState<GrievanceDraft | null>(null);
  const t = useMemo(() => copy[language], [language]);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("mr_lang") as Lang;
      if (savedLang && ["hi", "en", "bn", "mr", "ta", "te"].includes(savedLang)) setLanguage(savedLang);
      const savedProf = localStorage.getItem("mr_prof");
      if (savedProf !== null && !isNaN(Number(savedProf))) {
        const idx = Number(savedProf);
        if (idx >= 0 && idx < profiles.length) setProfileIndex(idx);
      }
    } catch {}
  }, []);

  const handleSetLanguage = (l: Lang) => {
    setLanguage(l);
    try { localStorage.setItem("mr_lang", l); } catch {}
  };

  const handleSetProfileIndex = (i: number) => {
    setProfileIndex(i);
    try { localStorage.setItem("mr_prof", String(i)); } catch {}
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = language === "hi" ? "मेरा रोज़गार | MGNREGA" : "Mera Rozgar | MGNREGA";
  }, [language]);

  const value: AppState = { language, setLanguage: handleSetLanguage, t, profileIndex, setProfileIndex: handleSetProfileIndex, profile: profiles[profileIndex], draft, setDraft };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
