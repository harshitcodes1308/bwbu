import hi from "./i18n/hi.json";
import en from "./i18n/en.json";
import bn from "./i18n/bn.json";
import mr from "./i18n/mr.json";
import te from "./i18n/te.json";
import ta from "./i18n/ta.json";
import type { Lang } from "./languages";

// hi is the canonical shape; every other locale is validated against it at
// build time by check.ts and structurally by tsc via the Copy type below.
export const copy: Record<Lang, typeof hi> = { hi, en, bn, mr, te, ta };

export type Copy = typeof hi;
export type { Lang };

// Substitutes the single {n} placeholder used by the counted strings ("{n} दिन शेष").
// Locale copy is authored with one placeholder per key, so a plain replace is enough.
export const fill = (s: string, n: number | string) => s.replace("{n}", String(n));
