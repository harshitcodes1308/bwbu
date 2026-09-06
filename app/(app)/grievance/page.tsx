"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { PageTitle } from "@/components/PageTitle";
import { Icon } from "@/components/icons";

export default function GrievancePage() {
  const { t, language, profile, setDraft } = useApp();
  const router = useRouter();
  const [issueType, setIssueType] = useState<string | null>(null);
  const [statement, setStatement] = useState("");
  const [loading, setLoading] = useState(false);

  const options: [string, string, string][] = [
    ["payment_not_received", "rupee", t.moneyMissing],
    ["attendance_wrong", "check", t.wrongAttendance],
    ["work_not_given", "briefcase", t.workMissing],
    ["job_card_error", "document", t.jobCardError],
    ["other", "alert", t.somethingElse],
  ];

  async function draft() {
    setLoading(true);
    try {
      const res = await fetch("/api/draft-grievance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale: language,
          issueType,
          workerStatement: statement,
          context: { workName: profile.workName[language], daysWorked: profile.days, wageDue: profile.wage },
        }),
      });
      setDraft(await res.json());
      router.push("/grievance-preview");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-page"><div className="page-width narrow-page">
      <PageTitle title={t.grievanceTitle} subtitle={t.grievanceLead} onBack={() => router.push("/home")} readAloud={`${t.grievanceTitle}. ${t.grievanceLead}`} />

      <div className="grievance-options">
        {options.map(([key, icon, label]) => (
          <button className={`grievance-option ${issueType === key ? "selected" : ""}`} type="button" key={key} aria-pressed={issueType === key} onClick={() => setIssueType(key)}>
            <span className="option-marker"><Icon name={icon} /></span>
            <span>{label}</span>
            <Icon name="arrow" />
          </button>
        ))}
      </div>

      {issueType && (
        <section className="draft-panel">
          <label className="statement-field">{t.statementPrompt}
            <textarea rows={4} value={statement} onChange={(e) => setStatement(e.target.value)} placeholder={t.statementPlaceholder} />
          </label>
          <button className="primary-button" type="button" onClick={draft} disabled={loading || !statement.trim()} aria-busy={loading}>
            <span className="ai-spark" aria-hidden="true" />{loading ? t.draftLoading : t.generateDraft}<Icon name="arrow" />
          </button>
        </section>
      )}

      {/* Can't write, or would rather talk? Reach a human directly. Same helpline
          number the tracker and demand screens dial. */}
      <div className="grievance-help">
        <div>
          <strong>{t.helpTitle}</strong>
          <p>{t.helpBody}</p>
        </div>
        <a className="contact-tel" href="tel:18003456789">
          <span className="material-symbols-outlined" aria-hidden="true">call</span>
          <span>{t.tollFree}: {t.lpHelplineNumber}</span>
        </a>
      </div>
    </div></div>
  );
}
