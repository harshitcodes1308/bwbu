import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ configured: false });

  const { status, daysWorked, wageDue, attendance, reason, language = "hi" } =
    (await request.json().catch(() => ({}))) ?? {};
  if (!status || daysWorked == null || wageDue == null || !attendance || !reason)
    return NextResponse.json({ error: "Missing wage status fields" }, { status: 400 });

  const languageName = language === "hi" ? "simple Hindi written in Devanagari" : "plain English";
  const prompt = `Explain this synthetic MGNREGA wage status in ${languageName}. Use 2 short sentences and one practical next step. Never invent a date, bank name, legal claim, or promise. Status: ${status}. Days worked: ${daysWorked}. Wage due: ₹${wageDue}. Attendance: ${attendance}. Reason code: ${reason}.`;

  try {
    const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-4.1-mini", input: prompt, max_output_tokens: 120 }),
    });
    const data: any = await openAiResponse.json();
    if (!openAiResponse.ok) return NextResponse.json({ configured: true, error: "OpenAI request failed" }, { status: 502 });
    const explanation =
      data.output_text ||
      data.output?.flatMap((item: any) => item.content || []).find((item: any) => item.type === "output_text")?.text;
    return NextResponse.json({ configured: true, explanation: explanation || "No explanation returned." });
  } catch {
    return NextResponse.json({ configured: true, error: "OpenAI request failed" }, { status: 502 });
  }
}
