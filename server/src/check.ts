import assert from "node:assert/strict";

async function main() {
  const { app } = await import("./index.js"); // dotenv loads .env here
  delete process.env.OPENAI_API_KEY; // route reads process.env live, so drop it now
  const srv = app.listen(0);
  const { port } = srv.address() as { port: number };
  const post = (body: unknown) =>
    fetch(`http://127.0.0.1:${port}/api/explain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  // No key configured → honest fallback, never a crash.
  let r = await post({ status: "delayed", daysWorked: 11, wageDue: 2530, attendance: "verified", reason: "x" });
  assert.equal(r.status, 200);
  assert.deepEqual(await r.json(), { configured: false });

  // Key present but fields missing → 400, no OpenAI call.
  process.env.OPENAI_API_KEY = "sk-test";
  r = await post({ status: "delayed" });
  assert.equal(r.status, 400);

  // OTP: request needs a phone; verify rejects a wrong/unknown code.
  const otp = (path: string, body: unknown) =>
    fetch(`http://127.0.0.1:${port}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  assert.equal((await otp("/api/otp", {})).status, 400);
  assert.equal((await otp("/api/otp", { phone: "999" })).status, 200);
  assert.deepEqual(await (await otp("/api/otp/verify", { phone: "999", code: "0000" })).json(), { ok: false });

  srv.close();
  console.log("server check passed");
}

main();
