// Top 5 spoken languages of India (2011 Census, first-language speakers) + English.
// Order = display order in the language selector.
export const LANGS = [
  { code: "hi", label: "हिन्दी" },
  { code: "bn", label: "বাংলা" },
  { code: "mr", label: "मराठी" },
  { code: "te", label: "తెలుగు" },
  { code: "ta", label: "தமிழ்" },
  { code: "en", label: "English" },
] as const;

export type Lang = (typeof LANGS)[number]["code"];

export const LANG_CODES = LANGS.map((l) => l.code) as Lang[];

// BCP-47 tags for the six languages. Used for Intl date/number formatting and,
// in lib/speech.ts, for Web Speech recognition and synthesis. Deliberately typed
// loosely so callers holding a plain string can index it with a `?? "hi-IN"` guard.
export const LOCALE_TAG: Record<string, string> = { hi: "hi-IN", bn: "bn-IN", mr: "mr-IN", te: "te-IN", ta: "ta-IN", en: "en-IN" };
