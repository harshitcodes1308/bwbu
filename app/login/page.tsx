"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { profiles } from "@/lib/profiles";
import { BrandHeader } from "@/components/BrandHeader";
import { Icon } from "@/components/icons";

export default function LoginPage() {
  const { t, language, profileIndex, setProfileIndex } = useApp();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [jobCard, setJobCard] = useState("");
  const [otp, setOtp] = useState("");
  const [otpStage, setOtpStage] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [busy, setBusy] = useState(false);

  const post = (path: string, body: unknown) => fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      if (!otpStage) {
        await post("/api/otp", { phone }); // server logs the code
        setOtpStage(true);
      } else {
        const { ok } = await (await post("/api/otp/verify", { phone, code: otp })).json();
        if (ok) router.push("/home");
        else setOtpError(true);
      }
    } finally {
      setBusy(false);
    }
  }

  const onBack = () => router.push("/");

  return (
    <main className="login-page">
      <div className="login-paper">
        <BrandHeader onHome={onBack} onBack={onBack} />
        <div className="login-hero">
          <div className="sun-mark" aria-hidden="true"><span /><span /><span /><span /></div>
          <h1>{t.signIn}</h1>
          <p className="hero-lead">{t.signInLead}</p>
        </div>
        <form className="login-form" onSubmit={submit}>
          {!otpStage ? (
            <>
              <label>{t.phone}<input inputMode="numeric" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t.phoneHint} required minLength={10} maxLength={10} /></label>
              <label>{t.jobCard}<input value={jobCard} onChange={(e) => setJobCard(e.target.value)} placeholder={t.jobHint} required /></label>
            </>
          ) : (
            <div className="otp-panel">
              <div className="otp-icon" aria-hidden="true"><span /></div>
              <div><strong>{t.otpTitle}</strong><p>{t.otpLead}</p></div>
              <input className="otp-input" inputMode="numeric" autoFocus placeholder="••••" aria-label={t.otpTitle} value={otp} onChange={(e) => { setOtp(e.target.value); setOtpError(false); }} required minLength={4} maxLength={4} />
              {otpError ? <p className="mock-otp">{t.otpError}</p> : <p className="mock-otp">{t.mockOtp}</p>}
            </div>
          )}
          <button className="primary-button" type="submit" disabled={busy} aria-busy={busy}>{otpStage ? t.verify : t.continue}<Icon name="arrow" /></button>
        </form>
        <div className="profile-picker" aria-label={t.demoProfiles}>
          <span>{t.demoProfiles}</span>
          <div>{profiles.map((profile, index) => <button type="button" key={profile.id} className={profileIndex === index ? "selected" : ""} aria-pressed={profileIndex === index} onClick={() => { setProfileIndex(index); setPhone(profile.phone); setJobCard(profile.jobCard); }}><strong>{profile.initials}</strong><small>{profile.name[language]}</small></button>)}</div>
        </div>
        <p className="synthetic-note"><span className="note-dot" aria-hidden="true" />{t.synthetic}</p>
      </div>
    </main>
  );
}
