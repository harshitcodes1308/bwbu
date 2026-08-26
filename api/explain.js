export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed" });
  if (!process.env.OPENAI_API_KEY) return response.status(200).json({ configured: false });

  const { status, daysWorked, wageDue, attendance, reason, language = "hi" } = request.body || {};
  if (!status || daysWorked == null || wageDue == null || !attendance || !reason) return response.status(400).json({ error: "Missing wage status fields" });

  const languageName = language === "hi" ? "simple Hindi written in Devanagari" : "plain English";
  const prompt = `Explain this synthetic MGNREGA wage status in ${languageName}. Use 2 short sentences and one practical next step. Never invent a date, bank name, legal claim, or promise. Status: ${status}. Days worked: ${daysWorked}. Wage due: ₹${wageDue}. Attendance: ${attendance}. Reason code: ${reason}.`;

  try {
    const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-4.1-mini", input: prompt, max_output_tokens: 120 }),
    });
    const data = await openAiResponse.json();
    if (!openAiResponse.ok) return response.status(502).json({ configured: true, error: "OpenAI request failed" });
    const explanation = data.output_text || data.output?.flatMap((item) => item.content || []).find((item) => item.type === "output_text")?.text;
    return response.status(200).json({ configured: true, explanation: explanation || "No explanation returned." });
  } catch {
    return response.status(502).json({ configured: true, error: "OpenAI request failed" });
  }
}
