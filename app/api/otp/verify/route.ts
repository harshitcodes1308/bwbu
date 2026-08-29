import { NextResponse } from "next/server";
import { otps } from "@/lib/otp";

export async function POST(request: Request) {
  const { phone, code } = (await request.json().catch(() => ({}))) ?? {};
  return NextResponse.json({ ok: !!phone && otps.get(phone) === code });
}
