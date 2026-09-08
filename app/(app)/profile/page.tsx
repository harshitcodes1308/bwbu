"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { fill } from "@/lib/copy";
import { LANGS } from "@/lib/languages";
import { profiles } from "@/lib/profiles";
import { Avatar } from "@/components/Avatar";
import { Icon } from "@/components/icons";
import { webSpeak } from "@/lib/speech";

const GUARANTEE_DAYS = 100;
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// Accent per persona situation. Same colour means the same thing here as on the
// wage screen: green paid, amber under review, red stuck, plain not started.
const TONE: Record<string, "good" | "warn" | "danger" | "neutral"> = {
  paid: "good",
  grievance: "warn",
  delayed: "danger",
  new: "neutral",
};

// Days a worker has actually been paid for vs still owed, out of the statutory 100.
function splitQuota(days: number, wagePaid: number) {
  const paid = wagePaid > 0 ? days : 0;
  return { paid, pending: days - paid, remaining: Math.max(0, GUARANTEE_DAYS - days) };
}

export default function ProfilePage() {
  const { t, language, setLanguage, profile, profileIndex, setProfileIndex, textLarge, setTextLarge, highContrast, setHighContrast, logout } = useApp();
  const router = useRouter();
  const [toast, setToast] = useState<{ title: string; body: string } | null>(null);
  const [voiceOn, setVoiceOn] = useState(true);
  const [lowData, setLowData] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(id);
  }, [toast]);

  const q = splitQuota(profile.days, profile.wagePaid);
  const pct = Math.round((profile.days / GUARANTEE_DAYS) * 100);
  const tone = TONE[profile.tone] ?? "neutral";

  function switchTo(idx: number) {
    if (idx === profileIndex) return;
    setProfileIndex(idx);
    setToast({ title: t.profileSwitched, body: t.profileSwitchedSub });
    // Deferred a frame on purpose: React commits the new persona right after this
    // handler returns, and that layout change cancels a smooth scroll started in
    // the same tick. Scrolling once the commit has landed actually moves the page.
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  function playSample() {
    if (playing) return;
    setPlaying(true);
    webSpeak(`${profile.name[language]}. ${profile.status[language]}. ${profile.detail[language]}`, language);
    setTimeout(() => setPlaying(false), 3000);
  }

  return (
    <div className="app-page">
      <div className="page-width">
        {toast && (
          <div className="switch-toast" role="status">
            <span className="switch-toast-icon material-symbols-outlined" aria-hidden="true">task_alt</span>
            <div>
              <strong>{toast.title}</strong>
              <small>{toast.body}</small>
            </div>
          </div>
        )}

        <div className="switcher-head">
          <button className="back-button" type="button" onClick={() => router.push("/home")} aria-label={t.back}>
            <Icon name="back" />
          </button>
          <div className="switcher-head-text">
            <div className="switcher-badges">
              <span className="demo-mode-badge">{t.demoModeBadge}</span>
              <span className="live-sim">
                <span className="live-sim-dot" aria-hidden="true" />
                {t.liveSimulator}
              </span>
            </div>
            <h1 data-page-title tabIndex={-1}>{t.switcherHeading}</h1>
            <p>{t.switcherLead}</p>
          </div>
          <div className="switcher-head-actions">
            <button className="button quiet-button" type="button" onClick={() => window.print()}>
              <span className="material-symbols-outlined" aria-hidden="true">print</span>
              <span>{t.printCard}</span>
            </button>
            <button className="button quiet-button" type="button" onClick={() => switchTo(0)}>
              <span className="material-symbols-outlined" aria-hidden="true">restart_alt</span>
              <span>{t.resetProfile}</span>
            </button>
          </div>
        </div>

        <div className="demo-env-note">
          <span className="material-symbols-outlined" aria-hidden="true">info</span>
          <p>
            <strong>{t.demoEnvTitle}</strong> {t.demoEnvBody}
          </p>
          <span className="act-pill">{t.mgnregaAct}</span>
        </div>

        <section className="active-session">
          <div className="section-head">
            <h2>
              {t.activeSessionTitle}
              <span className="active-card-pill">{t.activeCardPill}</span>
            </h2>
            <span className="biometric-note">{t.lastBiometric}</span>
          </div>

          <div className="active-session-card">
            <div className="active-identity">
              <div className="active-avatar">
                <Avatar profileId={profile.id} size={104} alt={profile.name[language]} />
                <span className="verified-seal material-symbols-outlined" title={t.verified} aria-hidden="true">verified</span>
              </div>
              <div className="active-identity-text">
                <div className="active-name-row">
                  <h3>{profile.name[language]}</h3>
                  <span className="holder-pill">{t.activeCardHolder}</span>
                </div>
                <ul className="identity-meta">
                  <li>
                    <span className="material-symbols-outlined" aria-hidden="true">badge</span>
                    <span className="mono">{profile.jobCard}</span>
                  </li>
                  <li>
                    <span className="material-symbols-outlined" aria-hidden="true">location_on</span>
                    <span>{profile.village[language]}</span>
                  </li>
                  <li>
                    <span className="material-symbols-outlined" aria-hidden="true">account_balance</span>
                    <span>{t.dbtAadhaarLinked}</span>
                  </li>
                </ul>
                <p className={`situation-alert ${tone}`}>
                  <span className="material-symbols-outlined" aria-hidden="true">
                    {tone === "good" ? "check_circle" : tone === "neutral" ? "hourglass_empty" : "pending_actions"}
                  </span>
                  <span>{profile.status[language]}</span>
                </p>
                <p className="situation-detail">{profile.detail[language]}</p>
              </div>
            </div>

            <div className="quota-panel">
              <div className="quota-panel-head">
                <span>{t.annualQuotaLabel}</span>
                <span className="fy-pill">{t.fiscalYear}</span>
              </div>
              <div className="quota-figure">
                <strong>{profile.days}</strong>
                <span>{t.ofHundredDays}</span>
                <span className="quota-pct">{pct}%</span>
              </div>
              <div className="gauge-track">
                <div className="gauge-segment green" style={{ width: `${q.paid}%` }} />
                <div className="gauge-segment amber" style={{ width: `${q.pending}%` }} />
                <div className="gauge-segment remaining" />
              </div>
              <div className="gauge-legend">
                <span><i className="legend-dot green" />{fill(t.legendPaid, q.paid)}</span>
                <span><i className="legend-dot amber" />{fill(t.legendPending, q.pending)}</span>
                <span><i className="legend-dot gray" />{fill(t.legendRemaining, q.remaining)}</span>
              </div>
              <button className="quota-link" type="button" onClick={() => router.push("/wage-status")}>
                <span className="material-symbols-outlined" aria-hidden="true">receipt_long</span>
                <span>{t.epassbookCta}</span>
                <Icon name="arrow" />
              </button>
            </div>
          </div>
        </section>

        <section className="persona-section">
          <div className="section-head">
            <div>
              <h2>{t.personaGridTitle}</h2>
              <p>{t.personaGridLead}</p>
            </div>
            <span className="one-tap-note">
              <span className="material-symbols-outlined" aria-hidden="true">touch_app</span>
              {t.oneClickSwitch}
            </span>
          </div>

          <div className="persona-grid">
            {profiles.map((p, idx) => {
              const pq = splitQuota(p.days, p.wagePaid);
              const pTone = TONE[p.tone] ?? "neutral";
              const active = idx === profileIndex;
              return (
                <article key={p.id} className={`persona-card ${active ? "active" : ""}`}>
                  <div className="persona-head">
                    <Avatar profileId={p.id} size={72} alt={p.name[language]} />
                    <div className="persona-head-text">
                      {active && <span className="persona-active-tag">{t.currentlyActive}</span>}
                      <h3>{p.name[language]}</h3>
                      <span className="mono persona-card-no">{p.jobCard}</span>
                    </div>
                  </div>

                  <p className="persona-village">
                    <span className="material-symbols-outlined" aria-hidden="true">pin_drop</span>
                    <span>{p.village[language]}</span>
                  </p>

                  <div className={`persona-situation ${pTone}`}>
                    <strong>{p.status[language]}</strong>
                    <span>{p.detail[language]}</span>
                  </div>

                  <div className="persona-meter">
                    <div className="persona-meter-head">
                      <span>{t.totalDaysUsed}</span>
                      <strong>{p.days} / {GUARANTEE_DAYS}</strong>
                    </div>
                    <div className="progress-track">
                      <div className={`progress-fill ${pTone}`} style={{ width: `${p.days}%` }} />
                    </div>
                    <small>{fill(t.daysLeftThisYear, pq.remaining)}</small>
                  </div>

                  <button
                    className="button persona-switch"
                    type="button"
                    onClick={() => switchTo(idx)}
                    disabled={active}
                  >
                    <span className="material-symbols-outlined" aria-hidden="true">switch_account</span>
                    <span>{active ? t.currentlyActive : t.switchToThis}</span>
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <section className="prefs-panel">
          <div className="section-head">
            <div>
              <h2>
                <span className="material-symbols-outlined" aria-hidden="true">tune</span>
                {t.prefsTitle}
              </h2>
              <p>{t.prefsLead}</p>
            </div>
            <span className="autosave-pill">{t.prefsAutosave}</span>
          </div>

          <div className="prefs-grid">
            <div className="pref-card">
              <h3>
                <span className="material-symbols-outlined" aria-hidden="true">translate</span>
                {t.langPrefTitle}
              </h3>
              <p>{t.langPrefLead}</p>
              <div className="lang-chip-grid">
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    className={`lang-chip ${language === l.code ? "selected" : ""}`}
                    onClick={() => setLanguage(l.code)}
                    aria-pressed={language === l.code}
                  >
                    {language === l.code && (
                      <span className="material-symbols-outlined" aria-hidden="true">check_circle</span>
                    )}
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pref-card">
              <h3>
                <span className="material-symbols-outlined green" aria-hidden="true">record_voice_over</span>
                {t.voicePrefTitle}
              </h3>
              <p>{t.voicePrefLead}</p>
              <label className="pref-toggle-row">
                <span>
                  <strong>{voiceOn ? t.voiceOnLabel : t.voiceOffLabel}</strong>
                  <small>{t.voiceDialectSub}</small>
                </span>
                <input type="checkbox" checked={voiceOn} onChange={(e) => setVoiceOn(e.target.checked)} />
                <span className="pref-switch" aria-hidden="true" />
              </label>
              <button className="button sample-button" type="button" onClick={playSample} disabled={!voiceOn}>
                <span className="material-symbols-outlined" aria-hidden="true">{playing ? "graphic_eq" : "volume_up"}</span>
                <span>{playing ? t.audioPlaying : t.audioSampleCta}</span>
              </button>
            </div>

            <div className="pref-card">
              <h3>
                <span className="material-symbols-outlined amber" aria-hidden="true">network_check</span>
                {t.lowDataTitle}
              </h3>
              <p>{t.lowDataLead}</p>
              <label className="pref-toggle-row">
                <span>
                  <strong>{lowData ? t.lowDataOnLabel : t.lowDataOffLabel}</strong>
                  <small>{t.lowDataSub}</small>
                </span>
                <input type="checkbox" checked={lowData} onChange={(e) => setLowData(e.target.checked)} />
                <span className="pref-switch" aria-hidden="true" />
              </label>
              <p className="tower-note">
                <span className="material-symbols-outlined" aria-hidden="true">signal_cellular_alt_2_bar</span>
                <span>{t.towerInfo}</span>
              </p>
            </div>

            <div className="pref-card">
              <h3>
                <span className="material-symbols-outlined amber" aria-hidden="true">accessibility_new</span>
                {t.a11yTitle}
              </h3>
              <p>{t.a11ySub}</p>
              <label className="pref-toggle-row">
                <span><strong>{t.largeText}</strong></span>
                <input type="checkbox" checked={textLarge} onChange={(e) => setTextLarge(e.target.checked)} />
                <span className="pref-switch" aria-hidden="true" />
              </label>
              <label className="pref-toggle-row">
                <span><strong>{t.highContrast}</strong></span>
                <input type="checkbox" checked={highContrast} onChange={(e) => setHighContrast(e.target.checked)} />
                <span className="pref-switch" aria-hidden="true" />
              </label>
            </div>
          </div>
        </section>

        <div className="help-banner">
          <span className="help-banner-icon material-symbols-outlined" aria-hidden="true">support_agent</span>
          <div>
            <h4>{t.helpTitle}</h4>
            <p>{t.helpBody}</p>
          </div>
          <button className="button help-cta" type="button" onClick={() => router.push("/grievance")}>
            <span className="material-symbols-outlined" aria-hidden="true">contact_phone</span>
            <span>{t.helpCta}</span>
          </button>
        </div>

        <div className="settings-list">
          <div>
            <span>{t.dataLabel}</span>
            <strong>{t.syntheticDemo}</strong>
          </div>
          <div>
            <span>{t.versionLabel}</span>
            <strong>{t.hackathonBuild}</strong>
          </div>
          <div>
            <span>{t.due}</span>
            <strong>{profile.wage > 0 ? inr(profile.wage) : t.notStarted}</strong>
          </div>
        </div>

        <button className="signout-button" type="button" onClick={() => { logout(); router.replace("/login"); }}>
          <span className="material-symbols-outlined" aria-hidden="true">logout</span>
          <span>{t.signOut}</span>
        </button>
      </div>
    </div>
  );
}
