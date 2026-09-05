"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { fill } from "@/lib/copy";
import { LANGS, LOCALE_TAG } from "@/lib/languages";
import { BCP47, speak, stopSpeaking } from "@/lib/speech";
import { Avatar } from "@/components/Avatar";
import { Icon } from "@/components/icons";

const GUARANTEE_DAYS = 100;
const NOTIFIED_RATE = 237;
const DBT_WINDOW_DAYS = 3; // remaining working days in the 15-day payment window
const MUSTER_ROLL_DAYS = 14; // a muster roll covers a fortnight of attendance
const COMPENSATION_RATE = 0.0005; // §3(3): 0.05% of the wage per day of delay
const TOLL_FREE = "1800-345-6789";
const WAVE_USER = [2, 4, 5, 3, 4, 2, 4, 5, 3, 2, 4, 3];
const WAVE_BOT = [3, 5, 6, 4, 6, 5, 3, 6, 4, 5, 2];
const SPEEDS = [1, 0.75, 1.5];
const SPEED_LABELS = ["1.0x", "0.75x", "1.5x"];
const ROUTE: Record<string, string> = { open_grievance: "/grievance", show_status: "/grievance-status", explain_wage: "/wage-status" };

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
// A spoken clip runs roughly three words a second; enough to label the bubble
// honestly without pretending we measured a real recording.
const spokenSeconds = (s: string) => Math.max(3, Math.round(s.trim().split(/\s+/).length / 3));

type Turn = {
  id: number;
  role: "user" | "bot";
  text: string;
  /** Extra paragraph — only the grounded opening answer has two. */
  text2?: string;
  /** The opening answer is the only turn backed by the worker's own record. */
  grounded?: boolean;
  /** Route the assistant suggested, if any. */
  route?: string;
  routeLabel?: string;
};

