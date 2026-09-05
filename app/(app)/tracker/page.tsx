"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/app-context";
import { fill } from "@/lib/copy";
import { LOCALE_TAG } from "@/lib/languages";
import { jobs } from "@/lib/profiles";
import { Icon } from "@/components/icons";
import { StepLadder, type Rung, type RungStatus } from "@/components/StepLadder";
import { speak, stopSpeaking } from "@/lib/speech";

const GUARANTEE_DAYS = 100;
const NOTIFIED_RATE = 237;
// Statutory payment window: wages are due within 15 days of the muster roll closing.
const PAY_WINDOW_DAYS = 15;
// The FTO is prepared but unsigned at the active rung — the design's 80% meter.
const FTO_PERCENT = 80;
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
// Money inside copy that already prints its own ₹ (trBody4, voiceAskWhenPaid).
const plain = (n: number) => n.toLocaleString("en-IN");

// One Material Symbols glyph per stage, in the order of `jobs`. Same five the Stitch
// design uses, so the rung icons read identically.
const RUNG_ICONS = ["check_circle", "construction", "event_available", "pending_actions", "account_balance"];

// The design puts an amber hourglass tile beside the receivable figure. It only reads
// as an hourglass while money is actually pending, so it follows the persona's tone.
const FIGURE_ICON: Record<string, string> = {
  delayed: "hourglass_top",
  paid: "task_alt",
  grievance: "gavel",
  new: "pending_actions",
};

// Days a worker has actually been paid for vs still owed, out of the statutory 100.
// Same split as the profile page's quota gauge so the two screens never disagree.
function splitQuota(days: number, wagePaid: number) {
  const paid = wagePaid > 0 ? days : 0;
  return { paid, pending: days - paid, remaining: Math.max(0, GUARANTEE_DAYS - days) };
}

// Muster-roll close date ± n days. Derived from a fixed profile string rather than
// `new Date()`, so it renders the same on the server and after hydration.
function shift(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d;
}

