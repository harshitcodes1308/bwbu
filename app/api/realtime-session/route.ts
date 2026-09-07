import { NextResponse } from "next/server";
import { langName } from "@/lib/openai";

// Mints a short-lived ephemeral client secret for an OpenAI Realtime (WebRTC)
// voice call. The real OPENAI_API_KEY never leaves the server — the browser
// gets only this token and opens the call directly to OpenAI. Read live per
// request, mirroring every other AI route; no key → { configured:false }.
export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ configured: false }, { status: 200 });

  const { locale = "hi", context } = (await request.json().catch(() => ({}))) ?? {};

  const instructions = [
    `You are "Rozgar Saathi", a warm, patient voice helper on a live call with a rural MGNREGA (NREGA) worker in India.`,
    `Speak and reply ONLY in ${langName(locale)}. Use short, simple, spoken sentences — never read out tables, codes, or jargon. Speak slowly and kindly, like a trusted village friend.`,
    `Answer the worker's questions about their work, attendance, wages, payment delays, entitlements, and how to raise a grievance.`,
    `Ground every answer in this worker's record (all figures are synthetic demo data): ${JSON.stringify(context ?? {})}.`,
    `Never invent a transaction id, exact payment date, bank name, or officer name. If something is not in the record, say plainly that you do not know and suggest asking the Gram Rozgar Sahayak or panchayat.`,
    `Always end with one clear next step the worker can take. If they describe a problem with wages, attendance, work, or their job card, offer to help them file a grievance.`,
    `Keep replies brief — this is a phone conversation, not a lecture. Let the worker interrupt you.`,
  ].join(" ");

  try {
    const r = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        session: {
          type: "realtime",
          model: process.env.OPENAI_REALTIME_MODEL || "gpt-realtime",
          instructions,
          audio: {
            input: {
              transcription: { model: "gpt-4o-mini-transcribe" },
              turn_detection: { type: "server_vad" },
            },
            output: { voice: process.env.OPENAI_REALTIME_VOICE || "alloy" },
          },
        },
      }),
    });
    if (!r.ok) return NextResponse.json({ configured: true, error: "mint_failed" }, { status: 502 });
    const data = await r.json();
    // GA returns { value, expires_at, session } (older shape: { client_secret: { value } }).
    const value = data.value ?? data.client_secret?.value;
    const model = data.session?.model || process.env.OPENAI_REALTIME_MODEL || "gpt-realtime";
    if (!value) return NextResponse.json({ configured: true, error: "no_secret" }, { status: 502 });
    return NextResponse.json({ configured: true, value, model });
  } catch {
    return NextResponse.json({ configured: true, error: "mint_failed" }, { status: 502 });
  }
}
