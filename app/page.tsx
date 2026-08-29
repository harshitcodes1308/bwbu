"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { BrandHeader } from "@/components/BrandHeader";
import { Ladder } from "@/components/Ladder";
import { Icon } from "@/components/icons";

function WorkerVisual() {
  const { t } = useApp();
  return (
    <figure className="worker-visual">
      <img className="hero-photo" src="/images/worker-field.png" width="900" height="1125" alt={t.landingHeroAlt} fetchPriority="high" />
      <div className="worker-visual__meta">
        <p className="hero-status">{t.heroStatus}</p>
        <figcaption className="hero-caption">{t.heroCaption}</figcaption>
      </div>
    </figure>
  );
}

export default function LandingPage() {
  const { t, language } = useApp();
  const router = useRouter();
  const onContinue = () => router.push("/login");
  return (
    <main className="landing-page">
      <BrandHeader onHome={() => router.push("/")} />
      <div className="landing-wrap">
        <section className="landing-hero">
          <div className="landing-hero-copy">
            <h1>{t.brand}</h1>
            <p className="landing-promise">{t.landingPromise}</p>
            <div className="landing-actions"><button className="primary-button" type="button" onClick={onContinue}>{t.landingCta}<Icon name="arrow" /></button><a href="#why-made">{t.landingWhy}<Icon name="arrow-down" /></a></div>
          </div>
          <WorkerVisual />
        </section>

        <section className="landing-facts" aria-label={t.importantFacts}>
          {[t.statWorkers, t.statGuarantee, t.statDirect].map((fact) => <div className="fact-line" key={fact}><p>{fact}</p></div>)}
        </section>

        <section className="why-made" id="why-made">
          <div className="landing-section-intro"><h2>{t.whyTitle}</h2><p>{t.whyLead}</p></div>
          <div className="why-made-body">
            <div className="contrast-grid"><div className="contrast-col official"><h3>{t.officialLabel}</h3><p>{t.contrastLanguage.split(" → ")[0]}</p><p>{t.contrastAccess.split(" → ")[0]}</p><p>{t.contrastDelay.split(" → ")[0]}</p></div><div className="contrast-col product"><h3>{t.productLabel}</h3><p>{t.contrastLanguage.split(" → ")[1]}</p><p>{t.contrastAccess.split(" → ")[1]}</p><p>{t.contrastDelay.split(" → ")[1]}</p></div></div>
            <aside className="record-artifact" aria-label={t.recordTitle}>
              <div className="record-artifact-head"><div><p className="record-artifact-label">{t.recordTitle}</p><small>{t.heroCaption}</small></div><span className="record-artifact-stamp">{t.demo}</span></div>
              <div className="record-row"><span>{t.recordAttendance}</span><strong className="record-value">{t.recordAttendanceValue}</strong></div>
              <div className="record-row"><span>{t.recordWage}</span><strong className="record-value">₹2,530</strong></div>
              <div className="record-row"><span>{t.recordDelay}</span><strong className="record-status">{t.recordDelayValue}</strong></div>
            </aside>
          </div>
        </section>

        <section className="how-section">
          <div className="how-copy"><div className="landing-section-intro"><h2>{t.howTitle}</h2><p>{t.howLead}</p></div><Ladder t={t} compact preview /></div>
          <aside className="how-artifact" aria-label={t.howAsideTitle}>
            <h3>{t.howAsideTitle}</h3>
            <div className="artifact-row"><span>{t.recordAttendance}</span><strong>{t.recordAttendanceValue}</strong></div>
            <div className="artifact-row"><span>{t.recordWage}</span><strong>₹2,530</strong></div>
            <div className="artifact-row"><span>{t.recordDelay}</span><strong>{t.recordDelayValue}</strong></div>
            <div className="artifact-note"><span className="ai-spark" aria-hidden="true" /><div><strong>OpenAI</strong><p>{t.howAsideBody}</p></div></div>
          </aside>
        </section>

        <section className="final-cta"><div className="final-cta-copy"><h2>{t.finalCta}</h2><p>{t.landingPromise}</p></div><button className="primary-button final-cta-action" type="button" onClick={onContinue}>{t.landingCta}<Icon name="arrow" /></button></section>
        <footer className="trust-footer"><span>{t.trustPrototype}</span><span>{t.trustMock}</span><span>{t.trustOfficial}</span></footer>
      </div>
    </main>
  );
}
