import { NextResponse } from "next/server";

// Server-side TTS via OpenAI (multilingual — speaks the language of the input
// text), so voice output works for all languages even when the device has no
// local Bengali/Marathi/Telugu/Tamil voices. Client falls back to Web Speech
// when this returns non-audio (no key / failure).
export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ configured: false }, { status: 200 });
  const { text } = (await request.json().catch(() => ({}))) ?? {};
  if (!text || typeof text !== "string") return NextResponse.json({ error: "Missing text" }, { status: 400 });

  try {
    const r = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts",
        voice: process.env.OPENAI_TTS_VOICE || "alloy",
        input: text,
        response_format: "mp3",
      }),
    });
    if (!r.ok) return NextResponse.json({ configured: true, error: "tts failed" }, { status: 502 });
    const buf = await r.arrayBuffer();
    return new Response(buf, { headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ configured: true, error: "tts failed" }, { status: 502 });
  }
}
