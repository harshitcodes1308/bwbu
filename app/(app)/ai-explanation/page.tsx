"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { PageTitle } from "@/components/PageTitle";
import { Icon } from "@/components/icons";

type Explain = { configured: boolean; summary: string; nextStep: string; disclaimer: string };

export default function AiExplanationPage() {
  const { t, language, profile } = useApp();
  const router = useRouter();
  const [data, setData] = useState<Explain | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/explain-wage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale: language,
          wageRecord: { daysWorked: profile.days, wageDue: profile.wage, musterRollClosed: profile.musterRollClosed, currentStage: profile.currentStage, reason: profile.reason },
        }),
      });
      setData(await res.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, profile.id]);

  return (
    <div className="app-page"><div className="page-width narrow-page">
      <PageTitle title={t.aiExplainTitle} subtitle={profile.status[language]} onBack={() => router.push("/wage-status")} />

      {loading && (
        <section className="reason-panel" aria-busy="true">
          <p className="ai-loading"><span className="ai-spark" aria-hidden="true" />{t.aiLoading}</p>
        </section>
      )}

      {!loading && data && (
        <>
          <section className="reason-panel ai-block">
            <div className="reason-title"><span className="amber-marker" /> <h2>{t.whatHappened}</h2></div>
            <p>{data.summary}</p>
          </section>
          <section className="reason-panel ai-block">
            <div className="reason-title"><span className="leaf-marker" /> <h2>{t.whatToDo}</h2></div>
            <p>{data.nextStep}</p>
          </section>
          <section className="reason-panel ai-block subtle">
            <div className="reason-title"><h3>{t.noteLabel}</h3></div>
            <p>{data.disclaimer}</p>
            {!data.configured && <p className="offline-note">{t.aiOfflineNote}</p>}
          </section>
          <div className="ai-answer" role="status"><span>{t.aiLabel}</span></div>
        </>
      )}

      <button className="wide-outline-button" type="button" onClick={() => router.push("/grievance")}>
        <Icon name="alert" />{t.createComplaint}<Icon name="arrow" />
      </button>
    </div></div>
  );
}
