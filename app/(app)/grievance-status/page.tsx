"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { Ladder } from "@/components/Ladder";
import { PageTitle } from "@/components/PageTitle";
import { Icon } from "@/components/icons";
import { EmptyGrievanceIllustration } from "@/components/Illustrations";

export default function GrievanceStatusPage() {
  const { t, language, profile, draft } = useApp();
  const router = useRouter();
  const hasGrievance = Boolean(draft || profile.tone === "grievance");

  if (!hasGrievance) {
    return (
      <div className="app-page">
        <div className="page-width">
          <PageTitle title={t.grievanceTrack} subtitle={t.ladderSub} onBack={() => router.push("/home")} />
          <section className="empty-state-card">
            <div className="empty-illustration-wrap">
              <EmptyGrievanceIllustration size={170} />
            </div>
            <h2>{t.noGrievancesTitle}</h2>
            <p>{t.noGrievancesBody}</p>
            <button className="primary-button empty-action-btn" type="button" onClick={() => router.push("/grievance")}>
              <Icon name="alert" />
              {t.fileNewGrievance}
              <Icon name="arrow" />
            </button>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page">
      <div className="page-width">
        <PageTitle title={t.grievanceTrack} subtitle={t.grievanceId} onBack={() => router.push("/home")} />

        {/* Ombudsman Guarantee Alert Banner */}
        <div style={{
          marginBottom: 24,
          padding: "16px 20px",
          borderRadius: "var(--radius-card)",
          background: "var(--wheat-tint)",
          border: "1px solid var(--wheat-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          boxShadow: "0 2px 8px rgba(43, 36, 32, 0.04)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "var(--paper)",
              display: "grid",
              placeItems: "center",
              color: "var(--soil-brown)",
              flexShrink: 0
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 22 }}>gavel</span>
            </div>
            <div>
              <strong style={{ display: "block", color: "var(--soil-brown)", fontSize: 15 }}>
                {t.ombudsmanNotice}
              </strong>
              <span style={{ fontSize: 13, color: "var(--ink-muted)", marginTop: 2, display: "block" }}>
                {t.ombudsmanNoticeSub}
              </span>
            </div>
          </div>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 12px",
            borderRadius: 999,
            background: "var(--paper)",
            color: "var(--leaf-green)",
            fontSize: 12,
            fontWeight: 700
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--leaf-green)" }} />
            ज़िला लोकपाल: उपस्थित
          </div>
        </div>

        {/* Active Grievance Tracker Card */}
        <section className="feature-panel grievance-panel" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="panel-label" style={{ margin: 0 }}>{draft ? "#GRV-2026-904" : t.grievanceId}</span>
                <span style={{
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: "rgba(232, 145, 45, 0.15)",
                  color: "#B55800",
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase"
                }}>
                  जांच प्रक्रियाधीन
                </span>
              </div>
              <h2 style={{ marginTop: 8, fontSize: 20 }}>{draft?.subject ?? profile.status[language]}</h2>
              <p style={{ marginTop: 4, fontSize: 14 }}>{draft ? t.grievanceDraftBody : profile.detail[language]}</p>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <span style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", fontWeight: 600 }}>अंतिम समयसीमा</span>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--terracotta-red)", marginTop: 2 }}>27 Feb 2025</div>
              <span style={{ fontSize: 12, color: "var(--sun-amber)", fontWeight: 600 }}>2 दिन शेष</span>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--line)", paddingTop: 16 }}>
            <Ladder t={t} grievance />
          </div>
        </section>

        {/* Citizen Security & Confidentiality Protection Card */}
        <div style={{
          marginTop: 20,
          padding: "16px 20px",
          borderRadius: "var(--radius-card)",
          background: "var(--paper-deep)",
          border: "1px solid var(--line)",
          display: "flex",
          alignItems: "flex-start",
          gap: 14
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 26, color: "var(--soil-brown)", flexShrink: 0, marginTop: 2 }}>security</span>
          <div>
            <strong style={{ display: "block", color: "var(--soil-brown)", fontSize: 15 }}>
              {t.citizenSecurity}
            </strong>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--ink-muted)", lineHeight: 1.4 }}>
              {t.citizenSecuritySub}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
          <button
            className="wide-outline-button"
            type="button"
            onClick={() => router.push("/grievance")}
            style={{ flex: 1, minWidth: 200 }}
          >
            <Icon name="alert" />
            <span>{t.createComplaint}</span>
            <Icon name="arrow" />
          </button>
          <button
            className="button"
            type="button"
            onClick={() => window.print()}
            style={{ minHeight: 48, padding: "10px 18px", background: "var(--paper)", border: "1px solid var(--line)", color: "var(--soil-brown)" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>print</span>
            <span>{t.printReceipt}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
