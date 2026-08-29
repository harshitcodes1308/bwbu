import { NextResponse } from "next/server";
import { openAiJson, langName } from "@/lib/openai";
import { explainTemplate } from "@/lib/templates";

type Explain = { summary: string; nextStep: string; disclaimer: string };

const isExplain = (o: any): o is Explain =>
  o && typeof o.summary === "string" && typeof o.nextStep === "string" && typeof o.disclaimer === "string";

export async function POST(request: Request) {
  const { locale = "hi", wageRecord } = (await request.json().catch(() => ({}))) ?? {};
  if (!wageRecord || wageRecord.daysWorked == null || wageRecord.wageDue == null)
    return NextResponse.json({ error: "Missing wageRecord fields" }, { status: 400 });

  const prompt = `You explain a synthetic MGNREGA wage status to a rural worker in ${langName(locale)}. Return ONLY a JSON object with string keys "summary", "nextStep", "disclaimer" — each one short sentence. Never invent a transaction id, official name, bank, or payment date. If the reason is unknown, say it is unknown. Wage record: ${JSON.stringify(wageRecord)}.`;

  const ai = await openAiJson(prompt);
  const configured = isExplain(ai) === true;
  const amount = wageRecord.wageDue ? `₹${Number(wageRecord.wageDue).toLocaleString("en-IN")}` : "";
  const out = configured ? (ai as Explain) : explainTemplate(String(wageRecord.reason ?? ""), amount, locale);
  return NextResponse.json({ configured, ...out });
}
