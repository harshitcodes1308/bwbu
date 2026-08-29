"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { Ladder } from "@/components/Ladder";
import { PageTitle } from "@/components/PageTitle";
import { Icon } from "@/components/icons";

export default function GrievanceStatusPage() {
  const { t, language, profile, draft } = useApp();
  const router = useRouter();
  return (
    <div className="app-page"><div className="page-width narrow-page">
      <PageTitle title={t.grievanceTrack} subtitle={t.grievanceId} onBack={() => router.push("/home")} />
      <section className="feature-panel grievance-panel">
        <div className="panel-label">{t.grievanceId}</div>
        <h2>{draft?.subject ?? profile.status[language]}</h2>
        <p>{draft ? t.grievanceDraftBody : profile.detail[language]}</p>
        <Ladder t={t} grievance />
      </section>
      <button className="wide-outline-button" type="button" onClick={() => router.push("/grievance")}>
        <Icon name="alert" />{t.createComplaint}<Icon name="arrow" />
      </button>
    </div></div>
  );
}
