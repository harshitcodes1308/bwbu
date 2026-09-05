"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { fill } from "@/lib/copy";
import { Ladder } from "@/components/Ladder";
import { PageTitle } from "@/components/PageTitle";
import { NewWorkerIllustration } from "@/components/Illustrations";

const GUARANTEE_DAYS = 100;
const NOTIFIED_RATE = 237;
const FISCAL_YEAR = "2024-25";
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function WageStatusPage() {
  const { t, language, profile } = useApp();
  const router = useRouter();
  const isPaid = profile.tone === "paid";
  const isNew = profile.tone === "new";
  // Mount-gated: the pending count is measured against the real clock, and that
  // must not differ between the server render and the first client render.
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => setToday(new Date()), []);

  const daysLeft = Math.max(0, GUARANTEE_DAYS - profile.days);
  // Same derivation as the demand screen, so the two can never disagree on rate.
  const rate = profile.days > 0 ? Math.round(profile.wage / profile.days) : NOTIFIED_RATE;
  // Days since the muster roll closed — that is when the payment clock started.
  // Floor, not round: 18 days and 18 hours elapsed is still "pending 18 days".
  const daysPending =
    today && profile.musterRollClosed
      ? Math.max(0, Math.floor((today.getTime() - new Date(`${profile.musterRollClosed}T00:00:00`).getTime()) / 86400000))
      : 0;

  return (
    <div className="app-page">
      <div className="page-width">
        <PageTitle title={t.wageDetails} subtitle={t.ladderSub} onBack={() => router.push("/home")} />

        {isNew ? (
          <section className="empty-state-card new-worker-card">
            <div className="empty-illustration-wrap">
              <NewWorkerIllustration size={160} />
            </div>
            <h2>{t.newWorkerAwaiting}</h2>
            <p>{t.newWorkerLead}</p>
          </section>
        ) : (
          <>
            {/* Worker Identity Overview Bar */}
            <div className="worker-identity-bar">
              <div className="identity-item">
                <span>{t.workerName}</span>
                <strong>{profile.name[language]}</strong>
              </div>
              <div className="identity-item">
                <span>{t.jobCard}</span>
                <strong>{profile.jobCard}</strong>
              </div>
              <div className="identity-item">
                <span>{t.fiscalYearLabel}</span>
                <strong>{FISCAL_YEAR}</strong>
              </div>
            </div>

            {/* 3-Card Bento Grid */}
            <div className="bento-wage-grid">
              {/* Card 1: Total Days Worked / 100 Days Guarantee */}
              <div className="bento-card">
                <div>
                  <div className="bento-card-header">
                    <span className="bento-card-title">{t.totalWorkDays}</span>
                    <div className="bento-icon-box soil">
                      <span className="material-symbols-outlined">calendar_month</span>
                    </div>
                  </div>
                  <div className="bento-card-value">
                    {profile.days} <span style={{ fontSize: 18, color: "var(--muted)", fontWeight: 500 }}>{t.ofHundredDays}</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div className="gauge-track">
                    <div className="gauge-segment green" style={{ width: `${Math.min(profile.days, GUARANTEE_DAYS)}%` }} />
                    <div className="gauge-segment remaining" />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>
                    <span>{fill(t.daysDoneLabel, profile.days)}</span>
                    <span style={{ color: "var(--terracotta-red)" }}>{fill(t.daysGuaranteeLeft, daysLeft)}</span>
                  </div>
                </div>
                <div className="bento-footer-strip">
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: "var(--leaf-green)" }}>verified</span>
                    {t.mgnregaAct}
                  </span>
                </div>
              </div>

              {/* Card 2: Total Wage Earned & Received (Leaf Green) */}
              <div className="bento-card">
                <div>
                  <div className="bento-card-header">
                    <span className="bento-card-title">{t.wageEarnedReceived}</span>
                    <div className="bento-icon-box green">
                      <span className="material-symbols-outlined">payments</span>
                    </div>
                  </div>
                  {/* The received figure is wagePaid, never an invented total: a worker
                      whose money is stuck must not be shown a credited amount. */}
                  <div className={`bento-card-value ${isPaid ? "green" : ""}`}>
                    {inr(profile.wagePaid)}
                  </div>
                </div>
                <div>
                  <span className={`bento-badge ${isPaid ? "green" : "amber"}`}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: isPaid ? "var(--leaf-green)" : "var(--sun-amber)" }} />
                    {isPaid ? t.paid : t.notPaidYet} • {fill(t.workDaysCount, profile.days)}
                  </span>
                  <p style={{ margin: "8px 0 0", fontSize: 13, color: "var(--muted)", lineHeight: 1.4 }}>
                    {isPaid ? t.paidCelebration : t.awaitingCreditNote}
                  </p>
                </div>
                <div className="bento-footer-strip">
                  <span>{t.notifiedRateLabel}</span>
                  <strong style={{ color: "var(--leaf-green)" }}>{inr(rate)} {t.perDaySuffix}</strong>
                </div>
              </div>

              {/* Card 3: Pending Wage Due (Sun Amber) */}
              <div className="bento-card">
                <div>
                  <div className="bento-card-header">
                    <span className="bento-card-title">{t.pendingWageDue}</span>
                    <div className="bento-icon-box amber">
                      <span className="material-symbols-outlined">pending_actions</span>
                    </div>
                  </div>
                  <div className="bento-card-value amber">
                    {inr(isPaid ? 0 : profile.wage)}
                  </div>
                </div>
                <div>
                  <span className="bento-badge amber">
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--sun-amber)" }} />
                    {isPaid ? t.noDuesLabel : fill(t.inProcessWorkDays, profile.days)}
                  </span>
                  <p style={{ margin: "8px 0 0", fontSize: 13, color: "var(--muted)", lineHeight: 1.4 }}>
                    {profile.workName[language]}
                  </p>
                </div>
                <div className="bento-footer-strip">
                  <span>{t.paymentStatus}</span>
                  <strong style={{ color: isPaid ? "var(--leaf-green)" : "var(--terracotta-red)" }}>
                    {isPaid ? t.fullyPaidLabel : fill(t.pendingSinceDays, daysPending)}
                  </strong>
                </div>
              </div>
            </div>

            {/* Signature AI Delay Explanation Card (When delayed/pending) */}
            {!isPaid && (
              <section className="delay-explanation-card">
                <div className="delay-badge-row">
                  <span className="ai-pill-tag">
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>auto_awesome</span>
                    {t.aiSimpleExplanation}
                  </span>
                  <span className="delay-update-time">
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>schedule</span>
                    {t.lastUpdatedMorning}
                  </span>
                </div>

                <h2 className="delay-title">
                  {fill(t.whyPaymentStuckAmount, profile.wage.toLocaleString("en-IN"))}
                </h2>
                <p className="delay-narrative">
                  {profile.detail[language]} {t.delayCompensationNote}
                </p>

                <div className="delay-stepper">
                  <div className="delay-step-item">
                    <span className="material-symbols-outlined" style={{ color: "var(--leaf-green)", fontSize: 24 }}>check_circle</span>
                    <div>
                      <span className="delay-step-num">{t.delayStep1}</span>
                      <div className="delay-step-text">{t.delayStep1Sub}</div>
                    </div>
                  </div>
                  <div className="delay-step-item active">
                    <span className="material-symbols-outlined" style={{ color: "var(--sun-amber)", fontSize: 24 }}>sync</span>
                    <div>
                      <span className="delay-step-num" style={{ color: "var(--sun-amber)" }}>{t.delayStep2}</span>
                      <div className="delay-step-text">{t.delayStep2Sub}</div>
                    </div>
                  </div>
                  <div className="delay-step-item" style={{ opacity: 0.7 }}>
                    <span className="material-symbols-outlined" style={{ color: "var(--wheat)", fontSize: 24 }}>account_balance</span>
                    <div>
                      <span className="delay-step-num">{t.delayStep3}</span>
                      <div className="delay-step-text">{t.delayStep3Sub}</div>
                    </div>
                  </div>
                </div>

                <div className="delay-actions">
                  <button
                    className="primary-button"
                    type="button"
                    onClick={() => router.push("/ai-explanation")}
                    style={{ margin: 0, minHeight: 44, padding: "10px 20px" }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>psychology</span>
                    <span>{t.explainAi}</span>
                  </button>
                  <button
                    className="button"
                    type="button"
                    onClick={() => router.push("/grievance")}
                    style={{ margin: 0, minHeight: 44, padding: "10px 20px", background: "rgba(255,255,255,0.12)", color: "var(--paper)", border: "1px solid rgba(255,255,255,0.2)" }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>report_problem</span>
                    <span>{t.createComplaint}</span>
                  </button>
                </div>
              </section>
            )}

            {/* Verified Bank Account Info Card */}
            <div className="bank-account-card">
              <div className="bank-left">
                <div className="bank-icon-box">
                  <span className="material-symbols-outlined">account_balance</span>
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span className="bank-name">{profile.bank[language]}</span>
                    <span className="bank-verified-tag">
                      <span className="material-symbols-outlined" style={{ fontSize: 12 }}>verified</span>
                      {t.dbtAadhaarLinked}
                    </span>
                  </div>
                  <div className="bank-account-num">
                    {t.accountNumberLabel}: <strong style={{ color: "var(--ink)" }}>{profile.accountMasked}</strong> • IFSC: {profile.ifsc}
                  </div>
                </div>
              </div>
              <div className="bank-npci-status">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>
                <span>{t.npciActive}</span>
              </div>
            </div>

            {/* 5-Step Physical Ladder Tracker */}
            <section className="feature-panel track-panel" style={{ marginTop: 24 }}>
              <div className="panel-label">MR-2026-{profile.jobCard.slice(-3)}</div>
              <h2>{profile.status[language]}</h2>
              <p>{profile.detail[language]}</p>
              <Ladder t={t} currentStep={profile.step} />
            </section>

            {/* Expandable Official Record Details */}
            <details className="record-details" style={{ marginTop: 20 }}>
              <summary>{t.recordDetails}</summary>
              <div className="detail-list">
                <div><span>{t.workLabel}</span><strong>{profile.workName[language]}</strong><em>{t.demoOnly}</em></div>
                <div><span>{t.musterRollClosedLabel}</span><strong>{profile.musterRollClosed || "—"}</strong><em>{t.demoOnly}</em></div>
                <div><span>{t.stageLabel}</span><strong>{profile.currentStage}</strong><em>Stage / FTO</em></div>
                <div><span>{t.reasonLabel}</span><strong>{profile.reason}</strong><em>{t.demoOnly}</em></div>
              </div>
            </details>
          </>
        )}
      </div>
    </div>
  );
}
