// ponytail: in-memory OTP store, single-process demo only; swap for Redis if you run >1 instance
// or deploy serverless (each lambda gets its own Map).
export const otps = new Map<string, string>();
