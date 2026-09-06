"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { PageTitle } from "@/components/PageTitle";
import { Icon } from "@/components/icons";

export default function GrievancePreviewPage() {
  const { t, draft, setDraft } = useApp();
  const router = useRouter();
  const [complaint, setComplaint] = useState(draft?.complaint ?? "");

  // The draft may arrive a tick late — the context hydrates it from localStorage
  // on mount (survives a refresh / dropped connection). Fill the editable field
  // once it lands.
  useEffect(() => {
    if (draft) setComplaint((c) => c || draft.complaint || "");
  }, [draft]);

  // Deep-linked here with no draft in memory AND none saved → back to build one.
  // (Don't redirect while a saved draft is still hydrating into context.)
  useEffect(() => {
    if (draft) return;
    let saved: string | null = null;
    try { saved = localStorage.getItem("mr_draft"); } catch {}
    if (!saved) router.replace("/grievance");
  }, [draft, router]);

  if (!draft) return null;

  function submit() {
    setDraft({ ...draft!, complaint });
    router.push("/grievance-submitted");
  }

  return (
    <div className="app-page"><div className="page-width narrow-page">
      <PageTitle title={t.previewTitle} subtitle={t.editHint} onBack={() => router.push("/grievance")} />

      <section className="draft-panel">
        <div className="draft-meta">
          <div><span>{t.subjectLabel}</span><strong>{draft.subject}</strong></div>
          <div><span>{t.categoryLabel}</span><strong>{draft.category}</strong></div>
        </div>
        <label className="statement-field">{t.complaintLabel}
          <textarea rows={7} value={complaint} onChange={(e) => setComplaint(e.target.value)} />
        </label>
        {draft.suggestedRecords?.length > 0 && (
          <div className="records-list">
            <span>{t.recordsLabel}</span>
            <ul>{draft.suggestedRecords.map((r) => <li key={r}>{r}</li>)}</ul>
          </div>
        )}
        {!draft.configured && <p className="offline-note">{t.aiOfflineNote}</p>}
      </section>

      <button className="primary-button" type="button" onClick={submit} disabled={!complaint.trim()}>{t.sendGrievance}<Icon name="arrow" /></button>
    </div></div>
  );
}
