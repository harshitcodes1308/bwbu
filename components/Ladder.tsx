import { jobs } from "@/lib/profiles";
import type { Copy } from "@/lib/copy";
import { Icon } from "./icons";

const ladderIcons = ["document", "briefcase", "check", "rupee", "paid"];

export function Ladder({ t, compact = false, grievance = false, currentStep = 3, preview = false }: { t: Copy; compact?: boolean; grievance?: boolean; currentStep?: number; preview?: boolean }) {
  const source: [string, string][] = grievance
    ? [[t.grievanceStep1, t.date25], [t.grievanceStep2, t.date25], [t.grievanceStep3, t.inReview], [t.grievanceStep4, t.nextStep]]
    : preview
      ? [[t.howStep1, t.howStep1Detail], [t.howStep2, t.howStep2Detail], [t.howStep3, t.howStep3Detail]]
      : jobs.map((key) => [t[key], t[`${key}Date` as keyof Copy]] as [string, string]);
  const effectiveStep = grievance ? 2 : currentStep;
  const steps = source.map(([title, detail], index) => {
    const last = source.length - 1;
    const status = preview ? (index === 0 ? "current" : "future") : effectiveStep === last && index <= effectiveStep ? "done" : index < effectiveStep ? "done" : index === effectiveStep ? "current" : "future";
    return [title, detail, status, ladderIcons[index] || "document"] as [string, string, string, string];
  });

  return (
    <ol className={`ladder ${compact ? "compact-ladder" : ""}`} aria-label={grievance ? t.grievanceTrack : t.ladderTitle}>
      {steps.map(([title, detail, tone, icon], index) => (
        <li className={`ladder-step ${tone} ${tone === "current" ? "climbed" : ""}`} key={`${title}-${index}`} aria-current={tone === "current" ? "step" : undefined}>
          <div className="rung" aria-hidden="true"><Icon name={tone === "done" ? (index === source.length - 1 ? "paid" : "check") : tone === "current" ? (icon === "check" ? "progress" : icon) : "lock"} /></div>
          <div className="step-copy">
            <strong>{title}</strong>
            <span>{detail}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}
