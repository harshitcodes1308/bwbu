import { NextResponse } from "next/server";
import { otps } from "@/lib/otp";

export async function POST(request: Request) {
  const { phone } = (await request.json().catch(() => ({}))) ?? {};
  if (!phone) return NextResponse.json({ error: "phone required" }, { status: 400 });
  const code = "1234"; // Mock OTP for all profiles
  otps.set(phone, code);
  console.log(`\n📱 Demo OTP for ${phone}: ${code}\n`);
  return NextResponse.json({ sent: true });
}
