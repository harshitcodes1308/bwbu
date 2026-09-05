"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { fill } from "@/lib/copy";
import { LANGS } from "@/lib/languages";
import { speak } from "@/lib/speech";
import { BrandHeader } from "@/components/BrandHeader";
import { Avatar } from "@/components/Avatar";

// The landing page shows a worked example, not the signed-in worker's ledger. These
// figures live here rather than in the locale files so it stays obvious that they are
// one fixed sample record — translators have no reason to touch them.
const SAMPLE = {
  daysDone: 64,
  paidDays: 52,
  paidAmount: 12480,
  processingDays: 12,
  processingAmount: 2880,
  remainingDays: 36,
  musterRoll: "74129",
  lastWage: 3510,
  cardId: "UP-28-004-001/3429",
};

const STATES = [
  { code: "UP", key: "lpStateUP" },
  { code: "BR", key: "lpStateBR" },
  { code: "MP", key: "lpStateMP" },
  { code: "RJ", key: "lpStateRJ" },
  { code: "JH", key: "lpStateJH" },
  { code: "CG", key: "lpStateCG" },
] as const;

// Indian digit grouping, western digits — matches what fill() substitutes for {n}.
const inr = (n: number) => n.toLocaleString("en-IN");

function Sym({ name, className = "" }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className}`.trim()} aria-hidden="true">{name}</span>;
}

export default function LandingPage() {
  const { t, language, profile } = useApp();
  const router = useRouter();
  const [stateCode, setStateCode] = useState("UP");
  const [cardId, setCardId] = useState(SAMPLE.cardId);
  const [showLedger, setShowLedger] = useState(false);

  const start = () => router.push("/login");
  const langLabel = LANGS.find((l) => l.code === language)?.label ?? "";

  // What the read-aloud button says: the same numbers the card shows, as a sentence.
  const ledgerSpoken = [
    t.lpLedgerName,
    fill(t.lpDaysDoneCount, SAMPLE.daysDone),
    fill(fill(t.lpLegendPaid, SAMPLE.paidDays), inr(SAMPLE.paidAmount)),
    fill(fill(t.lpLegendProcessing, SAMPLE.processingDays), inr(SAMPLE.processingAmount)),
    fill(t.lpLegendRemaining, SAMPLE.remainingDays),
  ].join(". ");

  return (
    <div className="lp-page">
      <div className="lp-header-bar">
        <BrandHeader onHome={() => router.push("/")} />
      </div>

      <main>
        <section className="lp-hero">
          <div className="lp-container lp-hero-grid">
            <div className="lp-hero-copy">
              <p className="lp-act-pill"><Sym name="workspace_premium" />{t.mgnregaAct}</p>
              <h1>{t.landingPromise}</h1>
              <p className="lp-lead">{t.lpHeroLead}</p>
              <div className="lp-hero-actions">
                <button type="button" className="primary-button lp-primary" onClick={start}>
                  {t.landingCta}<Sym name="arrow_forward" />
                </button>
                <a className="lp-ghost-link" href="#karan-section"><Sym name="info" />{t.landingWhy}</a>
              </div>
              <div className="lp-trust-row">
                <span className="lp-trust-stack" aria-hidden="true">
                  <span className="lp-trust-dot wheat">{t.lpTrustUsers}</span>
                  <span className="lp-trust-dot green">{t.lpTrustFree}</span>
                </span>
                <span className="lp-trust-caption">{t.lpTrustCaption}</span>
              </div>
            </div>

            <figure className="lp-hero-visual">
              <span className="lp-hero-sun" aria-hidden="true" />
              <img className="lp-hero-photo" src="/images/hero-worker.jpg" alt={t.landingHeroAlt} width={880} height={680} />
              <figcaption className="lp-hero-card">
                <span className="lp-hero-card-icon"><Sym name="payments" /></span>
                <span className="lp-hero-card-text">
                  <small>{t.lpLastWageCredited}</small>
                  <strong>₹{inr(SAMPLE.lastWage)}</strong>
                  <em>{t.lpTransferredToAccount}</em>
                </span>
                <span className="lp-pill green"><Sym name="verified" />{t.verified}</span>
              </figcaption>
            </figure>
          </div>
        </section>
        <section className="lp-stats">
          <div className="lp-container lp-stats-grid">
            <article className="lp-stat">
              <span className="lp-stat-ic amber"><Sym name="groups" /></span>
              <div>
                <h3>{t.lpStat1Title}</h3>
                <p>{t.statWorkers}</p>
              </div>
            </article>
            <article className="lp-stat">
              <span className="lp-stat-ic green"><Sym name="verified" /></span>
              <div>
                <h3>{t.lpStat2Title}</h3>
                <p>{t.statGuarantee}</p>
              </div>
            </article>
            <article className="lp-stat">
              <span className="lp-stat-ic red"><Sym name="account_balance" /></span>
              <div>
                <h3>{t.lpStat3Title}</h3>
                <p>{t.statDirect}</p>
              </div>
            </article>
          </div>
        </section>

        <section className="lp-quick">
          <div className="lp-container">
            <div className="lp-quick-card">
              <p className="lp-eyebrow">{t.lpQuickEyebrow}</p>
              <h2>{t.lpQuickTitle}</h2>
              <p className="lp-lead">{t.lpQuickLead}</p>

              <form className="lp-quick-form" onSubmit={(e) => { e.preventDefault(); setShowLedger(true); }}>
                <label className="lp-field lp-field-state">
                  <span className="lp-field-label">{t.lpStateLabel}</span>
                  <span className="lp-select">
                    <select value={stateCode} onChange={(e) => setStateCode(e.target.value)}>
                      {STATES.map((s) => <option key={s.code} value={s.code}>{t[s.key]}</option>)}
                    </select>
                    <Sym name="expand_more" />
                  </span>
                </label>
                <label className="lp-field lp-field-id">
                  <span className="lp-field-label">{t.lpIdLabel}</span>
                  <span className="lp-input">
                    <Sym name="badge" />
                    <input value={cardId} onChange={(e) => setCardId(e.target.value)} placeholder={t.lpIdPlaceholder} />
                  </span>
                </label>
                <button type="submit" className="primary-button lp-quick-submit">
                  {t.lpSeeButton}<Sym name="search" />
                </button>
              </form>
              {showLedger && (
                <div className="lp-ledger" role="region" aria-label={t.lpSampleBadge}>
                  <div className="lp-ledger-head">
                    <span className="lp-ledger-who">
                      <span className="lp-ledger-avatar"><Avatar profileId={profile.id} size={44} initials={profile.initials} /></span>
                      <span>
                        <strong>{t.lpLedgerName}</strong>
                        <small>{t.lpPanchayatLine}</small>
                      </span>
                    </span>
                    <span className="lp-ledger-tags">
                      <span className="lp-pill green">{t.activeCardHolder}</span>
                      <span className="lp-pill amber">{t.lpSampleBadge}</span>
                    </span>
                  </div>

                  <button type="button" className="lp-listen" onClick={() => speak(ledgerSpoken, language)}>
                    <Sym name="volume_up" />{t.listenAloudTitle} ({langLabel})
                  </button>

                  <div className="lp-quota">
                    <div className="lp-quota-top">
                      <span>{t.lpDaysOf100}</span>
                      <strong>{fill(t.lpDaysDoneCount, SAMPLE.daysDone)}</strong>
                    </div>
                    <div className="lp-quota-bar">
                      <span className="paid" style={{ width: `${SAMPLE.paidDays}%` }} />
                      <span className="processing" style={{ width: `${SAMPLE.processingDays}%` }} />
                    </div>
                    <ul className="lp-quota-legend">
                      <li><span className="lp-dot green" />{fill(fill(t.lpLegendPaid, SAMPLE.paidDays), inr(SAMPLE.paidAmount))}</li>
                      <li><span className="lp-dot amber" />{fill(fill(t.lpLegendProcessing, SAMPLE.processingDays), inr(SAMPLE.processingAmount))}</li>
                      <li><span className="lp-dot open" />{fill(t.lpLegendRemaining, SAMPLE.remainingDays)}</li>
                    </ul>
                  </div>

                  <div className="lp-ledger-tiles">
                    <article>
                      <small>{t.lpRecentWork}</small>
                      <strong>{t.lpRecentWorkValue}</strong>
                      <span>{fill(t.lpMusterNo, SAMPLE.musterRoll)}</span>
                    </article>
                    <article>
                      <small>{t.lpWageStatusLabel}</small>
                      <strong>{t.lpCreditedDirect}</strong>
                      <span>{t.lpBankLine}</span>
                    </article>
                    <article>
                      <small>{t.lpDelayQuestion}</small>
                      <strong>{t.lpNoBlocker}</strong>
                      <button type="button" className="lp-tile-link" onClick={() => router.push("/grievance")}>
                        {t.createComplaint}<Sym name="open_in_new" />
                      </button>
                    </article>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        <section className="lp-compare" id="karan-section">
          <div className="lp-container">
            <div className="lp-section-head">
              <p className="lp-pill-center">{t.lpCompareEyebrow}</p>
              <h2>{t.lpCompareTitle}</h2>
              <p className="lp-lead">{t.lpCompareLead}</p>
            </div>
            <div className="lp-compare-grid">
              <article className="lp-compare-col old">
                <header>
                  <span className="lp-compare-ic red"><Sym name="error_outline" /></span>
                  <span>
                    <p className="lp-eyebrow">{t.lpOldEyebrow}</p>
                    <h3>{t.lpOldTitle}</h3>
                  </span>
                </header>
                <ul>
                  <li><Sym name="close" /><span><strong>{t.lpOld1Title}</strong><p>{t.lpOld1Body}</p></span></li>
                  <li><Sym name="close" /><span><strong>{t.lpOld2Title}</strong><p>{t.lpOld2Body}</p></span></li>
                  <li><Sym name="close" /><span><strong>{t.lpOld3Title}</strong><p>{t.lpOld3Body}</p></span></li>
                </ul>
                <footer>{t.lpOldFooter}</footer>
              </article>

              <article className="lp-compare-col new">
                <span className="lp-compare-blob" aria-hidden="true" />
                <header>
                  <span className="lp-compare-ic green"><Sym name="check_circle" className="filled" /></span>
                  <span>
                    <p className="lp-eyebrow">{t.lpNewEyebrow}</p>
                    <h3>{t.lpNewTitle}</h3>
                  </span>
                </header>
                <ul>
                  <li><Sym name="check" /><span><strong>{t.lpNew1Title}</strong><p>{t.lpNew1Body}</p></span></li>
                  <li><Sym name="check" /><span><strong>{t.lpNew2Title}</strong><p>{t.lpNew2Body}</p></span></li>
                  <li><Sym name="check" /><span><strong>{t.lpNew3Title}</strong><p>{t.lpNew3Body}</p></span></li>
                </ul>
                <footer className="green"><Sym name="verified_user" />{t.lpNewFooter}</footer>
              </article>
            </div>
          </div>
        </section>

        <section className="lp-how">
          <div className="lp-container">
            <div className="lp-section-head">
              <p className="lp-pill-center">{t.lpHowEyebrow}</p>
              <h2>{t.lpHowTitle}</h2>
              <p className="lp-lead">{t.lpHowLead}</p>
            </div>
            <ol className="lp-steps">
              <li className="lp-step">
                <span className="lp-step-num">{t.lpNum1}</span>
                <h3>{t.lpStep1Title}</h3>
                <p>{t.lpStep1Body}</p>
                <footer><Sym name="pin" className="brown" />{t.lpStep1Foot}</footer>
              </li>
              <li className="lp-step">
                <span className="lp-step-num">{t.lpNum2}</span>
                <h3>{t.lpStep2Title}</h3>
                <p>{t.lpStep2Body}</p>
                <footer><Sym name="account_balance_wallet" className="green" />{t.lpStep2Foot}</footer>
              </li>
              <li className="lp-step">
                <span className="lp-step-num">{t.lpNum3}</span>
                <h3>{t.lpStep3Title}</h3>
                <p>{t.lpStep3Body}</p>
                <footer><Sym name="support_agent" className="red" />{t.lpStep3Foot}</footer>
              </li>
            </ol>
          </div>
        </section>
        <section className="lp-quote-section">
          <div className="lp-container">
            <figure className="lp-quote">
              <span className="lp-quote-mark"><Sym name="format_quote" /></span>
              <blockquote>{t.lpQuote}</blockquote>
              <figcaption>{t.lpQuoteName} • {t.lpQuoteRole}</figcaption>
            </figure>
          </div>
        </section>

        <section className="lp-cta">
          <div className="lp-container lp-cta-inner">
            <p className="lp-cta-pill"><Sym name="shield" />{t.lpCtaPill}</p>
            <h2>{t.lpCtaTitle}</h2>
            <p className="lp-cta-lead">{t.lpCtaLead}</p>
            <div className="lp-cta-actions">
              <button type="button" className="lp-cta-primary" onClick={start}>
                <Sym name="play_arrow" />{t.lpCtaPrimary}
              </button>
              {/* Not a tel: link on purpose — the number is part of the mock record, and
                  dialling a made-up helpline would be worse than showing it flat. */}
              <span className="lp-cta-secondary"><Sym name="call" />{t.tollFree}: {t.lpHelplineNumber}</span>
            </div>
          </div>
        </section>

        <section className="lp-disclaimer">
          <div className="lp-container">{t.lpDisclaimer}</div>
        </section>
      </main>

      <footer className="lp-footer">
        <div className="lp-container lp-footer-inner">
          <div className="lp-footer-brand">
            <strong>{t.lpFooterBrand}</strong>
            <p>{t.lpFooterSub}</p>
          </div>
          <ul className="lp-footer-tags">
            <li><Sym name="science" />{t.trustPrototype}</li>
            <li><Sym name="info" />{t.trustMock}</li>
            <li><Sym name="gpp_maybe" />{t.trustOfficial}</li>
          </ul>
        </div>
      </footer>

      <nav className="lp-mobile-nav" aria-label={t.navLabel}>
        <button type="button" className="active" onClick={() => router.push("/home")}>{t.home}</button>
        <button type="button" onClick={() => router.push("/wage-status")}>{t.wageNav}</button>
        <button type="button" onClick={() => router.push("/grievance")}>{t.grievance}</button>
        <button type="button" onClick={() => router.push("/profile")}>{t.profile}</button>
      </nav>
    </div>
  );
}
