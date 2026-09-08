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
  textLarge: boolean;
  setTextLarge: (v: boolean) => void;
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
  authed: boolean;
  authReady: boolean; // false until the stored session is read, so gates don't flash
  login: (index?: number) => void;
  logout: () => void;
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Lang>("hi");
  const [profileIndex, setProfileIndex] = useState(0);
  const [draft, setDraft] = useState<GrievanceDraft | null>(null);
  const [textLarge, setTextLarge] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [authReady, setAuthReady] = useState(false);
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
      const savedDraft = localStorage.getItem("mr_draft");
      if (savedDraft) setDraft(JSON.parse(savedDraft));
      setTextLarge(localStorage.getItem("mr_text") === "large");
      setHighContrast(localStorage.getItem("mr_contrast") === "high");
      setAuthed(localStorage.getItem("mr_authed") === "1");
    } catch {}
    setAuthReady(true);
  }, []);

  // Apply a11y prefs to <html> so plain CSS (globals.css) can react. Persisted so
  // a worker who bumps the text once keeps it across sessions.
  useEffect(() => {
    document.documentElement.dataset.text = textLarge ? "large" : "";
    try { localStorage.setItem("mr_text", textLarge ? "large" : "normal"); } catch {}
  }, [textLarge]);
  useEffect(() => {
    document.documentElement.dataset.contrast = highContrast ? "high" : "";
    try { localStorage.setItem("mr_contrast", highContrast ? "high" : "normal"); } catch {}
  }, [highContrast]);

  const handleSetLanguage = (l: Lang) => {
    setLanguage(l);
    try { localStorage.setItem("mr_lang", l); } catch {}
  };

  const handleSetProfileIndex = (i: number) => {
    setProfileIndex(i);
    try { localStorage.setItem("mr_prof", String(i)); } catch {}
  };

  // The AI-drafted grievance survives a refresh or a dropped connection — the
  // worker's own words are the one thing here too costly to lose.
  const handleSetDraft = (d: GrievanceDraft | null) => {
    setDraft(d);
    try { d ? localStorage.setItem("mr_draft", JSON.stringify(d)) : localStorage.removeItem("mr_draft"); } catch {}
  };

  // Mock session. login() optionally selects the worker whose credentials were
  // used; logout() drops the session (and the saved draft, which belonged to it).
  const login = (index?: number) => {
    if (index != null) handleSetProfileIndex(index);
    setAuthed(true);
    try { localStorage.setItem("mr_authed", "1"); } catch {}
  };
  const logout = () => {
    setAuthed(false);
    handleSetDraft(null);
    try { localStorage.removeItem("mr_authed"); } catch {}
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = language === "hi" ? "मेरा रोज़गार | MGNREGA" : "Mera Rozgar | MGNREGA";
  }, [language]);

  const value: AppState = { language, setLanguage: handleSetLanguage, t, profileIndex, setProfileIndex: handleSetProfileIndex, profile: profiles[profileIndex], draft, setDraft: handleSetDraft, textLarge, setTextLarge, highContrast, setHighContrast, authed, authReady, login, logout };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
