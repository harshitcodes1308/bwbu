import { LOCALE_TAG } from "./languages";

// Re-exported under the old name: the Web Speech API calls these "BCP 47 language
// tags", and the same map now also drives Intl formatting from lib/languages.ts.
export const BCP47 = LOCALE_TAG;

// Best-effort browser read-aloud. Only works for languages the device has a
// voice installed for; callers must not depend on it succeeding.
export function webSpeak(text: string, language: string, rate = 1) {
  try {
    const s = window.speechSynthesis;
    if (!s) return;
    s.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const tag = BCP47[language] ?? "hi-IN";
    u.lang = tag;
    u.rate = rate;
    const base = tag.split("-")[0];
    const v = s.getVoices().find((x) => x.lang === tag) || s.getVoices().find((x) => x.lang?.toLowerCase().startsWith(base));
    if (v) u.voice = v;
    s.speak(u);
  } catch { /* best-effort */ }
}

// The one clip currently playing. Module-level rather than per-component so that
// starting a read-aloud anywhere silences whatever was already talking — two
// voices over each other is worse than none for a worker who cannot read.
let current: HTMLAudioElement | null = null;

export function stopSpeaking() {
  try { window.speechSynthesis?.cancel(); } catch { /* noop */ }
  try { current?.pause(); } catch { /* noop */ }
  current = null;
}

// Server TTS first, because it covers all six languages; Web Speech is the
// fallback and only speaks the languages the device happens to have a voice for.
// `rate` is a real playback multiplier, so a slower speed control is not a lie.
// Resolves when playback *starts*, not when it finishes.
export async function speak(text: string, language: string, rate = 1) {
  if (!text) return;
  stopSpeaking();
  try {
    const res = await fetch("/api/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, locale: language }),
    });
    if (res.ok && res.headers.get("content-type")?.includes("audio")) {
      const url = URL.createObjectURL(await res.blob());
      const audio = new Audio(url);
      audio.playbackRate = rate;
      current = audio;
      audio.onended = () => {
        URL.revokeObjectURL(url);
        if (current === audio) current = null;
      };
      await audio.play();
      return;
    }
  } catch { /* fall through to Web Speech */ }
  webSpeak(text, language, rate);
}
