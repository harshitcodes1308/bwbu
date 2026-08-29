import assert from "node:assert/strict";

// Exercise the API route handlers directly — no server to boot.
const req = (body: unknown) =>
  new Request("http://x/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

async function main() {
  delete process.env.OPENAI_API_KEY; // route reads process.env live, so drop it now
  const explain = (await import("../app/api/explain/route")).POST;
  const otpPost = (await import("../app/api/otp/route")).POST;
  const otpVerify = (await import("../app/api/otp/verify/route")).POST;

  // No key configured → honest fallback, never a crash.
  let r = await explain(req({ status: "delayed", daysWorked: 11, wageDue: 2530, attendance: "verified", reason: "x" }));
  assert.equal(r.status, 200);
  assert.deepEqual(await r.json(), { configured: false });

  // Key present but fields missing → 400, no OpenAI call.
  process.env.OPENAI_API_KEY = "sk-test";
  r = await explain(req({ status: "delayed" }));
  assert.equal(r.status, 400);

  // OTP: request needs a phone; verify rejects a wrong/unknown code.
  assert.equal((await otpPost(req({}))).status, 400);
  assert.equal((await otpPost(req({ phone: "999" }))).status, 200);
  assert.deepEqual(await (await otpVerify(req({ phone: "999", code: "0000" }))).json(), { ok: false });

  console.log("server check passed");
}

main();
