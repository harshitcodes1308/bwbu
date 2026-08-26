import handler from "../api/explain.js";

const request = { method: "POST", body: { status: "wage_processing", daysWorked: 11, wageDue: 2530, attendance: "verified", reason: "fund_release_pending", language: "hi" } };
let result;
const response = { status(code) { result = { code }; return this; }, json(body) { result.body = body; return this; } };
await handler(request, response);
if (result.code !== 200 || result.body.configured !== false) throw new Error("Missing-key fallback failed");
const zeroRequest = { method: "POST", body: { status: "new", daysWorked: 0, wageDue: 0, attendance: "pending", reason: "new", language: "hi" } };
let zeroResult;
const zeroResponse = { status(code) { zeroResult = { code }; return this; }, json(body) { zeroResult.body = body; return this; } };
await handler(zeroRequest, zeroResponse);
if (zeroResult.code !== 200 || zeroResult.body.configured !== false) throw new Error("Zero-value wage status rejected");
console.log("API fallback check passed");
