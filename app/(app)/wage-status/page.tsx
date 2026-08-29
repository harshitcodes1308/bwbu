"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { Ladder } from "@/components/Ladder";
import { PageTitle } from "@/components/PageTitle";
import { Icon } from "@/components/icons";

export default function WageStatusPage() {
  const { t, language, profile } = useApp();
  const router = useRouter();
  return (
    <div className="app-page"><div className="page-width narrow-page">
      <PageTitle title={t.wageDetails} subtitle={t.ladderSub} onBack={() => router.push("/home")} />

      <section className="money-hero">
        <div><span>{t.due}</span><strong>₹{profile.wage.toLocaleString("en-IN")}</strong><small>{t.days}: {profile.days}</small></div>
        <div className="money-seal"><Icon name="rupee" /></div>
      </section>

      <section className="feature-panel track-panel">
        <div className="panel-label">MR-2026-{profile.jobCard.slice(-3)}</div>
        <h2>{profile.status[language]}</h2>
        <p>{profile.detail[language]}</p>
        <Ladder t={t} currentStep={profile.step} />
      </section>

      {/* Authentic terms kept out of the primary view, under an expandable section. */}
      <details className="record-details">
        <summary>{t.recordDetails}</summary>
        <div className="detail-list">
          <div><span>{t.workLabel}</span><strong>{profile.workName[language]}</strong><em>{t.demoOnly}</em></div>
          <div><span>{t.musterRollClosedLabel}</span><strong>{profile.musterRollClosed || "—"}</strong><em>{t.demoOnly}</em></div>
          <div><span>{t.stageLabel}</span><strong>{profile.currentStage}</strong><em>Stage / FTO</em></div>
          <div><span>{t.reasonLabel}</span><strong>{profile.reason}</strong><em>{t.demoOnly}</em></div>
        </div>
      </details>

      <button className="ai-button" type="button" onClick={() => router.push("/ai-explanation")}>
        <span className="ai-spark" aria-hidden="true" />{t.explainAi}<Icon name="arrow" />
      </button>
      <button className="wide-outline-button" type="button" onClick={() => router.push("/grievance")}>
        <Icon name="alert" />{t.createComplaint}<Icon name="arrow" />
      </button>
    </div></div>
  );
}
