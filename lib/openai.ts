// Single OpenAI JSON call, shared by the two AI routes. Returns the parsed
// object, or null on no key / any failure so callers fall back to a template.
export async function openAiJson(prompt: string): Promise<Record<string, unknown> | null> {
  if (!process.env.OPENAI_API_KEY) return null;
  try {
    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        input: prompt,
        max_output_tokens: 400,
        text: { format: { type: "json_object" } },
      }),
    });
    if (!r.ok) return null;
    const data: any = await r.json();
    const text = data.output_text || data.output?.flatMap((i: any) => i.content || []).find((i: any) => i.type === "output_text")?.text;
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

const LANG_NAMES: Record<string, string> = {
  hi: "simple Hindi written in Devanagari",
  en: "plain English",
  bn: "simple Bengali written in the Bengali script",
  mr: "simple Marathi written in Devanagari",
  te: "simple Telugu written in the Telugu script",
  ta: "simple Tamil written in the Tamil script",
};
export const langName = (locale: string) => LANG_NAMES[locale] ?? LANG_NAMES.hi;