export default function TrackerPage() {
  const { t, language, profile } = useApp();
  const [delayOpen, setDelayOpen] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  // Only "how long has this been pending" needs the wall clock, and it must not run
  // during render — the server has no way to agree with the browser about today.
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => setToday(new Date()), []);
  useEffect(() => () => stopSpeaking(), []);

  const closed = profile.musterRollClosed;
  const rate = profile.days > 0 ? Math.round(profile.wage / profile.days) : NOTIFIED_RATE;
  const quota = splitQuota(profile.days, profile.wagePaid);

  // Every identifier on this screen is derived from the job card, so switching persona
  // keeps the receipt, muster roll, work code and MB number internally consistent.
  const ids = useMemo(() => {
    const tail = profile.jobCard.replace(/\D/g, "").slice(-4).padStart(4, "0");
    const year = closed ? closed.slice(0, 4) : "2026";
    return {
      appNo: `MR-${tail}`,
      musterRoll: tail,
      receipt: `RCP-${year}-${tail}`,
      workCode: `WRK-${tail.slice(0, 3)}-${tail.slice(2)}`,
      mb: String(100 + (Number(tail) % 900)),
    };
  }, [profile.jobCard, closed]);

  const dates = useMemo(() => {
    if (!closed) return null;
    const fmt = (d: Date) => d.toLocaleDateString(LOCALE_TAG[language] ?? "hi-IN", { day: "numeric", month: "long", year: "numeric" });
    return {
      applied: fmt(shift(closed, -20)),
      allotted: fmt(shift(closed, -16)),
      attendance: fmt(shift(closed, 0)),
      updated: fmt(shift(closed, 4)),
      credited: fmt(shift(closed, 6)),
      deadline: fmt(shift(closed, PAY_WINDOW_DAYS)),
    };
  }, [closed, language]);

  const daysPending =
    today && closed ? Math.max(0, Math.floor((today.getTime() - new Date(`${closed}T00:00:00`).getTime()) / 86400000)) : 0;

  const stageTitles = [t.applied, t.allotted, t.attendance, t.processing, t.paid];
  const lastIndex = jobs.length - 1;
  const statusOf = useCallback(
    (i: number): RungStatus => {
      if (profile.step >= lastIndex) return i <= lastIndex ? "done" : "future";
      return i < profile.step ? "done" : i === profile.step ? "current" : "future";
    },
    [profile.step, lastIndex],
  );
  const badgeOf = (s: RungStatus) => (s === "done" ? t.stepDone : s === "current" ? t.stepActive : t.stepUpcoming);
  // A finished rung shows its real date; the live one says "you are here"; the rest
  // simply point forward, which is all the `new` persona can honestly claim.
  const whenOf = (s: RungStatus, exact?: string) => (s === "current" ? t.processingDate : (exact ?? t.paidDate));

  const rungs: Rung[] = jobs.map((key, i) => {
    const status = statusOf(i);
    const base = { key, icon: RUNG_ICONS[i], status, badge: badgeOf(status), title: stageTitles[i] };
    if (i === 0)
      return { ...base, when: whenOf(status, dates?.applied), body: t.trBody1, metaLabel: t.ackSlipLabel, metaValue: ids.receipt };
    if (i === 1)
      return {
        ...base,
        when: whenOf(status, dates?.allotted),
        // A worker with no allotment yet has no muster roll and no worksite, so the
        // rung says what will happen instead of printing an id for work that is not
        // assigned. Same reasoning for the attendance and wage rungs below.
        body: status === "future" ? t.trBody2Pending : fill(fill(t.trBody2, ids.musterRoll), profile.workName[language]),
        metaLabel: t.workCodeLabel,
        metaValue: status === "future" ? "—" : ids.workCode,
      };
    if (i === 2)
      return {
        ...base,
        when: whenOf(status, dates?.attendance),
        body: t.trBody3,
        metaLabel: t.trTotalAttendance,
        metaValue: profile.days > 0 ? fill(fill(t.trAttendanceValue, profile.days), profile.days) : "—",
        metaNote: profile.days > 0 ? t.verified : undefined,
      };
    if (i === 3)
      return {
        ...base,
        when: whenOf(status, dates?.updated),
        // Three tenses on one rung: nothing to compute yet, computation under way, and
        // computation signed off. The middle copy says the signature is still awaited,
        // so it cannot be reused once the FTO has cleared.
        body:
          profile.days === 0
            ? fill(t.trBody4Pending, rate)
            : fill(fill(fill(status === "done" ? t.trBody4Done : t.trBody4, rate), profile.days), plain(profile.wage)),
        metaLabel: t.trLastUpdated,
        metaValue: dates?.updated ?? "—",
        metaNote: t.trDeadline15,
        pills:
          // The design's active rung carries exactly two chips: the status label — which
          // `badgeOf` already renders — and the elapsed-time pill. `trActivePill` would
          // just repeat the badge, so only the timer pill is added here.
          status === "current" && daysPending > 0 ? [{ icon: "schedule", text: fill(t.trProcessingSince, daysPending) }] : undefined,
        meter: status === "current" ? { label: t.trFtoPrep, value: fill(t.trFtoPrepValue, FTO_PERCENT), percent: FTO_PERCENT } : undefined,
        actions:
          status === "current" ? (
            <>
              <button type="button" className="tr-solid sm" onClick={() => setDelayOpen(true)}>
                <span className="material-symbols-outlined" aria-hidden="true">help</span>
                {t.trWhyDelay}
              </button>
              <Link className="tr-outline sm" href="/grievance">
                <span className="material-symbols-outlined" aria-hidden="true">edit_note</span>
                {t.createComplaint}
              </Link>
            </>
          ) : undefined,
      };
    return {
      ...base,
      when: status === "done" ? (dates?.credited ?? t.paidDate) : fill(t.trAfterStep, lastIndex),
      // Once the money has landed, "will land within 48 hours" is stale — the paid
      // persona gets the credited wording and a nudge to check the passbook entry.
      body: fill(fill(status === "done" ? t.trBody5Done : t.trBody5, profile.bank[language]), profile.accountMasked),
      metaLabel: t.paymentRoute,
      metaValue: "DBT / ABPS",
      metaNote: profile.ifsc,
    };
  });

  // Read-aloud covers the four facts a worker who cannot read still needs from this
  // screen: what it is, which application, which stage, and how much is owed.
  const spoken = [
    t.trTitle,
    fill(t.trAppNo, ids.appNo),
    fill(t.trActiveStage, stageTitles[Math.min(profile.step, lastIndex)]),
    profile.wage > 0 ? `${t.trReceivable} ${inr(profile.wage)}` : t.trReceivableEmpty,
    profile.detail[language],
  ].join(". ");

  function toggleListen() {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    speak(spoken, language);
  }

  useEffect(() => {
    if (!delayOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDelayOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [delayOpen]);

  const banner =
    profile.tone === "new"
      ? { icon: "hourglass_empty", tone: "neutral", title: t.newWorkerAwaiting, body: t.newWorkerLead, href: "/demand-work", cta: t.demand }
      : profile.tone === "paid"
        ? { icon: "task_alt", tone: "good", title: t.trPaidBanner, body: profile.detail[language], href: "/wage-status", cta: t.wageDetails }
        : profile.tone === "grievance"
          ? // `grievanceTrack`, not `trackNav`: /grievance-submitted already labels this
            // same destination that way, and "ट्रैक" alone is a nav tab, not a CTA.
            { icon: "gavel", tone: "warn", title: t.trGrievanceBanner, body: profile.detail[language], href: "/grievance-status", cta: t.grievanceTrack }
          : null;

  return (
    <div className="app-page tracker-page">
      <div className="page-width">
        <div className="tr-utility">
          <nav className="tr-crumbs" aria-label={t.trCrumb}>
            <Link href="/home">
              <Icon name="back" />
              {t.home}
            </Link>
            <span aria-hidden="true">/</span>
            <span>{t.trCrumb}</span>
            <span aria-hidden="true">/</span>
            <strong>#{ids.appNo}</strong>
          </nav>
          <div className="tr-utility-actions">
            <button type="button" className="tr-ghost" onClick={toggleListen} aria-pressed={speaking}>
              <span className="material-symbols-outlined" aria-hidden="true">{speaking ? "stop_circle" : "volume_up"}</span>
              {t.listenAloudTitle}
            </button>
            <button type="button" className="tr-ghost" onClick={() => window.print()}>
              <span className="material-symbols-outlined" aria-hidden="true">print</span>
              {t.printReceipt}
            </button>
          </div>
        </div>

        <header className="tr-hero">
          <div className="tr-hero-copy">
            <span className={`tr-stage-pill ${profile.tone}`}>
              <i className="tr-pulse" aria-hidden="true" />
              {fill(t.trActiveStage, stageTitles[Math.min(profile.step, lastIndex)])}
            </span>
            <h1 data-page-title tabIndex={-1}>{t.trTitle}</h1>
            <p className="tr-subline">
              {fill(t.trAppNo, ids.appNo)} • {t.workLabel}: {profile.workName[language]}
            </p>
          </div>
          <div className="tr-figure">
            <div className="tr-figure-copy">
              <span className="tr-figure-label">{t.trReceivable}</span>
              <strong>{profile.wage > 0 ? inr(profile.wage) : "—"}</strong>
              <span className="tr-figure-sub">
                <span className="material-symbols-outlined" aria-hidden="true">{profile.days > 0 ? "check_circle" : "info"}</span>
                {profile.days > 0 ? fill(t.trReceivableSub, profile.days) : t.trReceivableEmpty}
              </span>
            </div>
            <span className={`tr-figure-ic ${profile.tone}`} aria-hidden="true">
              <span className="material-symbols-outlined">{FIGURE_ICON[profile.tone] ?? "hourglass_top"}</span>
            </span>
          </div>
        </header>

        <div className="tr-grid">
          <div className="tr-main">
            {banner && (
              <section className={`tr-banner ${banner.tone}`}>
                <span className="material-symbols-outlined" aria-hidden="true">{banner.icon}</span>
                <div>
                  <strong>{banner.title}</strong>
                  <p>{banner.body}</p>
                </div>
                <Link className="tr-banner-cta" href={banner.href}>
                  {banner.cta}
                  <Icon name="arrow" />
                </Link>
              </section>
            )}

            <section className="tr-panel">
              <div className="tr-panel-head">
                <span className="tr-panel-ic" aria-hidden="true">
                  <span className="material-symbols-outlined">stairs</span>
                </span>
                <div className="tr-panel-copy">
                  <h2>{t.trRungsTitle}</h2>
                  <p>{t.trRungsSub}</p>
                </div>
                <span className="tr-step-count">{fill(fill(t.trStepOf, Math.min(profile.step + 1, jobs.length)), jobs.length)}</span>
              </div>

              <StepLadder rungs={rungs} label={t.trRungsTitle} />

              <p className="tr-rule">
                <span className="material-symbols-outlined" aria-hidden="true">policy</span>
                <span>{t.trRuleNote}</span>
                <Link href="/ai-explanation">
                  {t.trRuleLink}
                  <Icon name="arrow" />
                </Link>
              </p>
            </section>
          </div>

          <aside className="tr-side">
            <section className="tr-card">
              <div className="tr-card-head">
                <h3>{t.activePassbook}</h3>
                <span className="tr-chip green">{t.activeCardPill}</span>
              </div>
              <dl className="tr-rows">
                <div>
                  <dt>{t.jobCard}</dt>
                  <dd>{profile.jobCard}</dd>
                </div>
                <div>
                  <dt>{t.demandVillage}</dt>
                  <dd>{profile.village[language]}</dd>
                </div>
                <div>
                  <dt>{t.totalDaysUsed}</dt>
                  <dd>
                    {profile.days} {t.ofHundredDays}
                  </dd>
                </div>
              </dl>
              <div className="quota-panel-head">
                <span>{t.guarantee100Days}</span>
                <span className="fy-pill">{fill(t.legendRemaining, quota.remaining)}</span>
              </div>
              <div className="gauge-track">
                <div className="gauge-segment green" style={{ width: `${quota.paid}%` }} />
                <div className="gauge-segment amber" style={{ width: `${quota.pending}%` }} />
                <div className="gauge-segment remaining" />
              </div>
              <div className="gauge-legend">
                <span>
                  <i className="legend-dot green" />
                  {fill(t.legendPaid, quota.paid)}
                </span>
                <span>
                  <i className="legend-dot amber" />
                  {fill(t.legendPending, quota.pending)}
                </span>
                <span>
                  <i className="legend-dot gray" />
                  {fill(t.legendRemaining, quota.remaining)}
                </span>
              </div>
            </section>

            {/* The photo, the geo-stamp, the mate and the MB number are all attendance
                artefacts. A worker with no recorded days has none of them, so the whole
                card stays out rather than showing an empty frame. */}
            {profile.days > 0 && (
              <section className="tr-card">
                <div className="tr-card-head">
                  <h3>{t.worksiteContextTitle}</h3>
                  <span className="tr-chip green">{t.nmmsVerified}</span>
                </div>
                <figure className="tr-photo">
                  {/* Cropped straight out of screens/step_ladder_tracker/screen.png: the design's
                      own photo, minus the caption rows it bakes over the bottom of the frame. */}
                  <img src="/images/worksite-evidence.jpg" alt={t.trPhotoAlt} width={332} height={110} />
                  <figcaption>
                    <span className="tr-photo-stamp">{fill(t.trPhotoStamp, dates?.attendance ?? t.attendanceDate)}</span>
                    <span className="tr-photo-geo">{fill(t.trPhotoGeo, profile.village[language])}</span>
                  </figcaption>
                </figure>
                <div className="tr-mate">
                  <span className="material-symbols-outlined" aria-hidden="true">verified_user</span>
                  <div>
                    <strong>{fill(t.trMate, t.trMateName)}</strong>
                    <span>{fill(t.trMbEntry, ids.mb)}</span>
                  </div>
                </div>
              </section>
            )}

            <section className="tr-card tr-help">
              <div className="tr-help-head">
                <span className="tr-help-ic" aria-hidden="true">
                  <span className="material-symbols-outlined">support_agent</span>
                </span>
                <h3>{t.trHelpTitle}</h3>
              </div>
              <p className="tr-help-body">{t.trHelpBody}</p>
              <div className="tr-voice">
                <div className="tr-voice-head">
                  <strong>{t.voiceHelpTitle}</strong>
                  <span className="tr-avail">
                    <i aria-hidden="true" />
                    {t.trVoiceAvailable}
                  </span>
                </div>
                <Link className="tr-voice-btn" href="/voice-help">
                  <span className="material-symbols-outlined" aria-hidden="true">record_voice_over</span>
                  {profile.wage > 0 ? fill(t.voiceAskWhenPaid, plain(profile.wage)) : t.voiceAskWhenWork}
                </Link>
              </div>
              <div className="tr-fast">
                <Link href="/grievance">
                  <span className="material-symbols-outlined" aria-hidden="true">edit_note</span>
                  {t.createComplaint}
                </Link>
                <Link href="/wage-status">
                  <span className="material-symbols-outlined" aria-hidden="true">receipt_long</span>
                  {t.wageDetails}
                </Link>
                {/* Western digits in the href: the label is localised and hi/bn render
                    the number in their own script, which `tel:` cannot dial. */}
                <a className="tr-tollfree" href="tel:18003456789">
                  <span className="material-symbols-outlined" aria-hidden="true">call</span>
                  <span>
                    <small>{t.tollFree}</small>
                    <strong>{t.lpHelplineNumber}</strong>
                  </span>
                </a>
              </div>
            </section>
          </aside>
        </div>
      </div>

      {delayOpen && (
        <div className="tr-modal-scrim" onClick={() => setDelayOpen(false)}>
          <div
            className="tr-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tr-delay-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tr-modal-head">
              <span className="tr-modal-ic" aria-hidden="true">
                <span className="material-symbols-outlined">hourglass_bottom</span>
              </span>
              <h2 id="tr-delay-title">{fill(t.trDelayTitle, Math.min(profile.step + 1, jobs.length))}</h2>
              <button type="button" className="tr-modal-x" onClick={() => setDelayOpen(false)} aria-label={t.back}>
                <Icon name="close" />
              </button>
            </div>
            <p className="tr-modal-lead">{fill(fill(t.trDelayIntro, profile.days), dates?.attendance ?? t.attendanceDate)}</p>
            <div className="tr-blocker">
              <strong>{t.trBlockerLabel}</strong>
              <p>{t.trBlockerBody}</p>
            </div>
            <p className="tr-modal-note">
              <span className="material-symbols-outlined" aria-hidden="true">gavel</span>
              <span>{fill(t.trDelayComp, dates?.deadline ?? t.trDeadline15)}</span>
            </p>
            <div className="tr-modal-actions">
              <button type="button" className="tr-solid" onClick={() => setDelayOpen(false)}>
                {t.trUnderstood}
              </button>
              <Link className="tr-outline" href="/grievance">
                <span className="material-symbols-outlined" aria-hidden="true">gavel</span>
                {t.trComplainBdo}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
