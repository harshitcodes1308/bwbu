import assert from "node:assert/strict";

// Exercise the API route handlers directly — no server to boot.
const req = (body: unknown) =>
  new Request("http://x/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

async function main() {
  delete process.env.OPENAI_API_KEY; // routes read process.env live; drop it so we test the no-key template path
  const explainWage = (await import("../app/api/explain-wage/route")).POST;
  const draftGrievance = (await import("../app/api/draft-grievance/route")).POST;
  const otpPost = (await import("../app/api/otp/route")).POST;
  const otpVerify = (await import("../app/api/otp/verify/route")).POST;

  // explain-wage: missing fields → 400.
  assert.equal((await explainWage(req({ locale: "hi", wageRecord: {} }))).status, 400);

  // explain-wage: no key → configured:false with a full synthetic explanation, never a crash.
  // Check the localized template path in EVERY language (offline fallback must never be blank).
  const { LANG_CODES: LC } = await import("../lib/languages");
  for (const l of LC) {
    const r = await (await explainWage(req({ locale: l, wageRecord: { daysWorked: 12, wageDue: 2568, reason: "verification_pending" } }))).json();
    assert.equal(r.configured, false, `${l}: no key → configured false`);
    assert.ok(r.summary && r.nextStep && r.disclaimer, `${l}: explain template must fill all three fields`);
    assert.ok(r.summary.includes("2,568"), `${l}: explain template must keep the amount, not drop it`);
    const g = await (await draftGrievance(req({ locale: l, issueType: "payment_not_received", workerStatement: "x", context: { workName: "w", daysWorked: 12, wageDue: 2568 } }))).json();
    assert.equal(g.configured, false, `${l}: no key → configured false`);
    assert.ok(g.subject && g.category && g.complaint && g.suggestedRecords?.length === 3, `${l}: grievance template must fill all fields`);
    assert.ok(g.complaint.includes("2,568"), `${l}: grievance template must keep the amount`);
  }
  const ex = await (await explainWage(req({ locale: "hi", wageRecord: { daysWorked: 12, wageDue: 2568, reason: "verification_pending" } }))).json();
  assert.equal(ex.configured, false);
  assert.ok(ex.summary && ex.nextStep && ex.disclaimer, "explain template must fill all three fields");

  // draft-grievance: no input → 400.
  assert.equal((await draftGrievance(req({ locale: "hi" }))).status, 400);

  // draft-grievance: no key → configured:false template with the four fields, preserving context amount.
  const dr = await (await draftGrievance(req({ locale: "hi", issueType: "payment_not_received", workerStatement: "12 दिन काम किया", context: { workName: "तालाब की मरम्मत", daysWorked: 12, wageDue: 2568 } }))).json();
  assert.equal(dr.configured, false);
  assert.ok(dr.subject && dr.category && dr.complaint && Array.isArray(dr.suggestedRecords), "draft template must fill all fields");
  assert.ok(dr.complaint.includes("2,568"), "draft must keep the synthetic amount, not invent one");

  // i18n parity: every language has every copy key, and every profile field is
  // filled in every language (a missing string would render blank in the UI).
  const { copy } = await import("../lib/copy");
  const { profiles } = await import("../lib/profiles");
  const { LANG_CODES } = await import("../lib/languages");
  const baseKeys = Object.keys(copy.hi);
  for (const l of LANG_CODES) {
    const keys = Object.keys((copy as any)[l]);
    assert.equal(keys.length, baseKeys.length, `${l}: copy key count mismatch`);
    for (const k of baseKeys) assert.ok((copy as any)[l][k]?.length > 0, `${l}: empty/missing copy key ${k}`);
  }
  for (const p of profiles) {
    for (const l of LANG_CODES) {
      for (const f of ["name", "village", "workName", "status", "detail"] as const)
        assert.ok((p as any)[f][l]?.length > 0, `${p.id}.${f} empty for ${l}`);
    }
  }
  assert.equal(LANG_CODES.length, 6, "expected 6 languages");

  // OTP: request needs a phone; verify rejects a wrong/unknown code.
  assert.equal((await otpPost(req({}))).status, 400);
  assert.equal((await otpPost(req({ phone: "999" }))).status, 200);
  assert.deepEqual(await (await otpVerify(req({ phone: "999", code: "0000" }))).json(), { ok: false });

  console.log("server check passed");
}

main();
