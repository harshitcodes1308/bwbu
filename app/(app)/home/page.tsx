"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { fill } from "@/lib/copy";
import { Icon } from "@/components/icons";
import { Avatar } from "@/components/Avatar";
import { Ladder } from "@/components/Ladder";
import { PaidCelebrationBadge } from "@/components/Illustrations";

export default function HomePage() {
  const { t, language, profile } = useApp();
  const router = useRouter();
  const firstName = profile.name[language].split(" ")[0];
  const paymentStatus = profile.tone === "paid" ? t.paid : profile.tone === "new" ? t.notStarted : t.pendingDays;
  const daysUsed = Math.max(0, profile.days);
  const daysLeft = 100 - daysUsed;

  return (
    <div className="app-page">
      <div className="page-width">
        <div className="topbar">
          <div>
            <p className="page-kicker">{profile.village[language]}</p>
            <h1 data-page-title tabIndex={-1}>{t.namaste}, {firstName}</h1>
          </div>
          <div className="avatar-wrap" aria-label={profile.name[language]}>
            <Avatar profileId={profile.id} size={48} alt={profile.name[language]} />
          </div>
        </div>

        <p className="synthetic-note"><span className="note-dot" aria-hidden="true" />{t.syntheticBanner}</p>

        <section className="summary-card">
          <div className="summary-topline">
            <div className="status-pulse-pill">
              <span className="pulse-dot">
                <span className="pulse-ring" />
                <span className="pulse-core" />
              </span>
              <span className={`status-text ${profile.tone}`}>{paymentStatus}</span>
            </div>
            <div className="sync-time">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>sync</span>
              <span>{t.lastUpdated}</span>
            </div>
          </div>

          <h2>{profile.status[language]}</h2>
          <p>{profile.detail[language]}</p>

          {profile.tone === "paid" && (
            <div className="paid-celebration-strip">
              <PaidCelebrationBadge />
              <div>
                <strong>{t.paidCelebration}</strong>
                <span>₹{profile.wagePaid.toLocaleString("en-IN")} • {profile.days} {t.days}</span>
              </div>
            </div>
          )}

          <div className="stitch-metric-grid">
            <div className="metric-box">
              <span className="metric-label">{t.workLabel}</span>
              <strong className="metric-value">{profile.workName[language]}</strong>
              <span className="metric-sub">{profile.days} {t.days}</span>
            </div>
            <div className="metric-box">
              <span className="metric-label">{t.due}</span>
              <strong className="metric-value">₹{profile.wage.toLocaleString("en-IN")}</strong>
              <span className="metric-sub">{paymentStatus}</span>
            </div>
            <div className="metric-box">
              <span className="metric-label">{t.jobCard}</span>
              <strong className="metric-value">{profile.jobCard}</strong>
              <span className="metric-sub active-link">{t.dbtLinkActive}</span>
            </div>
          </div>

          <div className="summary-footer-row">
            <button
              type="button"
              className="summary-link-action"
              onClick={() => router.push("/wage-status")}
            >
              <span>{t.wageDetails}</span>
              <Icon name="arrow" />
            </button>
            <span className="fto-pill">FTO: UP-2026-{profile.jobCard.slice(-3)}</span>
          </div>
        </section>

        {/* 100-Day Legal Passbook Gauge Strip (from Stitch) */}
        <section className="passbook-gauge-card">
          <div className="gauge-header">
            <div>
              <h3>{t.guarantee100Days}</h3>
              <p>{fill(t.gaugeLead, t.fiscalYear)}</p>
            </div>
            <div className="gauge-metrics">
              <span className="gauge-metric green">{fill(t.daysDoneLabel, daysUsed)}</span>
              <span className="gauge-divider">•</span>
              <span className="gauge-metric amber">{fill(t.legendRemaining, daysLeft)}</span>
            </div>
          </div>
          <div className="gauge-track">
            <div
              className="gauge-segment green"
              style={{ width: `${Math.min(profile.days * 2, 70)}%` }}
              title={t.completedWorkLabel}
            />
            <div
              className="gauge-segment amber"
              style={{ width: profile.step === 3 || profile.step === 2 ? "20%" : "0%" }}
              title={t.inProcessLabel}
            />
            <div className="gauge-segment remaining" />
          </div>
          <div className="gauge-legend">
            <div><span className="legend-dot green" /><span>{fill(t.daysVerified, daysUsed)}</span></div>
            <div><span className="legend-dot amber" /><span>{t.inProcessLabel}</span></div>
            <div><span className="legend-dot gray" /><span>{fill(t.daysRightRemaining, daysLeft)}</span></div>
          </div>
          {/* The gauge shows what is still owed, so the Form 6 claim belongs right here. */}
          <button className="gauge-cta" type="button" onClick={() => router.push("/demand-work")}>
            <span className="material-symbols-outlined" aria-hidden="true">assignment_add</span>
            <span>{t.askForWorkCta}</span>
            <Icon name="arrow" />
          </button>
        </section>

        <section className="home-section">
          <div className="section-heading">
            <div>
              <h2>{t.ladderTitle}</h2>
              <p>{t.ladderSub}</p>
            </div>
            <button
              type="button"
              className="text-button"
              onClick={() => router.push("/wage-status")}
            >
              {t.trackNav} <Icon name="arrow" />
            </button>
          </div>
          <div className="home-ladder-panel">
            <Ladder t={t} currentStep={profile.step} compact />
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
