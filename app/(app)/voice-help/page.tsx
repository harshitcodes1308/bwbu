"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { LANGS } from "@/lib/languages";
import { stopSpeaking } from "@/lib/speech";
import { Avatar } from "@/components/Avatar";
import { Icon } from "@/components/icons";

const TOLL_FREE = "1800-345-6789";
const CALLS_URL = "https://api.openai.com/v1/realtime/calls";
// End a call left idle this long — Realtime audio is metered per minute, so a
// forgotten open line must not run forever on a rural worker's behalf.
// ponytail: fixed 90s idle cap; make it configurable if usage shows it's wrong.
const IDLE_MS = 90_000;

type Phase = "idle" | "connecting" | "live" | "ended" | "error";
type ErrKind = "mic" | "config" | "unsupported" | "conn";
type Caption = { id: number; role: "you" | "bot"; text: string };

export default function VoiceCallPage() {
  const { t, language, setLanguage, profile } = useApp();
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>("idle");
  const [errKind, setErrKind] = useState<ErrKind | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [muted, setMuted] = useState(false);
  const [captions, setCaptions] = useState<Caption[]>([]);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const micRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const botCapId = useRef<number | null>(null); // in-progress assistant caption
  const capId = useRef(0);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const captionsEnd = useRef<HTMLDivElement | null>(null);

  useEffect(() => () => teardown(), []);
  useEffect(() => {
    captionsEnd.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [captions.length]);

  function bumpIdle() {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => endCall(), IDLE_MS);
  }

  function teardown() {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    try { dcRef.current?.close(); } catch { /* noop */ }
    try { pcRef.current?.getSenders().forEach((s) => s.track?.stop()); } catch { /* noop */ }
    try { pcRef.current?.close(); } catch { /* noop */ }
    try { micRef.current?.getTracks().forEach((tr) => tr.stop()); } catch { /* noop */ }
    stopSpeaking();
    pcRef.current = null;
    dcRef.current = null;
    micRef.current = null;
  }

  function pushYou(text: string) {
    if (!text.trim()) return;
    setCaptions((prev) => [...prev, { id: capId.current++, role: "you", text: text.trim() }]);
    bumpIdle();
  }

  // Assistant transcript arrives as a stream of deltas; accumulate into one bubble.
  function appendBot(delta: string) {
    setCaptions((prev) => {
      const id = botCapId.current;
      if (id !== null) {
        const i = prev.findIndex((c) => c.id === id);
        if (i !== -1) { const next = [...prev]; next[i] = { ...next[i], text: next[i].text + delta }; return next; }
      }
      const nid = capId.current++;
      botCapId.current = nid;
      return [...prev, { id: nid, role: "bot", text: delta }];
    });
    bumpIdle();
  }

  function onEvent(msg: any) {
    const type: string = msg?.type ?? "";
    if (type.includes("input_audio_transcription.completed")) {
      pushYou(msg.transcript ?? "");
    } else if (type.endsWith("output_audio_transcript.delta") || type.endsWith("audio_transcript.delta")) {
      setSpeaking(true);
      if (typeof msg.delta === "string") appendBot(msg.delta);
    } else if (type.endsWith("output_audio_transcript.done") || type.endsWith("audio_transcript.done") || type === "response.done") {
      setSpeaking(false);
      botCapId.current = null; // next assistant turn starts a fresh bubble
    } else if (type === "response.created" || type.endsWith("output_audio.delta")) {
      setSpeaking(true);
    }
  }

  async function startCall() {
    setErrKind(null);
    setCaptions([]);
    botCapId.current = null;

    if (typeof RTCPeerConnection === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setErrKind("unsupported"); setPhase("error"); return;
    }
    setPhase("connecting");

    // 1. Ephemeral token (key stays on the server).
    let token: string;
    try {
      const res = await fetch("/api/realtime-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale: language,
          context: {
            worker: profile.name[language], village: profile.village[language], jobCard: profile.jobCard,
            work: profile.workName[language], daysWorked: profile.days, wageDue: profile.wage, wagePaid: profile.wagePaid,
            paymentStage: profile.currentStage, delayReason: profile.reason, demandedOn: profile.demandedOn,
            statusSummary: profile.status[language], detail: profile.detail[language], grsPhone: profile.grsPhone,
          },
        }),
      });
      const data = await res.json();
      if (data.configured === false) { setErrKind("config"); setPhase("error"); return; }
      if (!res.ok || !data.value) { setErrKind("conn"); setPhase("error"); return; }
      token = data.value;
    } catch { setErrKind("conn"); setPhase("error"); return; }

    // 2. Microphone.
    let mic: MediaStream;
    try {
      mic = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch { setErrKind("mic"); setPhase("error"); return; }
    micRef.current = mic;

    // 3. WebRTC peer connection straight to OpenAI.
    try {
      const pc = new RTCPeerConnection();
      pcRef.current = pc;
      pc.ontrack = (e) => { if (audioRef.current) audioRef.current.srcObject = e.streams[0]; };
      pc.addTrack(mic.getTracks()[0], mic);

      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;
      dc.onmessage = (e) => { try { onEvent(JSON.parse(e.data)); } catch { /* ignore non-JSON */ } };

      pc.onconnectionstatechange = () => {
        const s = pc.connectionState;
        if (s === "connected") { setPhase("live"); bumpIdle(); }
        else if (s === "failed" || s === "disconnected") { if (phaseIsActive()) { setErrKind("conn"); setPhase("error"); } teardown(); }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      const sdpRes = await fetch(CALLS_URL, {
        method: "POST",
        body: offer.sdp,
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/sdp" },
      });
      if (!sdpRes.ok) { setErrKind("conn"); setPhase("error"); teardown(); return; }
      await pc.setRemoteDescription({ type: "answer", sdp: await sdpRes.text() });
    } catch { setErrKind("conn"); setPhase("error"); teardown(); }
  }

  const phaseIsActive = () => pcRef.current !== null;

  function endCall() {
    teardown();
    setSpeaking(false);
    setPhase((p) => (p === "connecting" || p === "live" ? "ended" : p));
  }

  function toggleMute() {
    const on = !muted;
    setMuted(on);
    micRef.current?.getAudioTracks().forEach((tr) => (tr.enabled = !on));
  }

  const inCall = phase === "connecting" || phase === "live";
  const statusText =
    phase === "connecting" ? t.callConnecting
    : phase === "live" ? (speaking ? t.callSpeaking : t.callListening)
    : phase === "ended" ? t.callEnded
    : phase === "error" ? (errKind === "mic" ? t.callMicDenied : errKind === "config" ? t.callNotConfigured : errKind === "unsupported" ? t.callUnsupported : t.callError)
    : t.callHint;

  return (
    <div className="app-page voice-page">
      <div className="page-width">
        <div className="voice-head">
          <button className="back-button" type="button" onClick={() => router.push("/home")} aria-label={t.back}>
            <Icon name="back" />
          </button>
          <div className="voice-head-text">
            <span className="voice-live-badge">
              <span className="voice-live-dot" aria-hidden="true" />
              {t.voiceAvailabilityBadge}
            </span>
            <h1 data-page-title tabIndex={-1}>{t.voiceHelpTitle}</h1>
            <p>{t.voiceHelpLead}</p>
          </div>
          <div className="dialect-strip" role="group" aria-label={t.dialectLabel}>
            <span className="dialect-label">
              <span className="material-symbols-outlined" aria-hidden="true">translate</span>
              {t.dialectLabel}
            </span>
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                className={`dialect-chip ${language === l.code ? "selected" : ""}`}
                aria-pressed={language === l.code}
                disabled={inCall}
                onClick={() => setLanguage(l.code)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="voice-identity">
          <Avatar profileId={profile.id} size={56} alt={profile.name[language]} />
          <div className="voice-identity-text">
            <strong>{profile.name[language]}</strong>
            <span className="mono">{profile.jobCard}</span>
            <span className="voice-identity-verified">
              <span className="material-symbols-outlined" aria-hidden="true">task_alt</span>
              {t.voiceVerifiedIdentity}
            </span>
          </div>
          <span className="act-pill">{t.mgnregaAct}</span>
        </div>

        <section className="call-stage">
          <div className={`call-orb ${phase} ${speaking ? "speaking" : ""}`} aria-hidden="true">
            <span className="call-ring one" />
            <span className="call-ring two" />
            <span className="material-symbols-outlined call-orb-icon">
              {phase === "live" ? (speaking ? "graphic_eq" : "hearing") : phase === "connecting" ? "more_horiz" : "call"}
            </span>
          </div>

          <p className={`call-status ${phase}`} role="status" aria-live="polite">{statusText}</p>

          <div className="call-controls">
            {!inCall ? (
              <button type="button" className="call-btn start" onClick={startCall}>
                <span className="material-symbols-outlined" aria-hidden="true">call</span>
                <span>{t.callStart}</span>
              </button>
            ) : (
              <>
                <button type="button" className="call-btn mute" onClick={toggleMute} aria-pressed={muted}>
                  <span className="material-symbols-outlined" aria-hidden="true">{muted ? "mic_off" : "mic"}</span>
                  <span>{muted ? t.callUnmute : t.callMute}</span>
                </button>
                <button type="button" className="call-btn end" onClick={endCall}>
                  <span className="material-symbols-outlined" aria-hidden="true">call_end</span>
                  <span>{t.callEnd}</span>
                </button>
              </>
            )}
          </div>

          {phase === "idle" && <p className="call-hint">{t.callHint}</p>}
        </section>

        {captions.length > 0 && (
          <section className="call-captions">
            <h2>{t.callCaptionsTitle}</h2>
            <div className="caption-thread">
              {captions.map((c) => (
                <div key={c.id} className={`caption-line ${c.role}`}>
                  <span className="caption-who">{c.role === "you" ? t.callYou : t.assistantVoiceName}</span>
                  <p>{c.text}</p>
                </div>
              ))}
              <div ref={captionsEnd} />
            </div>
          </section>
        )}

        <section className="rail-card call-fallback">
          <div className="sevak-head">
            <span className="sevak-mark material-symbols-outlined" aria-hidden="true">support_agent</span>
            <div>
              <h3>{t.rozgarSevakTitle}</h3>
              <p>{t.grsSub}</p>
            </div>
          </div>
          <a className="sevak-call" href={`tel:${TOLL_FREE.replace(/-/g, "")}`}>
            <span className="material-symbols-outlined" aria-hidden="true">call</span>
            <span>{t.callSevakFree}</span>
            <span className="mono">{TOLL_FREE}</span>
          </a>
        </section>

        {/* Remote assistant voice. Playback begins inside the Start-call tap, so
            browser autoplay policy is satisfied. */}
        <audio ref={audioRef} autoPlay hidden />
      </div>
    </div>
  );
}
