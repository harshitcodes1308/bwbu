"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { fill } from "@/lib/copy";
import { LOCALE_TAG } from "@/lib/languages";
import { webSpeak } from "@/lib/speech";
import { Avatar } from "@/components/Avatar";
import { Icon } from "@/components/icons";

const GUARANTEE_DAYS = 100;
const MUSTER_ROLL_DAYS = 14; // one muster roll covers a fortnight of attendance
const NOTIFIED_RATE = 237; // state-notified daily rate; only used when a worker has no record to derive from
const ACK_DAYS = 3;
const WORKSITE_DAYS = 7;
const STATUTORY_DAYS = 15; // §3(1): work within 15 days of the demand, else unemployment allowance
const TOLL_FREE = "1800-345-6789";
const RING_C = 2 * Math.PI * 28;

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
// Built from local date parts rather than toISOString(): the UTC date is a day
// behind through the early IST hours, which would hand <input type="date"> a
// minimum in the past.
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

export default function DemandWorkPage() {
  const { t, language, profile } = useApp();
  const router = useRouter();
  // Today is resolved after mount on purpose. Rendering it during SSR risks a
  // hydration mismatch, because server and browser can disagree both on the
  // current date and on how Intl spells it out.
  const [today, setToday] = useState<Date | null>(null);
  const [startDate, setStartDate] = useState("");
  const [dayChoice, setDayChoice] = useState<number | null>(null);
  const [workType, setWorkType] = useState<string | null>(null);
  const [extra, setExtra] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [ack, setAck] = useState<{ id: string; applicant: string; days: number; applied: string; deadline: string } | null>(null);
  // The control that opened the acknowledgement, so closing it puts focus back
  // where the worker left off instead of dropping them at the top of the page.
  const ackTrigger = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const now = new Date();
    setToday(now);
    setStartDate(iso(addDays(now, 1)));
  }, []);

  useEffect(() => {
    if (!ack) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setAck(null); };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      const trigger = ackTrigger.current;
      // Skip when the page itself is unmounting — the node is gone by then, and
      // pulling focus would fight the route change's own focus move.
      if (trigger && document.contains(trigger)) trigger.focus();
    };
  }, [ack]);
  const used = profile.days;
  const remaining = Math.max(0, GUARANTEE_DAYS - used);
  // Rate comes from the worker's own record where there is one, so the estimate
  // below can never contradict their e-passbook. New workers get the notified rate.
  const rate = used > 0 ? Math.round(profile.wage / used) : NOTIFIED_RATE;
  const days = Math.min(dayChoice ?? MUSTER_ROLL_DAYS, remaining);
  const musterRolls = Math.ceil(days / MUSTER_ROLL_DAYS);
  const ringOffset = RING_C * (1 - used / GUARANTEE_DAYS);
  const maskedPhone = `+91 ••••••${profile.phone.slice(-4)}`;
  const canSubmit = remaining > 0 && !!startDate && !!workType && days > 0;

  const fmt = (d: Date | null) =>
    d ? d.toLocaleDateString(LOCALE_TAG[language] ?? "hi-IN", { day: "numeric", month: "long", year: "numeric" }) : "";

  const presets = useMemo(() => {
    if (!today) return [] as { key: string; label: string; date: Date }[];
    const all = [
      { key: "tomorrow", label: t.presetTomorrow, date: addDays(today, 1) },
      { key: "dayAfter", label: t.presetDayAfter, date: addDays(today, 2) },
      // getDay(): Sunday is 0, Monday 1. The `|| 7` keeps "next Monday" a week
      // away when today already is Monday instead of collapsing to today.
      { key: "monday", label: t.presetNextMonday, date: addDays(today, ((8 - today.getDay()) % 7) || 7) },
      { key: "firstOfMonth", label: t.presetNextMonthFirst, date: new Date(today.getFullYear(), today.getMonth() + 1, 1) },
    ];
    // Two labels can land on the same day — on a Saturday "day after tomorrow" *is*
    // next Monday. Selection is keyed on the date, so a duplicate chip could never
    // light up; keep the earlier, plainer label and drop the rest.
    const seen = new Set<string>();
    return all.filter((p) => {
      const key = iso(p.date);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [today, t]);

  const durationOptions = useMemo(() => {
    const set = new Set([MUSTER_ROLL_DAYS, MUSTER_ROLL_DAYS * 2, remaining].filter((d) => d > 0 && d <= remaining));
    return [...set].sort((a, b) => a - b);
  }, [remaining]);

  const workTypes: [string, string, string, string][] = [
    ["water", "water_drop", t.workWater, t.workWaterSub],
    ["land", "landscape", t.workLand, t.workLandSub],
    ["plantation", "park", t.workPlantation, t.workPlantationSub],
    ["any", "engineering", t.workAny, t.workAnySub],
  ];

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !today) return;
    const start = new Date(`${startDate}T00:00:00`);
    // §3(1) runs 15 days from the application, or from the date work is sought if
    // that falls later — so the deadline is whichever of the two comes last.
    const deadline = new Date(Math.max(addDays(today, STATUTORY_DAYS).getTime(), start.getTime()));
    const digits = profile.jobCard.replace(/\D/g, "").slice(-5).padStart(5, "0");
    ackTrigger.current = document.activeElement as HTMLElement | null;
    setAck({
      id: `MR-2026-${profile.jobCard.slice(0, 2)}-${digits}`,
      applicant: extra > 0 ? `${profile.name[language]} + ${fill(t.coApplicantCount, extra)}` : profile.name[language],
      days,
      applied: fmt(today),
      deadline: fmt(deadline),
    });
  }

  function readAloud() {
    if (speaking) return;
    setSpeaking(true);
    webSpeak([t.demandTitle, fill(t.legendRemaining, remaining), t.section31Body].join(". "), language);
    setTimeout(() => setSpeaking(false), 4000);
  }
  return (
    <div className="app-page">
      <div className="page-width">
        <div className="demand-head">
          <button className="back-button" type="button" onClick={() => router.push("/home")} aria-label={t.back}>
            <Icon name="back" />
          </button>
          <div className="demand-head-text">
            <div className="switcher-badges">
              <span className="demo-mode-badge">{t.demandFormBadge}</span>
              <span className="act-pill">{t.mgnregaAct}</span>
            </div>
            <h1 data-page-title tabIndex={-1}>{t.demandTitle}</h1>
            <p>{t.demandBody}</p>
          </div>
          <button className="button quiet-button" type="button" onClick={readAloud} aria-busy={speaking}>
            <span className="material-symbols-outlined" aria-hidden="true">{speaking ? "graphic_eq" : "hearing"}</span>
            <span>{speaking ? t.audioPlaying : t.audioAssist}</span>
          </button>
        </div>

        <div className="demand-layout">
          <div className="demand-main">
            <section className="entitlement-card">
              <div className="entitlement-ring">
                <svg viewBox="0 0 64 64" aria-hidden="true">
                  <circle className="ring-rail" cx="32" cy="32" r="28" />
                  <circle
                    className="ring-value"
                    cx="32"
                    cy="32"
                    r="28"
                    strokeDasharray={RING_C.toFixed(1)}
                    strokeDashoffset={ringOffset.toFixed(1)}
                  />
                </svg>
                <div className="ring-figure">
                  <strong>{remaining}</strong>
                  <span>{t.days}</span>
                </div>
              </div>
              <div className="entitlement-text">
                <h2>{t.guarantee100Days}</h2>
                <p>{fill(t.daysDoneLabel, used)} • {fill(t.legendRemaining, remaining)}</p>
                <span className="fy-pill">{t.fiscalYear}</span>
              </div>
            </section>

            <div className="legal-callout">
              <span className="material-symbols-outlined" aria-hidden="true">gavel</span>
              <div>
                <strong>{t.section31Title}</strong>
                <p>{t.section31Body}</p>
              </div>
              <span className="rule-pill">{t.ruleCompliant}</span>
            </div>
            {remaining === 0 ? (
              <p className="situation-alert danger quota-closed">
                <span className="material-symbols-outlined" aria-hidden="true">block</span>
                <span>{t.quotaExhausted}</span>
              </p>
            ) : (
              <>
                <section className="ledger-card">
                  <div className="ledger-head">
                    <h2>{t.applicantLedgerTitle}</h2>
                    <span className="verified-chip">
                      <span className="material-symbols-outlined" aria-hidden="true">verified_user</span>
                      {t.verified}
                    </span>
                  </div>
                  <div className="ledger-grid">
                    <div className="ledger-cell applicant-cell">
                      <Avatar profileId={profile.id} size={48} alt={profile.name[language]} />
                      <div>
                        <span>{t.workerName}</span>
                        <strong>{profile.name[language]}</strong>
                      </div>
                    </div>
                    <div className="ledger-cell">
                      <span>{t.jobCard}</span>
                      <strong className="mono">{profile.jobCard}</strong>
                      <small>{t.dbtAadhaarLinked}</small>
                    </div>
                    <div className="ledger-cell">
                      <span>{t.demandVillage}</span>
                      <strong>{profile.village[language]}</strong>
                    </div>
                    <div className="ledger-cell">
                      <span>{t.phone}</span>
                      <strong className="mono">{maskedPhone}</strong>
                      <small>{t.smsOnThisNumber}</small>
                    </div>
                  </div>
                </section>
                <form className="demand-form" onSubmit={submit}>
                  <section className="demand-field">
                    <h3 id="field-start"><span className="field-number" aria-hidden="true">1</span>{t.demandStart}</h3>
                    <p className="field-help">{t.startDateHelp}</p>
                    <div className="chip-row" role="group" aria-labelledby="field-start">
                      {presets.map((p) => {
                        const value = iso(p.date);
                        return (
                          <button
                            key={p.key}
                            type="button"
                            className={`date-chip ${startDate === value ? "selected" : ""}`}
                            aria-pressed={startDate === value}
                            onClick={() => setStartDate(value)}
                          >
                            <strong>{p.label}</strong>
                            <small>{fmt(p.date)}</small>
                          </button>
                        );
                      })}
                    </div>
                    <label className="field-input">
                      <span>{t.demandStart}</span>
                      <input
                        type="date"
                        value={startDate}
                        min={today ? iso(addDays(today, 1)) : undefined}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </label>
                  </section>
                  <section className="demand-field">
                    <h3 id="field-days"><span className="field-number" aria-hidden="true">2</span>{t.demandDays}</h3>
                    <p className="field-help">{t.durationHelp}</p>
                    <div className="duration-grid" role="group" aria-labelledby="field-days">
                      {durationOptions.map((d) => (
                        <button
                          key={d}
                          type="button"
                          className={`duration-card ${days === d ? "selected" : ""}`}
                          aria-pressed={days === d}
                          onClick={() => setDayChoice(d)}
                        >
                          <strong>{d === remaining ? fill(t.fullRemainingOption, d) : `${d} ${t.days}`}</strong>
                          <span>{fill(t.musterRollCount, Math.ceil(d / MUSTER_ROLL_DAYS))}</span>
                          <span className="duration-amount">{t.estimatedWageLabel} ~{inr(d * rate)}</span>
                          <span className="indicator-bar" aria-hidden="true">
                            <i style={{ width: `${Math.round((d / GUARANTEE_DAYS) * 100)}%` }} />
                          </span>
                        </button>
                      ))}
                    </div>
                    <label className="field-input">
                      <span>{t.customDaysLabel}</span>
                      <input
                        type="number"
                        min={1}
                        max={remaining}
                        value={days}
                        onChange={(e) => setDayChoice(Math.max(1, Math.min(remaining, Number(e.target.value) || 1)))}
                      />
                    </label>
                  </section>
                  <section className="demand-field">
                    <h3 id="field-work"><span className="field-number" aria-hidden="true">3</span>{t.workTypeHelp}</h3>
                    <p className="field-help">{fill(t.workTypeLead, profile.village[language])}</p>
                    <div className="worktype-grid" role="group" aria-labelledby="field-work">
                      {workTypes.map(([id, icon, label, sub]) => (
                        <button
                          key={id}
                          type="button"
                          className={`worktype-card ${workType === id ? "selected" : ""}`}
                          aria-pressed={workType === id}
                          onClick={() => setWorkType(id)}
                        >
                          <span className="worktype-mark material-symbols-outlined" aria-hidden="true">{icon}</span>
                          <span className="worktype-text">
                            <strong>{label}</strong>
                            <small>{sub}</small>
                          </span>
                          <span className="worktype-tick material-symbols-outlined" aria-hidden="true">
                            {workType === id ? "check_circle" : "radio_button_unchecked"}
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="demand-field">
                    <h3 id="field-family"><span className="field-number" aria-hidden="true">4</span>{t.coApplicantsTitle}</h3>
                    <p className="field-help">{t.coApplicantsLead}</p>
                    <div className="self-row">
                      <Avatar profileId={profile.id} size={40} alt={profile.name[language]} />
                      <div>
                        <strong>{profile.name[language]}</strong>
                        <small>{t.applicantSelf}</small>
                      </div>
                      <span className="main-applicant-pill">{t.mainApplicantPill}</span>
                    </div>
                    <div className="chip-row" role="group" aria-labelledby="field-family">
                      {[0, 1, 2].map((n) => (
                        <button
                          key={n}
                          type="button"
                          className={`count-chip ${extra === n ? "selected" : ""}`}
                          aria-pressed={extra === n}
                          onClick={() => setExtra(n)}
                        >
                          {n === 0 ? t.coApplicantNone : fill(t.coApplicantCount, n)}
                        </button>
                      ))}
                    </div>
                  </section>
                  <div className="submit-block">
                    <p className="submit-assurance">
                      <span className="material-symbols-outlined" aria-hidden="true">receipt_long</span>
                      <span>{t.submitAssurance}</span>
                    </p>
                    <button className="primary-button" type="submit" disabled={!canSubmit}>
                      <span>{t.submitDemand}</span>
                      <Icon name="arrow" />
                    </button>
                    <div className="trust-chip-row">
                      <span><span className="material-symbols-outlined" aria-hidden="true">money_off</span>{t.trustChipFree}</span>
                      <span><span className="material-symbols-outlined" aria-hidden="true">dataset</span>{t.trustChipRecorded}</span>
                      <span><span className="material-symbols-outlined" aria-hidden="true">receipt</span>{t.trustChipReceipt}</span>
                    </div>
                  </div>
                </form>

                <div className="transparency-strip">
                  <div className="rate-figure">
                    <strong>{inr(rate)}</strong>
                    <span>{t.perWorkDay}</span>
                  </div>
                  <p>
                    <span className="material-symbols-outlined" aria-hidden="true">account_balance</span>
                    <span>{t.paymentWindowNote}</span>
                  </p>
                </div>
              </>
            )}
          </div>

          <aside className="demand-rail">
            <section className="rail-card">
              <h3>
                <span className="material-symbols-outlined" aria-hidden="true">schedule</span>
                {t.timelineTitle}
              </h3>
              <ol className="rail-timeline">
                <li>
                  <span className="rail-day">{fill(t.withinDays, ACK_DAYS)}</span>
                  <strong>{t.timelineStep1}</strong>
                  <small>{t.timelineStep1Sub}</small>
                </li>
                <li>
                  <span className="rail-day">{fill(t.withinDays, WORKSITE_DAYS)}</span>
                  <strong>{t.timelineStep2}</strong>
                  <small>{t.timelineStep2Sub}</small>
                </li>
                <li className="rail-statutory">
                  <span className="rail-day">{fill(t.withinDays, STATUTORY_DAYS)}</span>
                  <strong>{t.timelineStep3}</strong>
                  <small>{t.timelineStep3Sub}</small>
                </li>
              </ol>
            </section>
            <section className="rail-card">
              <h3>
                <span className="material-symbols-outlined" aria-hidden="true">support_agent</span>
                {t.contactsTitle}
              </h3>
              <ul className="contact-list">
                <li>
                  <strong>{t.grsRole}</strong>
                  <small>{t.grsSub}</small>
                </li>
                <li>
                  <strong>{t.bdoRole}</strong>
                  <small>{t.bdoSub}</small>
                </li>
                <li>
                  <strong>{t.tollFree}</strong>
                  <a className="mono contact-tel" href={`tel:${TOLL_FREE.replace(/-/g, "")}`}>{TOLL_FREE}</a>
                </li>
              </ul>
            </section>

            <div className="rail-note">
              <span className="material-symbols-outlined" aria-hidden="true">description</span>
              <div>
                <strong>{t.blankFormTitle}</strong>
                <small>{t.blankFormSub}</small>
              </div>
            </div>

            <p className="tower-note">
              <span className="material-symbols-outlined" aria-hidden="true">campaign</span>
              <span>{t.gramSabhaNote}</span>
            </p>
          </aside>
        </div>
        {ack && (
          <div className="ack-overlay" role="dialog" aria-modal="true" aria-labelledby="ack-title">
            <div className="ack-panel">
              <span className="ack-seal material-symbols-outlined" aria-hidden="true">task_alt</span>
              <h2 id="ack-title">{t.demandSent}</h2>
              <p className="ack-lead">{t.demandSentBody}</p>
              <div className="ack-id">
                <span>{t.ackSlipLabel}</span>
                <strong className="mono">{ack.id}</strong>
              </div>
              <dl className="ack-rows">
                <div><dt>{t.applicantLabel}</dt><dd>{ack.applicant}</dd></div>
                <div><dt>{t.daysAppliedLabel}</dt><dd>{ack.days} {t.days}</dd></div>
                <div><dt>{t.applicationDateLabel}</dt><dd>{ack.applied}</dd></div>
                <div className="ack-deadline"><dt>{t.workByDateLabel}</dt><dd>{ack.deadline}</dd></div>
              </dl>
              <p className="ack-sms">
                <span className="material-symbols-outlined" aria-hidden="true">sms</span>
                <span>{fill(t.ackSmsNote, maskedPhone)}</span>
              </p>
              <div className="ack-actions">
                <button className="button quiet-button" type="button" onClick={() => window.print()}>
                  <span className="material-symbols-outlined" aria-hidden="true">print</span>
                  <span>{t.printReceipt}</span>
                </button>
                <button className="primary-button" type="button" autoFocus onClick={() => setAck(null)}>
                  <span>{t.ackUnderstood}</span>
                  <Icon name="check" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
