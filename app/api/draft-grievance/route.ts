import { NextResponse } from "next/server";
import { openAiJson, langName } from "@/lib/openai";
import { grievanceTemplate } from "@/lib/templates";

type Draft = { subject: string; category: string; complaint: string; suggestedRecords: string[] };

const isDraft = (o: any): o is Draft =>
  o && typeof o.subject === "string" && typeof o.category === "string" && typeof o.complaint === "string" && Array.isArray(o.suggestedRecords);

export async function POST(request: Request) {
  const { locale = "hi", issueType = "", workerStatement = "", context } = (await request.json().catch(() => ({}))) ?? {};
  if (!workerStatement && !issueType) return NextResponse.json({ error: "Missing issueType or workerStatement" }, { status: 400 });

  const prompt = `Convert a rural worker's MGNREGA complaint into a formal grievance in ${langName(locale)}. Return ONLY a JSON object with keys "subject" (string), "category" (string), "complaint" (string, under 150 words, respectful), "suggestedRecords" (array of short strings). Preserve the worker's facts. Do NOT add invented dates, amounts, names, or allegations. Issue type: ${issueType}. Worker's words: ${JSON.stringify(workerStatement)}. Synthetic context: ${JSON.stringify(context ?? {})}.`;

  const ai = await openAiJson(prompt);
  const configured = isDraft(ai) === true;
  const amount = context?.wageDue ? `₹${Number(context.wageDue).toLocaleString("en-IN")}` : "";
  const out = configured
    ? (ai as Draft)
    : grievanceTemplate(context?.workName ?? "", String(context?.daysWorked ?? ""), amount, workerStatement, locale);
  return NextResponse.json({ configured, ...out });
}
