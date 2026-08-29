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
    document.documentElement.lang = language;
    document.title = language === "hi" ? "मेरा रोज़गार | MGNREGA" : "Mera Rozgar | MGNREGA";
  }, [language]);

  const value: AppState = { language, setLanguage, t, profileIndex, setProfileIndex, profile: profiles[profileIndex], draft, setDraft };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
