"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { Icon } from "@/components/icons";
import { GrievanceSuccessIllustration } from "@/components/Illustrations";

export default function GrievanceSubmittedPage() {
  const { t, draft } = useApp();
  const router = useRouter();
  // Mock tracking id, stable for this screen instance.
  const [trackingId] = useState(() => `MR-2026-${String(Math.floor(10000 + Math.random() * 89999))}`);

  useEffect(() => {
    if (!draft) router.replace("/grievance");
  }, [draft, router]);

  if (!draft) return null;

  return (
    <div className="app-page">
      <div className="page-width narrow-page success-view">
        <div className="receipt-stamp-wrap">
          <GrievanceSuccessIllustration size={110} />
          <span className="receipt-badge">{t.grievanceReceiptBadge}</span>
        </div>
        <p className="receipt-id">{t.trackingLabel}: {trackingId}</p>
      <h1 data-page-title tabIndex={-1} aria-live="polite">{t.grievanceSent}</h1>
      <p>{draft.subject}</p>
      <p className="synthetic-note"><span className="note-dot" aria-hidden="true" />{t.demoNotSent}</p>
      <button className="primary-button" type="button" onClick={() => router.push("/grievance-status")}>{t.grievanceTrack}<Icon name="arrow" /></button>
      <button className="wide-outline-button" type="button" onClick={() => router.push("/home")}>{t.home}<Icon name="arrow" /></button>
    </div></div>
  );
}
