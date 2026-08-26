import "dotenv/config";
import express from "express";

export const app = express();
app.use(express.json());

// ponytail: in-memory OTP store, single-process demo only; swap for Redis if you run >1 instance.
const otps = new Map<string, string>();

app.post("/api/otp", (req, res) => {
  const { phone } = req.body ?? {};
  if (!phone) return res.status(400).json({ error: "phone required" });
  const code = String(Math.floor(1000 + Math.random() * 9000));
  otps.set(phone, code);
  console.log(`\n📱 Demo OTP for ${phone}: ${code}\n`);
  res.json({ sent: true });
});

app.post("/api/otp/verify", (req, res) => {
  const { phone, code } = req.body ?? {};
  res.json({ ok: !!phone && otps.get(phone) === code });
});

app.post("/api/explain", async (req, res) => {
  if (!process.env.OPENAI_API_KEY) return res.status(200).json({ configured: false });

  const { status, daysWorked, wageDue, attendance, reason, language = "hi" } = req.body ?? {};
  if (!status || daysWorked == null || wageDue == null || !attendance || !reason)
    return res.status(400).json({ error: "Missing wage status fields" });

  const languageName = language === "hi" ? "simple Hindi written in Devanagari" : "plain English";
  const prompt = `Explain this synthetic MGNREGA wage status in ${languageName}. Use 2 short sentences and one practical next step. Never invent a date, bank name, legal claim, or promise. Status: ${status}. Days worked: ${daysWorked}. Wage due: ₹${wageDue}. Attendance: ${attendance}. Reason code: ${reason}.`;

  try {
    const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-4.1-mini", input: prompt, max_output_tokens: 120 }),
    });
    const data: any = await openAiResponse.json();
    if (!openAiResponse.ok) return res.status(502).json({ configured: true, error: "OpenAI request failed" });
    const explanation = data.output_text || data.output?.flatMap((item: any) => item.content || []).find((item: any) => item.type === "output_text")?.text;
    return res.status(200).json({ configured: true, explanation: explanation || "No explanation returned." });
  } catch {
    return res.status(502).json({ configured: true, error: "OpenAI request failed" });
  }
});

// Don't listen when imported by the self-check.
if (process.env.NODE_ENV !== "test") {
  // ponytail: fixed dev port matching the client proxy; set an explicit host/port if you deploy the server standalone.
  app.listen(8787, "127.0.0.1", () => console.log("api on http://127.0.0.1:8787"));
}
