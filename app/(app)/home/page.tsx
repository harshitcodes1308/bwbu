"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { fill } from "@/lib/copy";
import { profiles } from "@/lib/profiles";
import { unemploymentAllowance, daysSince, STATUTORY_DAYS } from "@/lib/entitlements";
import { Icon } from "@/components/icons";
import { Avatar } from "@/components/Avatar";
import { Ladder } from "@/components/Ladder";
import { ReadAloud } from "@/components/ReadAloud";
import { PaidCelebrationBadge } from "@/components/Illustrations";

const NOTIFIED_RATE = 237; // state-notified daily wage rate, used when no record exists
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
// A maps search for the village — user-initiated navigation, opens their map app.
const mapsUrl = (place: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;

export default function HomePage() {
  const { t, language, profile, profileIndex, setProfileIndex } = useApp();
  const router = useRouter();
  const [shared, setShared] = useState(false);
  // Mount-gated: the wait is measured against the real clock, and server/first
  // client render must agree (see the same pattern on wage-status).
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => setToday(new Date()), []);
  const firstName = profile.name[language].split(" ")[0];

  // Unemployment-allowance entitlement: work demanded but not provided in 15 days.
  const rate = profile.days > 0 ? Math.round(profile.wage / profile.days) : NOTIFIED_RATE;
  const daysWaiting = today ? daysSince(profile.demandedOn, today) : 0;
  const allowance = unemploymentAllowance(daysWaiting, rate);
  const showAllowance = !!profile.demandedOn && allowance.eligible;

  // Rural workers often act through a literate relative or panchayat helper —
  // one tap forwards the plain status sentence over WhatsApp/SMS. Falls back to
  // the clipboard where the Web Share sheet is unavailable (most desktops).
  async function shareStatus() {
    const text = `${profile.status[language]} — ${profile.detail[language]}`;
    try {
      if (navigator.share) { await navigator.share({ title: t.brand, text }); return; }
      await navigator.clipboard.writeText(text);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {}
  }
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

        {/* Shared-phone reality: one handset, several job cards in a household.
            Reuses the profile machinery so a relative can check another's status. */}
        <section className="household-switch" aria-label={t.householdTitle}>
          <p className="household-title">{t.householdTitle}</p>
          <div className="household-row">
            {profiles.map((p, i) => (
              <button
                key={p.id}
                type="button"
                className={`household-chip ${i === profileIndex ? "active" : ""}`}
                aria-pressed={i === profileIndex}
                onClick={() => setProfileIndex(i)}
              >
                <Avatar profileId={p.id} size={40} alt={p.name[language]} />
                <span>{p.name[language].split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </section>

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

          <ReadAloud text={`${profile.status[language]}. ${profile.detail[language]}`} className="summary-audio" />

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
            <button type="button" className="summary-share-btn" onClick={shareStatus} aria-label={t.shareAnswer}>
              <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 18 }}>{shared ? "check" : "share"}</span>
              <span>{t.shareAnswer}</span>
            </button>
            <span className="fto-pill">FTO: UP-2026-{profile.jobCard.slice(-3)}</span>
          </div>
        </section>

        {showAllowance && (
          <section className="allowance-card">
            <div className="allowance-head">
              <span className="material-symbols-outlined" aria-hidden="true">balance</span>
              <div>
                <h3>{t.allowanceTitle}</h3>
                <p>{fill(fill(t.allowanceLead, daysWaiting), STATUTORY_DAYS)}</p>
              </div>
            </div>
            <div className="allowance-amount">
              <span>{t.allowanceDueLabel}</span>
              <strong>{inr(allowance.amount)}</strong>
              <small>{fill(t.allowanceDaysNote, allowance.eligibleDays)}</small>
            </div>
            <p className="allowance-note">{t.allowanceNote}</p>
            <button className="gauge-cta" type="button" onClick={() => router.push("/grievance")}>
              <span className="material-symbols-outlined" aria-hidden="true">gavel</span>
              <span>{t.allowanceCta}</span>
              <Icon name="arrow" />
            </button>
          </section>
        )}

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

        {profile.tone !== "new" && (
          <section className="home-section">
            <div className="directory-card">
              <h3><span className="material-symbols-outlined amber" aria-hidden="true">pin_drop</span>{t.worksiteContextTitle}</h3>
              <div className="directory-rows">
                <div className="directory-row">
                  <span className="material-symbols-outlined" aria-hidden="true">engineering</span>
                  <div>
                    <strong>{profile.workName[language]}</strong>
                    <small>{fill(t.distanceAway, profile.distanceKm.toLocaleString(language === "en" ? "en-IN" : "hi-IN"))}</small>
                  </div>
                </div>
                <div className="directory-row">
                  <span className="material-symbols-outlined" aria-hidden="true">account_balance</span>
                  <div>
                    <strong>{t.gramPanchayat}</strong>
                    <small>{profile.village[language]}</small>
                  </div>
                </div>
              </div>
              <div className="directory-actions">
                <a className="directory-call" href={`tel:${profile.grsPhone}`}>
                  <span className="material-symbols-outlined" aria-hidden="true">call</span>
                  <span>{t.callGrs}</span>
                </a>
                <a className="directory-directions" href={mapsUrl(profile.village[language])} target="_blank" rel="noopener noreferrer">
                  <span className="material-symbols-outlined" aria-hidden="true">directions</span>
                  <span>{t.getDirections}</span>
                </a>
              </div>
            </div>
          </section>
        )}

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
