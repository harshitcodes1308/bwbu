import type { Lang } from "./languages";
import { LANG_CODES } from "./languages";
import hi from "./i18n/profiles.hi.json";
import en from "./i18n/profiles.en.json";
import bn from "./i18n/profiles.bn.json";
import mr from "./i18n/profiles.mr.json";
import te from "./i18n/profiles.te.json";
import ta from "./i18n/profiles.ta.json";

export const jobs = ["applied", "allotted", "attendance", "processing", "paid"] as const;

type LocaleRow = { id: string; name: string; village: string; workName: string; status: string; detail: string; bank: string };
const locales: Record<Lang, LocaleRow[]> = { hi, en, bn, mr, te, ta };

export type Profile = {
  id: string;
  initials: string;
  jobCard: string;
  phone: string;
  accountMasked: string;
  ifsc: string;
  days: number;
  wage: number;
  wagePaid: number;
  musterRollClosed: string;
  currentStage: string;
  reason: string;
  step: number;
  tone: string;
  name: Record<Lang, string>;
  village: Record<Lang, string>;
  workName: Record<Lang, string>;
  status: Record<Lang, string>;
  detail: Record<Lang, string>;
  bank: Record<Lang, string>;
};

// Non-localized fields. Localized strings live in lib/i18n/profiles.<lang>.json.
// accountMasked / ifsc are synthetic: the demo never touches a real account.
const base = [
  { id: "delayed", initials: "सी", jobCard: "RJ-02-002-2048", phone: "9876543210", accountMasked: "******3902", ifsc: "BARB0RMGBRJ", days: 12, wage: 2568, wagePaid: 0, musterRollClosed: "2026-08-18", currentStage: "payment_processing", reason: "verification_pending", step: 3, tone: "delayed" },
  { id: "paid", initials: "र", jobCard: "UP-41-000-614", phone: "9876500614", accountMasked: "******4471", ifsc: "BARB0UPMAHA", days: 17, wage: 3910, wagePaid: 3910, musterRollClosed: "2026-08-05", currentStage: "payment_completed", reason: "paid", step: 4, tone: "paid" },
  { id: "grievance", initials: "म", jobCard: "UP-41-000-327", phone: "9876500327", accountMasked: "******8163", ifsc: "BARB0UPMAHA", days: 8, wage: 1840, wagePaid: 0, musterRollClosed: "2026-08-12", currentStage: "grievance_review", reason: "attendance_dispute", step: 2, tone: "grievance" },
  { id: "new", initials: "आ", jobCard: "UP-41-000-845", phone: "9876500845", accountMasked: "******2290", ifsc: "BARB0UPMAHA", days: 0, wage: 0, wagePaid: 0, musterRollClosed: "", currentStage: "application_received", reason: "not_started", step: 0, tone: "new" },
];

function localized(id: string, field: keyof LocaleRow): Record<Lang, string> {
  const out = {} as Record<Lang, string>;
  for (const l of LANG_CODES) {
    const row = locales[l].find((r) => r.id === id);
    if (!row) throw new Error(`profiles.${l}.json missing id ${id}`);
    out[l] = row[field];
  }
  return out;
}

export const profiles: Profile[] = base.map((b) => ({
  ...b,
  name: localized(b.id, "name"),
  village: localized(b.id, "village"),
  workName: localized(b.id, "workName"),
  status: localized(b.id, "status"),
  detail: localized(b.id, "detail"),
  bank: localized(b.id, "bank"),
}));
