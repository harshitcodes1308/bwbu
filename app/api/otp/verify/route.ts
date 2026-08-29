import { NextResponse } from "next/server";
import { otps } from "@/lib/otp";

export async function POST(request: Request) {
  const { phone, code } = (await request.json().catch(() => ({}))) ?? {};
  // Demo: Accept 1234 as universal OTP for all profiles
  const isValid = !!phone && (code === "1234" || otps.get(phone) === code);
  return NextResponse.json({ ok: isValid });
}
