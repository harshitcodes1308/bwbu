import { NextResponse } from "next/server";
import { openAiJson, langName } from "@/lib/openai";
import { copy } from "@/lib/copy";
import type { Lang } from "@/lib/languages";

type Reply = { reply: string; action: string };
const ACTIONS = ["open_grievance", "show_status", "explain_wage", "none"];
const isReply = (o: any): o is Reply =>
  o && typeof o.reply === "string" && typeof o.action === "string" && ACTIONS.includes(o.action);

export async function POST(request: Request) {
  const { locale = "hi", transcript = "", context } = (await request.json().catch(() => ({}))) ?? {};
  if (!transcript.trim()) return NextResponse.json({ error: "Missing transcript" }, { status: 400 });

  const prompt = `You are a warm, concise voice assistant for "Mera Rozgar", helping a rural MGNREGA worker with delayed wages. Reply in ${langName(locale)}, in at most 2 short spoken sentences. Then decide ONE action the app should take:
- "open_grievance" if the worker wants to file/register a complaint or grievance
- "show_status" if they want to track or see the status of an existing complaint
- "explain_wage" if they ask why their wage/payment is delayed or want it explained
- "none" for anything else (just answer helpfully)
Never invent official records, dates, or amounts beyond the synthetic context. Return ONLY JSON: {"reply": string, "action": one of the four}.
Worker's synthetic context: ${JSON.stringify(context ?? {})}.
Worker said: ${JSON.stringify(transcript)}.`;

  const ai = await openAiJson(prompt);
  if (isReply(ai)) return NextResponse.json({ configured: true, ...ai });

  // No key / malformed → localized guidance, no crash.
  const c = (copy[locale as Lang] ?? copy.hi) as typeof copy.hi;
  return NextResponse.json({ configured: false, reply: c.assistantIntro, action: "none" });
}
