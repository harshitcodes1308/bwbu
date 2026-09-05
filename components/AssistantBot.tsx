"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { BCP47, speak as speakAloud, stopSpeaking } from "@/lib/speech";
import { Icon, NavIcon } from "./icons";

const ACTION_ROUTE: Record<string, string> = { open_grievance: "/grievance", show_status: "/grievance-status", explain_wage: "/ai-explanation" };

export function AssistantBot() {
  const { t, language, profile } = useApp();
  const router = useRouter();
  const pathname = usePathname();
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

  useEffect(() => {
    const SR = typeof window !== "undefined" && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
    setMicOk(!!SR);
  }, []);

  // The voice help screen is this assistant, full size. A floating mic that opens a
  // smaller copy of it on top would just be a second mic competing with the real one.
  if (pathname === "/voice-help") return null;

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
      speakAloud(data.reply || "", language);
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
    stopSpeaking();
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
              <span className="assistant-head-actions">
                <button
                  type="button"
                  className="assistant-expand"
                  onClick={() => { closePanel(); router.push("/voice-help"); }}
                  aria-label={t.voiceFullPageCta}
                  title={t.voiceFullPageCta}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">open_in_full</span>
                </button>
                <button type="button" className="assistant-close" onClick={closePanel} aria-label={t.back}><Icon name="close" /></button>
              </span>
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