export default function VoiceHelpPage() {
  const { t, language, setLanguage, profile } = useApp();
  const router = useRouter();
  const isPaid = profile.tone === "paid";
  const isNew = profile.tone === "new";

  // Resolved after mount: the thread stamps itself against the real clock, and
  // the server render must not disagree with the first client render.
  const [today, setToday] = useState<Date | null>(null);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [heard, setHeard] = useState("");
  const [micOk, setMicOk] = useState(true);
  const [speakingId, setSpeakingId] = useState<number | null>(null);
  const [speed, setSpeed] = useState(0);
  const [shared, setShared] = useState(false);
  const [smsSet, setSmsSet] = useState<boolean | null>(null);
  const recRef = useRef<any>(null);
  const keepListeningRef = useRef(false);
  const finalRef = useRef("");
  const nextId = useRef(2);
  const threadEnd = useRef<HTMLDivElement | null>(null);

  const used = profile.days;
  const remaining = Math.max(0, GUARANTEE_DAYS - used);
  const paidDays = profile.wagePaid > 0 ? used : 0;
  const pendingDays = used - paidDays;
  // Derived exactly as the wage and demand screens derive it, so no two screens
  // can quote the worker a different daily rate.
  const rate = used > 0 ? Math.round(profile.wage / used) : NOTIFIED_RATE;
  const maskedPhone = `+91 ••••••${profile.phone.slice(-4)}`;
  const compensation = (profile.wage * COMPENSATION_RATE).toFixed(2);

  // Dates read "—" until the clock resolves after mount, so the server render and
  // the first client render agree instead of hydrating a different day.
  const fmt = (d: Date | null) =>
    d ? d.toLocaleDateString(LOCALE_TAG[language] ?? "hi-IN", { day: "numeric", month: "long", year: "numeric" }) : "—";
  const fmtShortDate = (d: Date) =>
    d.toLocaleDateString(LOCALE_TAG[language] ?? "hi-IN", { day: "numeric", month: "short" });
  const fmtShort = (isoDate: string) => (isoDate ? fmtShortDate(new Date(`${isoDate}T00:00:00`)) : "—");
  // The muster roll is a fortnight ending on the day it closed.
  const musterPeriod = profile.musterRollClosed
    ? `${fmtShortDate(addDays(new Date(`${profile.musterRollClosed}T00:00:00`), -(MUSTER_ROLL_DAYS - 1)))} – ${fmtShort(profile.musterRollClosed)}`
    : "—";

  useEffect(() => {
    setToday(new Date());
    const SR = typeof window !== "undefined" && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
    setMicOk(!!SR);
    return () => {
      keepListeningRef.current = false;
      try { recRef.current?.stop(); } catch { /* noop */ }
      stopSpeaking();
    };
  }, []);

  // The opening exchange is rebuilt whenever the persona or language changes, and
  // every figure in it comes from the worker's own record — never from the model.
  const seed = useMemo<Turn[]>(() => {
    const wageText = profile.wage.toLocaleString("en-IN");
    const phrase = fill(t.voiceDaysWagePhrase, used);
    const question = isNew
      ? t.voiceAskWhenWork
      : fill(isPaid ? t.voiceAskDidItArrive : t.voiceAskWhenPaid, wageText);
    const answer: Pick<Turn, "text" | "text2"> = isNew
      ? { text: t.voiceAnsNewP1, text2: t.voiceAnsNewP2 }
      : isPaid
        ? { text: fill(t.voiceAnsPaidP1, `${phrase} (${inr(profile.wagePaid)})`), text2: fill(t.voiceAnsPaidP2, fmtShort(profile.musterRollClosed)) }
        : { text: fill(t.voiceAnsStuckP1, `${phrase} (${inr(profile.wage)})`), text2: fill(t.voiceAnsStuckP2, fmt(today ? addDays(today, DBT_WINDOW_DAYS) : null)) };
    return [
      { id: 0, role: "user", text: question },
      { id: 1, role: "bot", grounded: true, ...answer },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.id, language, today, t]);

  useEffect(() => {
    setTurns(seed);
    setSmsSet(null);
    nextId.current = 2;
  }, [seed]);

  useEffect(() => {
    if (turns.length > 2) threadEnd.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [turns.length, thinking]);

  function readAloud(turn: Turn) {
    const text = [turn.text, turn.text2].filter(Boolean).join(" ");
    if (speakingId === turn.id) { stopSpeaking(); setSpeakingId(null); return; }
    const rate = SPEEDS[speed];
    setSpeakingId(turn.id);
    speak(text, language, rate);
    // Neither the audio element nor Web Speech gives a reliable end event across
    // browsers, so the button reverts on a timer sized to the clip and its speed.
    setTimeout(() => setSpeakingId((id) => (id === turn.id ? null : id)), (spokenSeconds(text) / rate) * 1000);
  }

  // Share sheet where the device has one, clipboard where it does not, print as
  // the last resort — a worker showing this answer at the panchayat needs paper.
  async function share(turn: Turn) {
    const text = [turn.text, turn.text2].filter(Boolean).join("\n\n");
    try {
      if (navigator.share) { await navigator.share({ title: t.voiceHelpTitle, text }); return; }
      await navigator.clipboard.writeText(text);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      window.print();
    }
  }

  const routeLabel = (action: string) =>
    action === "open_grievance" ? t.createComplaint : action === "show_status" ? t.grievanceTrack : t.wageDetails;

  async function ask(question: string) {
    const q = question.trim();
    if (!q || thinking) return;
    const userId = nextId.current++;
    const botId = nextId.current++;
    setHeard("");
    setTurns((prev) => [...prev, { id: userId, role: "user", text: q }]);
    setThinking(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale: language,
          transcript: q,
          context: { status: profile.id, workName: profile.workName[language], daysWorked: used, daysRemaining: remaining, wageDue: profile.wage, wagePaid: profile.wagePaid, dailyRate: rate, reason: profile.reason },
        }),
      });
      const data = await res.json();
      const reply: string = data.reply || t.voiceAnswerFailed;
      const route = ROUTE[data.action as string];
      setTurns((prev) => [...prev, { id: botId, role: "bot", text: reply, route, routeLabel: route ? routeLabel(data.action) : undefined }]);
      setSpeakingId(botId);
      speak(reply, language, SPEEDS[speed]);
      setTimeout(() => setSpeakingId((id) => (id === botId ? null : id)), (spokenSeconds(reply) / SPEEDS[speed]) * 1000);
    } catch {
      setTurns((prev) => [...prev, { id: botId, role: "bot", text: t.voiceAnswerFailed }]);
    } finally {
      setThinking(false);
    }
  }

  // Continuous recognition: keeps the session open across natural pauses and only
  // sends when the worker presses stop, so a slow speaker is never cut off.
  function startListen() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setMicOk(false); return; }
    stopSpeaking();
    setSpeakingId(null);
    finalRef.current = "";
    setHeard("");
    keepListeningRef.current = true;
    setListening(true);

    const rec = new SR();
    recRef.current = rec;
    rec.lang = BCP47[language] ?? "hi-IN";
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e: any) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const chunk = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalRef.current += `${chunk} `;
        else interim += chunk;
      }
      setHeard((finalRef.current + interim).trim());
    };
    rec.onerror = () => { /* keep the session; onend restarts it if still listening */ };
    rec.onend = () => {
      if (keepListeningRef.current) {
        try { rec.start(); } catch { /* already starting */ }
      } else {
        setListening(false);
      }
    };
    try { rec.start(); } catch { /* already started */ }
  }

  function stopAndSend() {
    keepListeningRef.current = false;
    try { recRef.current?.stop(); } catch { /* noop */ }
    setListening(false);
    const text = (finalRef.current || heard).trim();
    if (text) ask(text);
  }

  const faqs: [string, string, string, string, string][] = [
    ["attendance", "calendar_today", t.faqAttendanceKicker, t.faqAttendanceQ, t.faqAttendanceSub],
    ["demand", "handshake", t.faqDemandKicker, t.faqDemandQ, t.faqDemandSub],
    ["grievance", "report_problem", t.faqGrievanceKicker, t.faqGrievanceQ, t.faqGrievanceSub],
    ["quota", "fact_check", t.faqQuotaKicker, t.faqQuotaQ, t.faqQuotaSub],
  ];

  const micHint = listening ? t.micListeningHint : thinking ? t.micAnalysing : t.micIdleHint;

  return (
    <div className="app-page voice-page">
      <div className="page-width">
        <div className="voice-head">
          <button className="back-button" type="button" onClick={() => router.push("/home")} aria-label={t.back}>
            <Icon name="back" />
          </button>
          <div className="voice-head-text">
            <span className="voice-live-badge">
              <span className="voice-live-dot" aria-hidden="true" />
              {t.voiceAvailabilityBadge}
            </span>
            <h1 data-page-title tabIndex={-1}>{t.voiceHelpTitle}</h1>
            <p>{t.voiceHelpLead}</p>
          </div>
          <div className="dialect-strip" role="group" aria-label={t.dialectLabel}>
            <span className="dialect-label">
              <span className="material-symbols-outlined" aria-hidden="true">translate</span>
              {t.dialectLabel}
            </span>
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                className={`dialect-chip ${language === l.code ? "selected" : ""}`}
                aria-pressed={language === l.code}
                onClick={() => setLanguage(l.code)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="voice-identity">
          <Avatar profileId={profile.id} size={56} alt={profile.name[language]} />
          <div className="voice-identity-text">
            <strong>{profile.name[language]}</strong>
            <span className="mono">{profile.jobCard}</span>
            <span className="voice-identity-verified">
              <span className="material-symbols-outlined" aria-hidden="true">task_alt</span>
              {t.voiceVerifiedIdentity}
            </span>
          </div>
          <span className="act-pill">{t.mgnregaAct}</span>
        </div>

        <div className="voice-layout">
          <div className="voice-thread">
            <div className="thread-break">
              <span>{t.todaysConversation}{today ? ` • ${fmt(today)}` : ""}</span>
            </div>

            {turns.map((turn) =>
              turn.role === "user" ? (
                <article className="voice-turn user" key={turn.id}>
                  <div className="turn-meta">
                    <span>{profile.name[language]} ({t.voiceMessageLabel})</span>
                  </div>
                  <div className="turn-bubble">
                    <div className="turn-bubble-top">
                      <button
                        type="button"
                        className="turn-play small"
                        onClick={() => readAloud(turn)}
                        aria-label={t.playAudioAria}
                        aria-pressed={speakingId === turn.id}
                      >
                        <span className="material-symbols-outlined" aria-hidden="true">
                          {speakingId === turn.id ? "pause" : "play_arrow"}
                        </span>
                      </button>
                      <div className="turn-said">
                        <p>“{turn.text}”</p>
                        <div className="turn-said-meta">
                          <span>
                            <span className="material-symbols-outlined" aria-hidden="true">graphic_eq</span>
                            {fill(t.audioSeconds, spokenSeconds(turn.text))}
                          </span>
                          <span>•</span>
                          <span>{t.autoTranscribed}</span>
                        </div>
                      </div>
                    </div>
                    <div className="waveform" aria-hidden="true">
                      {WAVE_USER.map((h, i) => (
                        <i key={i} style={{ height: h * 4 }} />
                      ))}
                      <small>{t.clearVoicePct}</small>
                    </div>
                  </div>
                </article>
              ) : (
                <article className="voice-turn bot" key={turn.id}>
                  <div className="turn-meta">
                    <span className="turn-dot" aria-hidden="true" />
                    <strong>{t.assistantVoiceName}</strong>
                    {turn.grounded && (
                      <>
                        <span>•</span>
                        <span>{t.verifiedFromRecords}</span>
                      </>
                    )}
                  </div>
                  <div className="turn-bubble">
                    <div className="audio-bar">
                      <button
                        type="button"
                        className={`turn-play ${speakingId === turn.id ? "on" : ""}`}
                        onClick={() => readAloud(turn)}
                        aria-label={t.playAudioAria}
                        aria-pressed={speakingId === turn.id}
                      >
                        <span className="material-symbols-outlined" aria-hidden="true">
                          {speakingId === turn.id ? "pause" : "play_arrow"}
                        </span>
                      </button>
                      <div className="audio-bar-text">
                        <strong>
                          {t.listenAloudTitle}
                          <span className="audio-lang-pill">{LANGS.find((l) => l.code === language)?.label}</span>
                        </strong>
                        <small>{fill(t.audioSeconds, spokenSeconds([turn.text, turn.text2].filter(Boolean).join(" ")))}</small>
                      </div>
                      <div className={`waveform live ${speakingId === turn.id ? "on" : ""}`} aria-hidden="true">
                        {WAVE_BOT.map((h, i) => (
                          <i key={i} style={{ height: h * 4, animationDelay: `${i * 90}ms` }} />
                        ))}
                      </div>
                      <button
                        type="button"
                        className="speed-chip"
                        onClick={() => setSpeed((s) => (s + 1) % SPEEDS.length)}
                        aria-label={`${t.speedLabel}: ${SPEED_LABELS[speed]}`}
                      >
                        {SPEED_LABELS[speed]}
                      </button>
                    </div>

                    <div className="turn-prose">
                      <p>{turn.text}</p>
                      {turn.text2 && <p>{turn.text2}</p>}
                    </div>

                    {turn.grounded && !isNew && (
                      <>
                        <div className="fact-chips">
                          <div className="fact-chip green">
                            <span>
                              <span className="material-symbols-outlined" aria-hidden="true">event_available</span>
                              {isPaid ? t.musterRollClosedLabel : t.expectedDateLabel}
                            </span>
                            <strong>{isPaid ? fmtShort(profile.musterRollClosed) : fmt(today ? addDays(today, DBT_WINDOW_DAYS) : null)}</strong>
                            <small>{isPaid ? t.fullyPaidLabel : fill(t.workingDaysLeft, DBT_WINDOW_DAYS)}</small>
                          </div>
                          <div className="fact-chip">
                            <span>
                              <span className="material-symbols-outlined" aria-hidden="true">account_balance</span>
                              {t.accountDetailsLabel}
                            </span>
                            <strong>{profile.bank[language]}</strong>
                            <small className="mono">{profile.accountMasked} • {t.dbtLinkActive}</small>
                          </div>
                          <div className="fact-chip amber">
                            <span>
                              <span className="material-symbols-outlined" aria-hidden="true">gavel</span>
                              {t.legalRightLabel}
                            </span>
                            <strong>{fill(t.compensationPerDay, compensation)}</strong>
                            <small>{t.compensationAutoNote}</small>
                          </div>
                        </div>

                        <div className="fto-strip">
                          <span>
                            <span className="material-symbols-outlined" aria-hidden="true">verified</span>
                            {t.ftoNumberLabel}: <strong className="mono">{profile.jobCard.slice(0, 2)}-2026-FTO-{profile.jobCard.slice(-3)}</strong>
                          </span>
                          <span className="fto-actions">
                            <button type="button" onClick={() => router.push("/wage-status")}>
                              <span className="material-symbols-outlined" aria-hidden="true">receipt_long</span>
                              {t.viewReceipt}
                            </button>
                            <button type="button" onClick={() => share(turn)}>
                              <span className="material-symbols-outlined" aria-hidden="true">{shared ? "check" : "share"}</span>
                              {t.shareAnswer}
                            </button>
                          </span>
                        </div>

                        <div className="followup-row">
                          {smsSet === null ? (
                            <>
                              <p>{t.smsAlertQuestion}</p>
                              <span className="followup-actions">
                                <button type="button" className="followup-yes" onClick={() => setSmsSet(true)}>
                                  <span className="material-symbols-outlined" aria-hidden="true">notifications_active</span>
                                  {t.smsAlertYes}
                                </button>
                                <button type="button" className="followup-no" onClick={() => setSmsSet(false)}>
                                  {t.smsAlertNo}
                                </button>
                              </span>
                            </>
                          ) : (
                            <p className="followup-done">
                              <span className="material-symbols-outlined" aria-hidden="true">{smsSet ? "sms" : "notifications_off"}</span>
                              {smsSet ? fill(t.smsAlertDone, maskedPhone) : t.smsAlertNo}
                            </p>
                          )}
                        </div>
                      </>
                    )}

                    {turn.route && (
                      <button className="turn-action" type="button" onClick={() => router.push(turn.route!)}>
                        <span>{turn.routeLabel}</span>
                        <Icon name="arrow" />
                      </button>
                    )}
                  </div>
                </article>
              )
            )}

            {thinking && (
              <article className="voice-turn bot" aria-live="polite">
                <div className="turn-bubble thinking-bubble">
                  <span className="thinking-dots" aria-hidden="true"><i /><i /><i /></span>
                  {t.assistantThinking}
                </div>
              </article>
            )}
            <div ref={threadEnd} />
          </div>

          <aside className="voice-rail">
            <section className="rail-card">
              <div className="rail-card-head">
                <h3>{t.guarantee100Days}</h3>
                <span className="fy-pill">{t.fiscalYear}</span>
              </div>
              <div className="quota-figure">
                <strong>{used}</strong>
                <span>{t.ofHundredDays}</span>
              </div>
              <div className="gauge-track">
                <div className="gauge-segment green" style={{ width: `${paidDays}%` }} />
                <div className="gauge-segment amber" style={{ width: `${pendingDays}%` }} />
                <div className="gauge-segment remaining" />
              </div>
              <div className="gauge-legend">
                <span><i className="legend-dot green" />{fill(t.legendPaid, paidDays)}</span>
                <span><i className="legend-dot amber" />{fill(t.legendPending, pendingDays)}</span>
                <span><i className="legend-dot gray" />{fill(t.legendRemaining, remaining)}</span>
              </div>
            </section>

            <section className="rail-card">
              <div className="rail-card-head">
                <h3>{t.worksiteContextTitle}</h3>
                <span className="nmms-pill">
                  <span className="material-symbols-outlined" aria-hidden="true">pin_drop</span>
                  {t.nmmsVerified}
                </span>
              </div>
              <div className="worksite-plate">
                <span className="material-symbols-outlined worksite-mark" aria-hidden="true">landscape</span>
                <div>
                  <strong>{profile.workName[language]}</strong>
                  <small>{t.workCodeLabel}: <span className="mono">3108002/WC/{profile.jobCard.slice(-3)}</span> • {profile.village[language]}</small>
                </div>
              </div>
              <div className="worksite-foot">
                <span>{t.attendancePeriodLabel}: <strong>{musterPeriod}</strong></span>
                <span>{t.notifiedRateLabel}: <strong>{inr(rate)} {t.perDaySuffix}</strong></span>
              </div>
            </section>

            <section className="rail-card">
              <div className="sevak-head">
                <span className="sevak-mark material-symbols-outlined" aria-hidden="true">support_agent</span>
                <div>
                  <h3>{t.rozgarSevakTitle}</h3>
                  <p>{t.grsSub}</p>
                  <small>{t.panchayatHours}</small>
                </div>
              </div>
              <a className="sevak-call" href={`tel:${TOLL_FREE.replace(/-/g, "")}`}>
                <span className="material-symbols-outlined" aria-hidden="true">call</span>
                <span>{t.callSevakFree}</span>
                <span className="mono">{TOLL_FREE}</span>
              </a>
            </section>
          </aside>
        </div>

        <section className="mic-stage">
          <span className={`mic-status ${listening ? "on" : ""}`} role="status">
            <span className="mic-status-dot" aria-hidden="true" />
            {micOk ? micHint : t.assistantMicUnavailable}
          </span>

          <div className="mic-cradle">
            <span className={`mic-ring one ${listening ? "on" : ""}`} aria-hidden="true" />
            <span className={`mic-ring two ${listening ? "on" : ""}`} aria-hidden="true" />
            <button
              type="button"
              className={`mic-button ${listening ? "on" : ""}`}
              onClick={listening ? stopAndSend : startListen}
              disabled={!micOk || thinking}
              aria-pressed={listening}
              aria-label={listening ? t.micStop : t.pressToSpeak}
            >
              <span className="material-symbols-outlined" aria-hidden="true">{listening ? "stop_circle" : "mic"}</span>
              <span>{listening ? t.micStop : t.pressToSpeak}</span>
            </button>
          </div>

          {heard ? (
            <p className="mic-heard" aria-live="polite">“{heard}”</p>
          ) : (
            <>
              <p className="mic-headline">{t.micHeadline}</p>
              <p className="mic-subline">{t.micSubline}</p>
            </>
          )}
        </section>

        <section className="faq-section">
          <div className="section-head">
            <div>
              <h2>{t.faqSectionTitle}</h2>
              <p>{t.faqSectionLead}</p>
            </div>
            <span className="faq-count-pill">{fill(t.faqCountPill, faqs.length)}</span>
          </div>
          <div className="faq-grid">
            {faqs.map(([id, icon, kicker, question, sub]) => (
              <button key={id} type="button" className={`faq-card ${id}`} onClick={() => ask(question)} disabled={thinking}>
                <span className="faq-card-top">
                  <span className="faq-mark material-symbols-outlined" aria-hidden="true">{icon}</span>
                  <span className="faq-speak material-symbols-outlined" aria-hidden="true">volume_up</span>
                </span>
                <span className="faq-card-text">
                  <span className="faq-kicker">{kicker}</span>
                  <strong>{question}</strong>
                  <small>{sub}</small>
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
