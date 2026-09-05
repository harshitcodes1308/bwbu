"use client";

import type { ReactNode } from "react";

export type RungStatus = "done" | "current" | "future";

export type RungPill = { icon?: string; text: string };

export type Rung = {
  /** Stage id from lib/profiles `jobs`, used as the React key. */
  key: string;
  /** Material Symbols glyph name, matching the Stitch design's icon per rung. */
  icon: string;
  status: RungStatus;
  /** "पूर्ण • VERIFIED" style badge. */
  badge: string;
  /** Right-aligned date line in the card header. */
  when: string;
  title: string;
  body: string;
  /** Right-hand meta column: a label over a value, plus an optional third line. */
  metaLabel: string;
  metaValue: string;
  metaNote?: string;
  /** Extra header pills — the active rung carries "12 days in process". */
  pills?: RungPill[];
  meter?: { label: string; value: string; percent: number };
  actions?: ReactNode;
};

// Anatomy taken from screens/step_ladder_tracker/code.html: two full-height timber
// beams flank the whole stack, and each row lays a horizontal cross-bar between them
// that the card sits on top of — so the thing reads as a ladder you climb rather than
// a timeline. The beams are real elements, not ::before/::after, because each also
// carries a diagonal grain overlay that needs a pseudo-element of its own.
// The status node lives inside the card (design's `w-12 h-12` box), not in a side rail.
export function StepLadder({ rungs, label }: { rungs: Rung[]; label: string }) {
  return (
    <div className="rung-ladder">
      <span className="rung-beam beam-left" aria-hidden="true" />
      <span className="rung-beam beam-right" aria-hidden="true" />
      <ol className="rung-list" aria-label={label}>
        {rungs.map((rung, i) => (
          <li key={rung.key} className={`rung-row ${rung.status}`} aria-current={rung.status === "current" ? "step" : undefined}>
            <span className="rung-bar" aria-hidden="true" />

            <article className="rung-card">
              <span className="rung-node" aria-hidden="true">
                <span className={`material-symbols-outlined${rung.status === "done" ? " filled" : ""}`}>{rung.icon}</span>
              </span>

              <div className="rung-col">
                <div className="rung-head">
                  <span className="rung-badge">{rung.badge}</span>
                  {rung.pills?.map((pill) => (
                    <span className="rung-pill" key={pill.text}>
                      {pill.icon && <span className="material-symbols-outlined" aria-hidden="true">{pill.icon}</span>}
                      {pill.text}
                    </span>
                  ))}
                  <span className="rung-when">{rung.when}</span>
                </div>

                <h3 className="rung-title">
                  <span className="rung-num" aria-hidden="true">{i + 1}</span>
                  {rung.title}
                </h3>
                <p className="rung-body">{rung.body}</p>

                {rung.meter && (
                  <div className="rung-meter">
                    <div className="rung-meter-head">
                      <span>{rung.meter.label}</span>
                      <strong>{rung.meter.value}</strong>
                    </div>
                    <div
                      className="rung-meter-track"
                      role="progressbar"
                      aria-label={rung.meter.label}
                      aria-valuenow={rung.meter.percent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <span className="rung-meter-fill" style={{ width: `${rung.meter.percent}%` }} />
                    </div>
                  </div>
                )}

                {rung.actions && <div className="rung-actions">{rung.actions}</div>}
              </div>

              <div className="rung-meta">
                <span className="rung-meta-label">{rung.metaLabel}</span>
                <strong className="rung-meta-value">{rung.metaValue}</strong>
                {rung.metaNote && <span className="rung-meta-note">{rung.metaNote}</span>}
              </div>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
