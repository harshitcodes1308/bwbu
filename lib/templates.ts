import type { Lang } from "./languages";
import templates from "./i18n/templates.json";

type ExplainT = { summary: string; nextStep: string; disclaimer: string };
type GrievanceT = { subject: string; category: string; complaint: string; statementLabel: string; records: string[] };

const fill = (s: string, vars: Record<string, string>) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
const pick = <T>(map: Record<string, T>, locale: string): T => map[locale] ?? map.hi;

// Deterministic, localized fallbacks used when no OpenAI key is set or the model
// returns malformed JSON — so the demo completes in every language, offline.
export function explainTemplate(reason: string, amount: string, locale: Lang): ExplainT {
  const variant = reason === "paid" ? "paid" : reason === "not_started" ? "notStarted" : "pending";
  const t = pick(templates.explain, locale)[variant];
  return { summary: fill(t.summary, { amount }), nextStep: t.nextStep, disclaimer: t.disclaimer };
}

export function grievanceTemplate(work: string, days: string, amount: string, statement: string, locale: Lang) {
  const t: GrievanceT = pick(templates.grievance, locale);
  const complaint = fill(t.complaint, { work, days, amount }) + (statement ? ` ${t.statementLabel} ${statement}` : "");
  return { subject: t.subject, category: t.category, complaint, suggestedRecords: t.records };
}
