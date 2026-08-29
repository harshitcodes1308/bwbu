"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { LANGS } from "@/lib/languages";
import { PageTitle } from "@/components/PageTitle";
import { Icon } from "@/components/icons";

export default function ProfilePage() {
  const { t, language, setLanguage, profile } = useApp();
  const router = useRouter();
  const cycle = () => setLanguage(LANGS[(LANGS.findIndex((l) => l.code === language) + 1) % LANGS.length].code);
  const currentLabel = LANGS.find((l) => l.code === language)?.label ?? language;
  return <div className="app-page"><div className="page-width narrow-page"><PageTitle title={t.profileTitle} subtitle={t.profileNote} onBack={() => router.push("/home")} /><section className="profile-card"><div className="large-avatar">{profile.initials}</div><h2>{profile.name[language]}</h2><p>{profile.jobCard}</p><span>{profile.village[language]}</span></section><div className="settings-list"><button type="button" onClick={cycle}><span>{currentLabel}</span><Icon name="switch" /></button><div><span>{t.dataLabel}</span><strong>{t.syntheticDemo}</strong></div><div><span>{t.versionLabel}</span><strong>{t.hackathonBuild}</strong></div></div></div></div>;
}
