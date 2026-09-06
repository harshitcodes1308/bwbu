"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/lib/app-context";
import { speak, stopSpeaking } from "@/lib/speech";

// Audio-first: many users cannot read even simple Hindi. Tap to hear this
// screen's status read aloud in the current language. Uses the server TTS
// (all six languages) with a Web Speech fallback — same engine as voice-help.
export function ReadAloud({ text, className = "" }: { text: string; className?: string }) {
  const { t, language } = useApp();
  const [playing, setPlaying] = useState(false);

  // Stop any clip if the screen unmounts mid-sentence.
  useEffect(() => () => stopSpeaking(), []);

  async function toggle() {
    if (playing) { stopSpeaking(); setPlaying(false); return; }
    setPlaying(true);
    try { await speak(text, language); } finally {
      // speak() resolves when playback *starts*; drop the state a little after so
      // the button doesn't look stuck on for long reads.
      setTimeout(() => setPlaying(false), Math.max(4000, text.length * 90));
    }
  }

  return (
    <button type="button" className={`read-aloud ${playing ? "playing" : ""} ${className}`} onClick={toggle} aria-label={t.playAudioAria} aria-pressed={playing}>
      <span className="material-symbols-outlined" aria-hidden="true">{playing ? "graphic_eq" : "volume_up"}</span>
      <span>{t.listenAloudTitle}</span>
    </button>
  );
}
