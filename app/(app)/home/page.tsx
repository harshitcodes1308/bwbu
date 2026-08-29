"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { Icon } from "@/components/icons";

export default function HomePage() {
  const { t, language, profile } = useApp();
  const router = useRouter();
  const firstName = profile.name[language].split(" ")[0];
  const paymentStatus = profile.tone === "paid" ? t.paid : profile.tone === "new" ? t.notStarted : t.pendingDays;

  return (
    <div className="app-page">
      <div className="page-width">
        <div className="topbar">
          <div>
            <p className="page-kicker">{profile.village[language]}</p>
            <h1 data-page-title tabIndex={-1}>{t.namaste}, {firstName}</h1>
          </div>
          <div className="avatar" aria-label={profile.name[language]}>{profile.initials}</div>
        </div>

        <p className="synthetic-note"><span className="note-dot" aria-hidden="true" />{t.syntheticBanner}</p>

        <section className="summary-card">
          <div className="summary-topline">
            <span className={`status-chip ${profile.tone}`}><span />{paymentStatus}</span>
            <span className="updated">{t.lastUpdated}</span>
          </div>
          <h2>{profile.status[language]}</h2>
          <p>{profile.detail[language]}</p>
          <div className="summary-stats">
            <div><span>{t.workLabel}</span><strong>{profile.workName[language]}</strong></div>
            <div><span>{t.days}</span><strong>{profile.days}</strong></div>
            <div><span>{t.paymentStatus}</span><strong>{paymentStatus}</strong></div>
          </div>
        </section>

        <section className="home-section">
          <div className="action-grid">
            <button className="action-tile primary-tile" type="button" onClick={() => router.push("/wage-status")}>
              <span className="tile-mark"><Icon name="rupee" /></span>
              <strong>{t.whyMoneyStuck}</strong>
              <span>{t.ladderSub}</span>
            </button>
            <button className="action-tile" type="button" onClick={() => router.push("/grievance")}>
              <span className="tile-mark alert-mark"><Icon name="alert" /></span>
              <strong>{t.createComplaint}</strong>
              <span>{t.grievanceLead}</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
