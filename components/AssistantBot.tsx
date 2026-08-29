"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { Icon, NavIcon } from "./icons";

// Web Speech API locale codes (native browser STT/TTS — no dependency).
const BCP47: Record<string, string> = { hi: "hi-IN", bn: "bn-IN", mr: "mr-IN", te: "te-IN", ta: "ta-IN", en: "en-IN" };
const ACTION_ROUTE: Record<string, string> = { open_grievance: "/grievance", show_status: "/grievance-status", explain_wage: "/ai-explanation" };

export function AssistantBot() {
  const { t, language, profile } = useApp();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [input, setInput] = useState("");
  const [userSaid, setUserSaid] = useState("");
  const [reply, setReply] = useState("");
  const [action, setAction] = useState<string>("none");
  const [micOk, setMicOk] = useState(true);
  const recRef = useRef<any>(null);
  const keepListeningRef = useRef(false);
  const finalRef = useRef("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const SR = typeof window !== "undefined" && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
    setMicOk(!!SR);
  }, []);

  // Fallback: browser Web Speech (only works for languages the device has a voice for).
  function webSpeak(text: string) {
    try {
      const s = window.speechSynthesis;
      if (!s) return;
      s.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = BCP47[language] ?? "hi-IN";
      const base = (BCP47[language] ?? "hi-IN").split("-")[0];
      const v = s.getVoices().find((x) => x.lang === BCP47[language]) || s.getVoices().find((x) => x.lang?.toLowerCase().startsWith(base));
      if (v) u.voice = v;
      s.speak(u);
    } catch { /* best-effort */ }
  }

  // Prefer server TTS (multilingual); fall back to Web Speech if unavailable.
  async function speak(text: string) {
    if (!text) return;
    try { window.speechSynthesis?.cancel(); } catch { /* noop */ }
    try { audioRef.current?.pause(); } catch { /* noop */ }
    try {
      const res = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, locale: language }),
      });
      if (res.ok && res.headers.get("content-type")?.includes("audio")) {
        const url = URL.createObjectURL(await res.blob());
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => URL.revokeObjectURL(url);
        await audio.play();
        return;
      }
    } catch { /* fall through to Web Speech */ }
    webSpeak(text);
  }

  async function send(text: string) {
    const q = text.trim();
    if (!q) return;
    setUserSaid(q);
    setInput("");
    setReply("");
    setAction("none");
    setThinking(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: language, transcript: q, context: { status: profile.id, workName: profile.workName[language], daysWorked: profile.days, wageDue: profile.wage, reason: profile.reason } }),
      });
      const data = await res.json();
      setReply(data.reply || "");
      setAction(ACTION_ROUTE[data.action] ? data.action : "none");
      speak(data.reply || "");
    } catch {
      setReply(t.assistantMicUnavailable);
    } finally {
      setThinking(false);
    }
  }

  // Continuous listening: keeps going until the user presses Stop, restarting
  // recognition if the browser ends it on a pause. Nothing is sent until Stop.
  function startListen() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setMicOk(false); return; }
    finalRef.current = "";
    setInput("");
    keepListeningRef.current = true;
    setListening(true);

    const rec = new SR();
    recRef.current = rec;
    rec.lang = BCP47[language] ?? "hi-IN";
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e: any) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const chunk = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalRef.current += chunk + " ";
        else interim += chunk;
      }
      setInput((finalRef.current + interim).trim());
    };
    rec.onerror = () => { /* keep the session; onend will restart if still listening */ };
    rec.onend = () => {
      if (keepListeningRef.current) {
        try { rec.start(); } catch { /* already starting */ }
      } else {
        setListening(false);
      }
    };
    try { rec.start(); } catch { /* already started */ }
  }

  function stopAndSend() {
    keepListeningRef.current = false;
    try { recRef.current?.stop(); } catch { /* noop */ }
    setListening(false);
    const text = (finalRef.current || input).trim();
    if (text) send(text);
  }

  function closePanel() {
    keepListeningRef.current = false;
    try { recRef.current?.stop(); } catch { /* noop */ }
    try { window.speechSynthesis?.cancel(); } catch { /* noop */ }
    try { audioRef.current?.pause(); } catch { /* noop */ }
    setListening(false);
    setOpen(false);
  }

  const actionLabel = action === "open_grievance" ? t.createComplaint : action === "show_status" ? t.grievanceTrack : action === "explain_wage" ? t.wageDetails : "";

  return (
    <>
      <button className="assistant-fab" type="button" onClick={() => setOpen(true)} aria-label={t.assistantTitle}>
        <NavIcon name="mic" />
      </button>

      {open && (
        <div className="assistant-overlay" role="dialog" aria-label={t.assistantTitle} aria-modal="true">
          <div className="assistant-panel">
            <div className="assistant-head">
              <strong>{t.assistantTitle}</strong>
              <button type="button" className="assistant-close" onClick={closePanel} aria-label={t.back}>✕</button>
            </div>

            <div className="assistant-body">
              <p className="assistant-intro">{t.assistantIntro}</p>
              {userSaid && <p className="assistant-bubble user">{userSaid}</p>}
              {thinking && <p className="assistant-bubble bot thinking">{t.assistantThinking}</p>}
              {reply && !thinking && <p className="assistant-bubble bot">{reply}</p>}
              {action !== "none" && !thinking && reply && (
                <button type="button" className="assistant-action" onClick={() => { closePanel(); router.push(ACTION_ROUTE[action]); }}>
                  {actionLabel}<Icon name="arrow" />
                </button>
              )}
            </div>

            <div className="assistant-controls">
              <button
                type="button"
                className={`assistant-mic ${listening ? "on" : ""}`}
                onClick={listening ? stopAndSend : startListen}
                disabled={!micOk}
                aria-pressed={listening}
              >
                <NavIcon name="mic" />{listening ? t.listening : t.assistantSpeak}
              </button>
              {!micOk && <p className="assistant-note">{t.assistantMicUnavailable}</p>}
              <form className="assistant-typed" onSubmit={(e) => { e.preventDefault(); send(input); }}>
                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.assistantPlaceholder} aria-label={t.assistantPlaceholder} />
                <button type="submit" className="primary-button" disabled={thinking || !input.trim()}>{t.assistantSend}</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
