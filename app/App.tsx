"use client";

import React, { useEffect, useMemo, useState } from "react";

const copy = {
  hi: {
    brand: "मेरा रोज़गार",
    brandSub: "काम और मज़दूरी की साफ़ जानकारी",
    landingPromise: "आपका काम, आपकी मज़दूरी: एक जगह, साफ़ भाषा में",
    landingCta: "अपना हाल देखें",
    landingWhy: "यह क्यों बनाया?",
    landingHeroAlt: "फोन पर अपना काम देखती हुई एक महिला मज़दूर",
    heroCaption: "सुनीता देवी • डेमो प्रोफ़ाइल",
    heroStatus: "11 दिन • ₹2,530 • मज़दूरी अभी रुकी है",
    statWorkers: "देश में करोड़ों परिवार इस काम से जुड़े हैं",
    statGuarantee: "आप साल में 100 दिन काम मांग सकते हैं",
    statDirect: "मज़दूरी सीधे बैंक खाते में आती है",
    whyTitle: "क्यों बनाया",
    whyLead: "आपकी जानकारी आपके हाथ में होनी चाहिए।",
    officialLabel: "सरकारी पोर्टल",
    productLabel: "मेरा रोज़गार",
    contrastLanguage: "भारी भाषा → साफ़ हिंदी",
    contrastAccess: "मध्यस्थ का इंतज़ार → खुद देखें",
    contrastDelay: "देरी का अंदाज़ा → देरी की वजह",
    recordTitle: "काम का साफ़ रिकॉर्ड",
    recordAttendance: "हाज़िरी",
    recordAttendanceValue: "11 दिन दर्ज",
    recordWage: "कुल मज़दूरी",
    recordDelay: "भुगतान की स्थिति",
    recordDelayValue: "पंचायत के फंड का इंतज़ार",
    howTitle: "तीन आसान कदम",
    howLead: "पहले समझें, फिर अपना अगला कदम चुनें।",
    howStep1: "अपना हाल देखें",
    howStep1Detail: "जॉब कार्ड से शुरुआत",
    howStep2: "काम और मज़दूरी समझें",
    howStep2Detail: "हर पायदान साफ़ दिखे",
    howStep3: "ज़रूरत हो तो आवाज़ उठाएं",
    howStep3Detail: "शिकायत का नंबर साथ रखें",
    howAsideTitle: "देरी की वजह, साफ़ भाषा में",
    howAsideBody: "OpenAI इस डेमो रिकॉर्ड से बताता है कि पैसा क्यों रुका है और आगे क्या किया जा सकता है।",
    finalCta: "अपना काम और मज़दूरी, अब खुद समझें",
    trustPrototype: "हैकाथॉन प्रोटोटाइप",
    trustMock: "सारी जानकारी बनाई गई डेमो है",
    trustOfficial: "यह सरकारी वेबसाइट नहीं है",
    navLabel: "मुख्य नेविगेशन",
    english: "English",
    hindi: "हिन्दी",
    signIn: "अपना हाल देखें",
    signInLead: "जॉब कार्ड से अपने काम और मज़दूरी की जानकारी पाएं।",
    phone: "मोबाइल नंबर",
    jobCard: "जॉब कार्ड नंबर",
    phoneHint: "10 अंकों का मोबाइल नंबर",
    jobHint: "उदाहरण: UP-41-000-982",
    continue: "आगे बढ़ें",
    otpServerHint: "यह डेमो है। कोड सर्वर लॉग में दिखेगा, वहीं से डालें।",
    otpError: "कोड गलत है। सर्वर लॉग से सही कोड डालें।",
    otpTitle: "OTP डालें",
    otpLead: "यह डेमो है। असली SMS नहीं भेजा जाएगा।",
    verify: "देखना शुरू करें",
    synthetic: "यहां दिखाई गई हर जानकारी डेमो के लिए बनाई गई है। इसमें असली आधार, बैंक या OTP नहीं है।",
    home: "होम",
    track: "ट्रैक",
    grievance: "शिकायत",
    profile: "प्रोफ़ाइल",
    greeting: "नमस्ते, सुनीता",
    village: "मझगवां, चित्रकूट",
    lastUpdated: "आखिरी जानकारी 25 अगस्त को",
    workMoving: "आपका काम आगे बढ़ रहा है",
    workMovingBody: "हाज़िरी दर्ज हो गई है। मज़दूरी अब बन रही है।",
    days: "काम के दिन",
    due: "मज़दूरी",
    dueValue: "₹2,530",
    card: "जॉब कार्ड",
    cardValue: "UP-41…982",
    wagePaid: "मिली मज़दूरी",
    notPaidYet: "अभी नहीं मिली",
    ladderTitle: "काम की सीढ़ी",
    ladderSub: "हर पायदान पर एक साफ़ बात",
    applied: "आवेदन मिल गया",
    appliedDate: "12 अगस्त",
    allotted: "काम दिया गया",
    allottedDate: "15 अगस्त",
    attendance: "हाज़िरी दर्ज हुई",
    attendanceDate: "24 अगस्त",
    processing: "मज़दूरी बन रही है",
    processingDate: "अभी यही चरण है",
    paid: "पैसा खाते में आया",
    paidDate: "अगला चरण",
    next: "अब क्या करें",
    wageDetails: "मज़दूरी का पूरा हिसाब",
    wageReason: "मज़दूरी क्यों रुकी है?",
    wageReasonBody: "आपकी हाज़िरी की जांच पूरी है। पंचायत से फंड रिलीज़ होने का इंतज़ार है।",
    explainWithAi: "आसान भाषा में समझाएं",
    askAi: "OpenAI से समझें",
    aiLoading: "समझ रहा है…",
    aiUnavailable: "OpenAI explainer अभी जुड़ा नहीं है। API key लगने पर यह इसी बनाई गई डेमो स्थिति को समझाएगा।",
    aiError: "अभी आसान जवाब नहीं बन पाया। थोड़ी देर बाद फिर कोशिश करें।",
    demand: "काम मांगें",
    demandBody: "जब काम चाहिए, तारीख और दिन बता दें।",
    demandVillage: "गांव",
    demandStart: "काम शुरू करने की तारीख",
    demandDays: "कितने दिन काम चाहिए?",
    submitDemand: "काम का आवेदन भेजें",
    demandSent: "आवेदन पहुंच गया",
    demandSentBody: "आपका आवेदन नंबर MR-2026-184 है। पंचायत से जवाब आने पर यहां दिखेगा।",
    grievanceTitle: "शिकायत बताएं",
    grievanceLead: "एक बात चुनें। हम उसे साफ़ शिकायत में बदल देंगे।",
    moneyMissing: "मेरा पैसा नहीं मिला",
    workMissing: "मुझे काम नहीं मिला",
    wrongAttendance: "मेरी हाज़िरी गलत है",
    grievanceDraft: "आपकी शिकायत तैयार है",
    grievanceDraftBody: "आपकी बात को छोटा और साफ़ करके भेजने के लिए तैयार किया है।",
    sendGrievance: "शिकायत भेजें",
    grievanceSent: "शिकायत दर्ज हो गई",
    grievanceId: "ट्रैकिंग नंबर GR-2026-047",
    grievanceTrack: "शिकायत की सीढ़ी",
    grievanceStep1: "शिकायत पहुंची",
    grievanceStep2: "पंचायत को भेजी",
    grievanceStep3: "जांच चल रही है",
    grievanceStep4: "जवाब मिलेगा",
    profileTitle: "आपकी जानकारी",
    profileName: "सुनीता देवी",
    profileCard: "जॉब कार्ड UP-41-000-982",
    profileNote: "डेमो प्रोफ़ाइल • असली पहचान नहीं",
    back: "पीछे",
    homeAction: "घर",
    voiceNote: "बोलकर बताएं",
    listening: "सुन रहा है…",
    rate: "दैनिक मज़दूरी",
    verified: "जांच पूरी",
    pending: "जांच बाकी",
    paymentRoute: "पैसा आने का तरीका",
    bankTransfer: "बैंक में भुगतान",
    demoOnly: "सिर्फ डेमो",
    dataLabel: "जानकारी",
    versionLabel: "संस्करण",
    syntheticDemo: "बनाई गई डेमो जानकारी",
    hackathonBuild: "हैकाथॉन प्रोटोटाइप",
    demo: "डेमो",
    date25: "25 अगस्त",
    nextStep: "अगला चरण",
    inReview: "अभी जांच चल रही है",
    paidReason: "आपकी मज़दूरी आ गई है",
    newReason: "मज़दूरी अभी क्यों नहीं बनी?",
    reviewReason: "कौन-सी जांच चल रही है?",
    notStarted: "अभी शुरू नहीं हुआ",
  },
  en: {
    brand: "Mera Rozgar",
    brandSub: "Clear answers about work and wages",
    landingPromise: "Your work and wages: in one place, in plain language",
    landingCta: "See your status",
    landingWhy: "Why this exists",
    landingHeroAlt: "A woman worker checking her work on a phone",
    heroCaption: "Sunita Devi • Demo profile",
    heroStatus: "11 days • ₹2,530 • wage is waiting",
    statWorkers: "Crores of families depend on this work across India",
    statGuarantee: "You can ask for up to 100 days of work each year",
    statDirect: "Your wage is sent directly to your bank account",
    whyTitle: "Why this exists",
    whyLead: "Your information should stay in your hands.",
    officialLabel: "Government portal",
    productLabel: "Mera Rozgar",
    contrastLanguage: "Heavy language → Clear words",
    contrastAccess: "Wait for a middleman → Check it yourself",
    contrastDelay: "Guess at a delay → See the reason",
    recordTitle: "A clear work record",
    recordAttendance: "Attendance",
    recordAttendanceValue: "11 days recorded",
    recordWage: "Total wage",
    recordDelay: "Payment status",
    recordDelayValue: "Waiting for panchayat funds",
    howTitle: "Three clear steps",
    howLead: "Understand what is happening, then choose what to do next.",
    howStep1: "See your status",
    howStep1Detail: "Start with your job card",
    howStep2: "Understand work and wages",
    howStep2Detail: "See every step clearly",
    howStep3: "Speak up when needed",
    howStep3Detail: "Keep your tracking number",
    howAsideTitle: "The delay, in plain language",
    howAsideBody: "OpenAI uses this demo record to explain why the wage is waiting and what the worker can do next.",
    finalCta: "Understand your work and wages for yourself",
    trustPrototype: "Hackathon prototype",
    trustMock: "All information is synthetic demo data",
    trustOfficial: "This is not an official government website",
    navLabel: "Primary navigation",
    english: "English",
    hindi: "हिन्दी",
    signIn: "See your status",
    signInLead: "Use your job card to see work and wage information.",
    phone: "Mobile number",
    jobCard: "Job card number",
    phoneHint: "10-digit mobile number",
    jobHint: "Example: UP-41-000-982",
    continue: "Continue",
    otpServerHint: "This is a demo. The code prints in the server log — read it there.",
    otpError: "Wrong code. Check the server log for the right one.",
    otpTitle: "Enter OTP",
    otpLead: "This is a demo. No real SMS will be sent.",
    verify: "Start viewing",
    synthetic: "Every detail here is synthetic demo data. No real Aadhaar, bank or OTP data is used.",
    home: "Home",
    track: "Track",
    grievance: "Grievance",
    profile: "Profile",
    greeting: "Namaste, Sunita",
    village: "Majhgawan, Chitrakoot",
    lastUpdated: "Last updated 25 August",
    workMoving: "Your work is moving",
    workMovingBody: "Attendance is recorded. Your wage is now being processed.",
    days: "Work days",
    due: "Wage",
    dueValue: "₹2,530",
    card: "Job card",
    cardValue: "UP-41…982",
    wagePaid: "Wage paid",
    notPaidYet: "Not paid yet",
    ladderTitle: "Your work ladder",
    ladderSub: "One clear line for every step",
    applied: "Application received",
    appliedDate: "12 Aug",
    allotted: "Work allotted",
    allottedDate: "15 Aug",
    attendance: "Attendance recorded",
    attendanceDate: "24 Aug",
    processing: "Wage processing",
    processingDate: "You are here",
    paid: "Wage paid",
    paidDate: "Next step",
    next: "What you can do now",
    wageDetails: "See wage details",
    wageReason: "Why is the wage waiting?",
    wageReasonBody: "Attendance checks are complete. The panchayat is waiting for funds to be released.",
    explainWithAi: "Explain this simply",
    askAi: "Explain with OpenAI",
    aiLoading: "Explaining…",
    aiUnavailable: "The OpenAI explainer is not connected yet. Add an API key and it will explain this same synthetic demo status.",
    aiError: "A simple explanation could not be created right now. Please try again shortly.",
    demand: "Ask for work",
    demandBody: "Tell us your dates and how many days you need.",
    demandVillage: "Village",
    demandStart: "Start date",
    demandDays: "How many days do you need?",
    submitDemand: "Send work request",
    demandSent: "Request received",
    demandSentBody: "Your request number is MR-2026-184. We will show the reply here.",
    grievanceTitle: "Tell us what went wrong",
    grievanceLead: "Choose one line. We will turn it into a clear grievance.",
    moneyMissing: "My wage has not arrived",
    workMissing: "I did not get work",
    wrongAttendance: "My attendance is wrong",
    grievanceDraft: "Your grievance is ready",
    grievanceDraftBody: "We made your words short and clear so they are easy to send.",
    sendGrievance: "Send grievance",
    grievanceSent: "Grievance recorded",
    grievanceId: "Tracking number GR-2026-047",
    grievanceTrack: "Your grievance ladder",
    grievanceStep1: "Grievance received",
    grievanceStep2: "Sent to panchayat",
    grievanceStep3: "Review in progress",
    grievanceStep4: "Reply due",
    profileTitle: "Your details",
    profileName: "Sunita Devi",
    profileCard: "Job card UP-41-000-982",
    profileNote: "Demo profile • not a real identity",
    back: "Back",
    homeAction: "Home",
    voiceNote: "Tell us by voice",
    listening: "Listening…",
    rate: "Daily wage",
    verified: "Verified",
    pending: "Pending",
    paymentRoute: "Payment route",
    bankTransfer: "Bank transfer",
    demoOnly: "Demo only",
    dataLabel: "Data",
    versionLabel: "Version",
    syntheticDemo: "Synthetic demo data",
    hackathonBuild: "Hackathon prototype",
    demo: "Demo",
    date25: "25 Aug",
    nextStep: "Next step",
    inReview: "Review in progress",
    paidReason: "Your wage has arrived",
    newReason: "Why is there no wage yet?",
    reviewReason: "What is being reviewed?",
    notStarted: "Not started yet",
  },
};

type Lang = keyof typeof copy;
type Copy = typeof copy.hi;
type Screen = (typeof routes)[number];

const jobs = ["applied", "allotted", "attendance", "processing", "paid"] as const;

// Clean-path routing (/login, /home, /wage…) via the History API so every
// screen has a real URL and browser Back/Forward work. #why-made stays an
// in-page anchor on whatever path you're on.
const routes = ["landing", "login", "home", "track", "wage", "demand", "grievance", "grievance-status", "profile"] as const;
function pathToScreen(): Screen {
  const s = window.location.pathname.replace(/^\/+/, "") || "landing";
  return (routes as readonly string[]).includes(s) ? (s as Screen) : "landing";
}

type Profile = {
  id: string;
  name: Record<Lang, string>;
  village: Record<Lang, string>;
  initials: string;
  jobCard: string;
  phone: string;
  days: number;
  wage: number;
  wagePaid: number;
  step: number;
  tone: string;
  status: Record<Lang, string>;
  detail: Record<Lang, string>;
};

const profiles: Profile[] = [
  {
    id: "delayed",
    name: { hi: "सुनीता देवी", en: "Sunita Devi" },
    village: { hi: "मझगवां, चित्रकूट", en: "Majhgawan, Chitrakoot" },
    initials: "स",
    jobCard: "UP-41-000-982",
    phone: "9876543210",
    days: 11,
    wage: 2530,
    wagePaid: 0,
    step: 3,
    tone: "delayed",
    status: { hi: "आपका पैसा 12 दिन से रुका है", en: "Your wage has waited for 12 days" },
    detail: { hi: "हाज़िरी की जांच पूरी है। पंचायत को फंड मिलने का इंतज़ार है।", en: "Attendance checks are complete. The panchayat is waiting for funds." },
  },
  {
    id: "paid",
    name: { hi: "रवि कुमार", en: "Ravi Kumar" },
    village: { hi: "कर्वी, चित्रकूट", en: "Karwi, Chitrakoot" },
    initials: "र",
    jobCard: "UP-41-000-614",
    phone: "9876500614",
    days: 17,
    wage: 3910,
    wagePaid: 3910,
    step: 4,
    tone: "paid",
    status: { hi: "आपकी पूरी मज़दूरी आ गई", en: "Your full wage has arrived" },
    detail: { hi: "17 दिन की मज़दूरी बैंक खाते में भेज दी गई है।", en: "Wages for 17 days were sent to the bank account." },
  },
  {
    id: "grievance",
    name: { hi: "मीना कोल", en: "Meena Kol" },
    village: { hi: "मानिकपुर, चित्रकूट", en: "Manikpur, Chitrakoot" },
    initials: "म",
    jobCard: "UP-41-000-327",
    phone: "9876500327",
    days: 8,
    wage: 1840,
    wagePaid: 0,
    step: 2,
    tone: "grievance",
    status: { hi: "आपकी हाज़िरी की शिकायत चल रही है", en: "Your attendance grievance is in review" },
    detail: { hi: "शिकायत पंचायत को भेज दी गई है। जांच अभी चल रही है।", en: "The grievance was sent to the panchayat and is being reviewed." },
  },
  {
    id: "new",
    name: { hi: "आशा पाल", en: "Asha Pal" },
    village: { hi: "पहाड़ी, चित्रकूट", en: "Pahari, Chitrakoot" },
    initials: "आ",
    jobCard: "UP-41-000-845",
    phone: "9876500845",
    days: 0,
    wage: 0,
    wagePaid: 0,
    step: 0,
    tone: "new",
    status: { hi: "आपका नया आवेदन मिल गया", en: "Your new application was received" },
    detail: { hi: "अब पंचायत काम देने की तारीख बताएगी।", en: "The panchayat will now provide a work date." },
  },
];

function Icon({ name }: { name: string }) {
  return <span className={`icon icon-${name}`} aria-hidden="true" />;
}

function LanguageSwitch({ language, setLanguage }: { language: Lang; setLanguage: (l: Lang) => void; t?: Copy }) {
  const next = language === "hi" ? "en" : "hi";
  return (
    <button className="language-switch" type="button" onClick={() => setLanguage(next)} aria-label={language === "hi" ? "Switch to English" : "हिन्दी में बदलें"}>
      <span className={language === "hi" ? "active" : ""}>हिन्दी</span>
      <span className="switch-divider" aria-hidden="true">/</span>
      <span className={language === "en" ? "active" : ""}>English</span>
    </button>
  );
}

function BrandHeader({ language, setLanguage, t, compact = false, onHome, onBack }: { language: Lang; setLanguage: (l: Lang) => void; t: Copy; compact?: boolean; onHome?: () => void; onBack?: () => void }) {
  return (
    <header className={`brand-header ${compact ? "compact" : ""}`}>
      <div className="brand-left">
        {onBack && <button className="back-button header-back" type="button" onClick={onBack} aria-label={t.back}><Icon name="back" /></button>}
        <button className="brand-lockup" type="button" onClick={onHome} disabled={!onHome} aria-label={t.brand}>
          <span className="brand-seal" aria-hidden="true"><span /></span>
          <div>
            <p className="brand-name">{t.brand}</p>
            {!compact && <p className="brand-sub">{t.brandSub}</p>}
          </div>
        </button>
      </div>
      <LanguageSwitch language={language} setLanguage={setLanguage} t={t} />
    </header>
  );
}

function WorkerVisual({ t }: { t: Copy }) {
  return (
    <figure className="worker-visual">
      <img className="hero-photo" src="/images/worker-field.png" width="900" height="1125" alt={t.landingHeroAlt} fetchPriority="high" />
      <div className="worker-visual__meta">
        <p className="hero-status">{t.heroStatus}</p>
        <figcaption className="hero-caption">{t.heroCaption}</figcaption>
      </div>
    </figure>
  );
}

function Landing({ t, language, setLanguage, onContinue, onHome }: { t: Copy; language: Lang; setLanguage: (l: Lang) => void; onContinue: () => void; onHome: () => void }) {
  return (
    <main className="landing-page">
      <BrandHeader language={language} setLanguage={setLanguage} t={t} onHome={onHome} />
      <div className="landing-wrap">
        <section className="landing-hero">
          <div className="landing-hero-copy">
            <h1>{t.brand}</h1>
            <p className="landing-promise">{t.landingPromise}</p>
            <div className="landing-actions"><button className="primary-button" type="button" onClick={onContinue}>{t.landingCta}<Icon name="arrow" /></button><a href="#why-made">{t.landingWhy}<Icon name="arrow-down" /></a></div>
          </div>
          <WorkerVisual t={t} />
        </section>

        <section className="landing-facts" aria-label={language === "hi" ? "ज़रूरी बातें" : "Important facts"}>
          {[t.statWorkers, t.statGuarantee, t.statDirect].map((fact) => <div className="fact-line" key={fact}><p>{fact}</p></div>)}
        </section>

        <section className="why-made" id="why-made">
          <div className="landing-section-intro"><h2>{t.whyTitle}</h2><p>{t.whyLead}</p></div>
          <div className="why-made-body">
            <div className="contrast-grid"><div className="contrast-col official"><h3>{t.officialLabel}</h3><p>{t.contrastLanguage.split(" → ")[0]}</p><p>{t.contrastAccess.split(" → ")[0]}</p><p>{t.contrastDelay.split(" → ")[0]}</p></div><div className="contrast-col product"><h3>{t.productLabel}</h3><p>{t.contrastLanguage.split(" → ")[1]}</p><p>{t.contrastAccess.split(" → ")[1]}</p><p>{t.contrastDelay.split(" → ")[1]}</p></div></div>
            <aside className="record-artifact" aria-label={t.recordTitle}>
              <div className="record-artifact-head"><div><p className="record-artifact-label">{t.recordTitle}</p><small>{t.heroCaption}</small></div><span className="record-artifact-stamp">{t.demo}</span></div>
              <div className="record-row"><span>{t.recordAttendance}</span><strong className="record-value">{t.recordAttendanceValue}</strong></div>
              <div className="record-row"><span>{t.recordWage}</span><strong className="record-value">₹2,530</strong></div>
              <div className="record-row"><span>{t.recordDelay}</span><strong className="record-status">{t.recordDelayValue}</strong></div>
            </aside>
          </div>
        </section>

        <section className="how-section">
          <div className="how-copy"><div className="landing-section-intro"><h2>{t.howTitle}</h2><p>{t.howLead}</p></div><Ladder t={t} compact preview /></div>
          <aside className="how-artifact" aria-label={t.howAsideTitle}>
            <h3>{t.howAsideTitle}</h3>
            <div className="artifact-row"><span>{t.recordAttendance}</span><strong>{t.recordAttendanceValue}</strong></div>
            <div className="artifact-row"><span>{t.recordWage}</span><strong>₹2,530</strong></div>
            <div className="artifact-row"><span>{t.recordDelay}</span><strong>{t.recordDelayValue}</strong></div>
            <div className="artifact-note"><span className="ai-spark" aria-hidden="true" /><div><strong>OpenAI</strong><p>{t.howAsideBody}</p></div></div>
          </aside>
        </section>

        <section className="final-cta"><div className="final-cta-copy"><h2>{t.finalCta}</h2><p>{t.landingPromise}</p></div><button className="primary-button final-cta-action" type="button" onClick={onContinue}>{t.landingCta}<Icon name="arrow" /></button></section>
        <footer className="trust-footer"><span>{t.trustPrototype}</span><span>{t.trustMock}</span><span>{t.trustOfficial}</span></footer>
      </div>
    </main>
  );
}

const ladderIcons = ["document", "briefcase", "check", "rupee", "paid"];

function Ladder({ t, compact = false, grievance = false, currentStep = 3, preview = false }: { t: Copy; compact?: boolean; grievance?: boolean; currentStep?: number; preview?: boolean }) {
  const source: [string, string][] = grievance
    ? [[t.grievanceStep1, t.date25], [t.grievanceStep2, t.date25], [t.grievanceStep3, t.inReview], [t.grievanceStep4, t.nextStep]]
    : preview
      ? [[t.howStep1, t.howStep1Detail], [t.howStep2, t.howStep2Detail], [t.howStep3, t.howStep3Detail]]
      : jobs.map((key) => [t[key], t[`${key}Date` as keyof Copy]] as [string, string]);
  const effectiveStep = grievance ? 2 : currentStep;
  const steps = source.map(([title, detail], index) => {
    const last = source.length - 1;
    const status = preview ? (index === 0 ? "current" : "future") : effectiveStep === last && index <= effectiveStep ? "done" : index < effectiveStep ? "done" : index === effectiveStep ? "current" : "future";
    return [title, detail, status, ladderIcons[index] || "document"] as [string, string, string, string];
  });

  return (
    <ol className={`ladder ${compact ? "compact-ladder" : ""}`} aria-label={grievance ? t.grievanceTrack : t.ladderTitle}>
      {steps.map(([title, detail, tone, icon], index) => (
        <li className={`ladder-step ${tone} ${tone === "current" ? "climbed" : ""}`} key={`${title}-${index}`} aria-current={tone === "current" ? "step" : undefined}>
          <div className="rung" aria-hidden="true"><Icon name={tone === "done" ? (index === source.length - 1 ? "paid" : "check") : tone === "current" ? (icon === "check" ? "progress" : icon) : "lock"} /></div>
          <div className="step-copy">
            <strong>{title}</strong>
            <span>{detail}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}

function NavIcon({ name }: { name: string }) {
  const p = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (name === "home") return <svg {...p}><path d="M3 10.5 12 3l9 7.5" /><path d="M5.5 9.5V20a1 1 0 0 0 1 1H17.5a1 1 0 0 0 1-1V9.5" /></svg>;
  if (name === "track") return <svg {...p}><circle cx="4" cy="6" r="1.5" /><circle cx="4" cy="12" r="1.5" /><circle cx="4" cy="18" r="1.5" /><path d="M9 6h11M9 12h11M9 18h11" /></svg>;
  if (name === "grievance") return <svg {...p}><path d="M20 11.5a8 8 0 0 1-11.6 7.1L4 20l1.4-4.2A8 8 0 1 1 20 11.5Z" /><path d="M12 8.5v3.5" /><path d="M12 15.5h.01" /></svg>;
  return <svg {...p}><circle cx="12" cy="8.5" r="3.5" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></svg>;
}

function BottomNav({ screen, setScreen, t }: { screen: string; setScreen: (s: Screen) => void; t: Copy }) {
  const items: [Screen, string][] = [["home", t.home], ["track", t.track], ["grievance", t.grievance], ["profile", t.profile]];
  return (
    <nav className="bottom-nav" aria-label={t.navLabel}>
      {items.map(([key, label]) => (
        <button className={screen === key ? "selected" : ""} type="button" key={key} onClick={() => setScreen(key)} aria-current={screen === key ? "page" : undefined}>
          <NavIcon name={key} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

function Login({ t, language, setLanguage, onLogin, onBack, profileIndex, setProfileIndex }: { t: Copy; language: Lang; setLanguage: (l: Lang) => void; onLogin: () => void; onBack: () => void; profileIndex: number; setProfileIndex: (i: number) => void }) {
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
        if (ok) onLogin();
        else setOtpError(true);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-paper">
        <BrandHeader language={language} setLanguage={setLanguage} t={t} onHome={onBack} onBack={onBack} />
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
              {otpError && <p className="mock-otp">{t.otpError}</p>}
            </div>
          )}
          <button className="primary-button" type="submit" disabled={busy} aria-busy={busy}>{otpStage ? t.verify : t.continue}<Icon name="arrow" /></button>
        </form>
        <div className="profile-picker" aria-label={language === "hi" ? "डेमो प्रोफ़ाइल" : "Demo profiles"}>
          <span>{language === "hi" ? "डेमो प्रोफ़ाइल" : "Demo profiles"}</span>
          <div>{profiles.map((profile, index) => <button type="button" key={profile.id} className={profileIndex === index ? "selected" : ""} aria-pressed={profileIndex === index} onClick={() => { setProfileIndex(index); setPhone(profile.phone); setJobCard(profile.jobCard); }}><strong>{profile.initials}</strong><small>{profile.name[language]}</small></button>)}</div>
        </div>
        <p className="synthetic-note"><span className="note-dot" aria-hidden="true" />{t.synthetic}</p>
      </div>
    </main>
  );
}

function SummaryCard({ t, onOpenWage, profile, language }: { t: Copy; onOpenWage: () => void; profile: Profile; language: Lang }) {
  return (
    <section className="summary-card">
      <div className="summary-topline"><span className={`status-chip ${profile.tone}`}><span />{profile.tone === "paid" ? t.paid : profile.tone === "new" ? t.applied : profile.tone === "grievance" ? t.grievanceStep3 : t.processing}</span><span className="updated">{t.lastUpdated}</span></div>
      <h2>{profile.status[language]}</h2>
      <p>{profile.detail[language]}</p>
      <div className="summary-stats">
        <div><span>{t.days}</span><strong>{profile.days}</strong></div>
        <div><span>{t.due}</span><strong>₹{profile.wage.toLocaleString("en-IN")}</strong></div>
        <div><span>{t.card}</span><strong>{profile.jobCard.slice(0, 5)}…{profile.jobCard.slice(-3)}</strong></div>
      </div>
      <button className="text-button" type="button" onClick={onOpenWage}>{t.wageDetails}<Icon name="arrow" /></button>
    </section>
  );
}

function Home({ t, setScreen, profile, language }: { t: Copy; setScreen: (s: Screen) => void; profile: Profile; language: Lang }) {
  return (
    <div className="app-page">
      <div className="page-width">
        <div className="topbar"><div><p className="page-kicker">{profile.village[language]}</p><h1 data-page-title tabIndex={-1}>{language === "hi" ? `नमस्ते, ${profile.name.hi.split(" ")[0]}` : `Namaste, ${profile.name.en.split(" ")[0]}`}</h1></div><div className="avatar" aria-label={profile.name[language]}>{profile.initials}</div></div>
        <SummaryCard t={t} profile={profile} language={language} onOpenWage={() => setScreen("wage")} />
        <section className="home-section">
          <div className="section-heading"><div><h2>{t.next}</h2><p>{t.demandBody}</p></div></div>
          <div className="action-grid">
            <button className="action-tile primary-tile" type="button" onClick={() => setScreen("demand")}><span className="tile-mark"><Icon name="plus" /></span><strong>{t.demand}</strong><span>{t.demandBody}</span></button>
            <button className="action-tile" type="button" onClick={() => setScreen("grievance")}><span className="tile-mark alert-mark"><Icon name="alert" /></span><strong>{t.grievance}</strong><span>{t.grievanceLead}</span></button>
          </div>
        </section>
        <section className="ladder-section preview-ladder-section">
          <div className="section-heading"><div><h2>{t.ladderTitle}</h2><p>{t.ladderSub}</p></div><button className="round-arrow" type="button" onClick={() => setScreen("track")} aria-label={t.track}><Icon name="arrow" /></button></div>
          <Ladder t={t} compact currentStep={profile.step} />
        </section>
      </div>
    </div>
  );
}

function Track({ t, setScreen, profile, language }: { t: Copy; setScreen: (s: Screen) => void; profile: Profile; language: Lang }) {
  return (
    <div className="app-page"><div className="page-width narrow-page">
      <PageTitle title={t.track} subtitle={t.ladderSub} t={t} onBack={() => setScreen("home")} />
      <section className="feature-panel track-panel"><div className="panel-label">MR-2026-{profile.jobCard.slice(-3)}</div><h2>{profile.status[language]}</h2><p>{profile.detail[language]}</p><Ladder t={t} currentStep={profile.step} /></section>
      <button className="wide-outline-button" type="button" onClick={() => setScreen("wage")}><Icon name="rupee" />{t.wageDetails}<Icon name="arrow" /></button>
      <button className="wide-outline-button" type="button" onClick={() => setScreen("demand")}><Icon name="plus" />{t.demand}<Icon name="arrow" /></button>
    </div></div>
  );
}

function Wage({ t, setScreen, language, profile }: { t: Copy; setScreen: (s: Screen) => void; language: Lang; profile: Profile }) {
  const [explain, setExplain] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const reasonTitle = profile.tone === "paid" ? t.paidReason : profile.tone === "new" ? t.newReason : profile.tone === "grievance" ? t.reviewReason : t.wageReason;

  async function askOpenAI() {
    setLoading(true);
    try {
      const response = await fetch("/api/explain", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: profile.id, daysWorked: profile.days, wageDue: profile.wage, attendance: profile.step > 1 ? "verified" : "pending", reason: profile.tone === "delayed" ? "fund_release_pending" : profile.tone, language }) });
      const data = await response.json();
      setExplain(!data.configured ? t.aiUnavailable : response.ok && data.explanation ? data.explanation : t.aiError);
    } catch {
      setExplain(t.aiUnavailable);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-page"><div className="page-width narrow-page">
      <PageTitle title={t.wageDetails} subtitle={reasonTitle} t={t} onBack={() => setScreen("track")} />
      <section className="money-hero"><div><span>{t.due}</span><strong>₹{profile.wage.toLocaleString("en-IN")}</strong><small>{t.days}: {profile.days}</small></div><div className="money-seal"><Icon name="rupee" /></div></section>
      <section className="reason-panel"><div className="reason-title"><span className="amber-marker" /> <h2>{reasonTitle}</h2></div><p>{profile.detail[language]}</p><button className="ai-button" type="button" onClick={askOpenAI} disabled={loading} aria-busy={loading}><span className="ai-spark" aria-hidden="true" />{loading ? t.aiLoading : t.askAi}</button><div className="ai-answer" role="status" aria-live="polite">{explain && <><span>OpenAI</span><p>{explain}</p></>}</div></section>
      <div className="detail-list"><div><span>{t.attendance}</span><strong>{profile.days} {t.days.toLowerCase()}</strong><em className="success-text">{profile.step > 1 ? t.verified : t.pending}</em></div><div><span>{t.due}</span><strong>₹{profile.wage.toLocaleString("en-IN")}</strong><em>{profile.wage ? t.due : t.notStarted}</em></div><div><span>{t.wagePaid}</span><strong>{profile.wagePaid ? `₹${profile.wagePaid.toLocaleString("en-IN")}` : t.notPaidYet}</strong><em className={profile.wagePaid ? "success-text" : ""}>{profile.wagePaid ? t.verified : t.pending}</em></div><div><span>{t.rate}</span><strong>₹230 / {language === "hi" ? "दिन" : "day"}</strong><em>MGNREGA</em></div><div><span>{t.paymentRoute}</span><strong>{profile.tone === "new" ? t.notStarted : t.bankTransfer}</strong><em>{t.demoOnly}</em></div></div>
      <button className="wide-outline-button" type="button" onClick={() => setScreen("track")}><Icon name="ladder" />{t.track}<Icon name="arrow" /></button>
    </div></div>
  );
}

function Demand({ t, setScreen, language }: { t: Copy; setScreen: (s: Screen) => void; language: Lang }) {
  const [days, setDays] = useState(5);
  const [voice, setVoice] = useState(false);
  const [sent, setSent] = useState(false);
  if (sent) return <div className="app-page"><div className="page-width narrow-page success-view"><div className="success-symbol" aria-hidden="true" /><p className="receipt-id">MR-2026-184</p><h1 data-page-title tabIndex={-1} aria-live="polite">{t.demandSent}</h1><p>{t.demandSentBody}</p><button className="primary-button" type="button" onClick={() => setScreen("track")}>{t.track}<Icon name="arrow" /></button></div></div>;
  return <div className="app-page"><div className="page-width narrow-page"><PageTitle title={t.demand} subtitle={t.demandBody} t={t} onBack={() => setScreen("home")} /><form className="task-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}><label>{t.demandVillage}<select defaultValue="majhgawan"><option value="majhgawan">मझगवां / Majhgawan</option><option value="karwi">कर्वी / Karwi</option></select></label><label>{t.demandStart}<input type="date" defaultValue="2026-09-01" /></label><fieldset className="day-field"><legend>{t.demandDays}</legend><div className="day-options">{[5, 10, 15, 20].map((option) => <button type="button" key={option} className={`day-option ${days === option ? "selected" : ""}`} aria-pressed={days === option} onClick={() => setDays(option)}>{option}</button>)}</div></fieldset><button className="primary-button" type="submit">{t.submitDemand}<Icon name="arrow" /></button><button className="voice-button" type="button" aria-pressed={voice} onClick={() => setVoice(!voice)}><Icon name="voice" />{voice ? t.listening : t.voiceNote}<span className="demo-tag">{t.demo}</span></button></form></div></div>;
}

function Grievance({ t, setScreen, profile, language }: { t: Copy; setScreen: (s: Screen) => void; profile: Profile; language: Lang }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const options: [string, string][] = [["money", t.moneyMissing], ["work", t.workMissing], ["attendance", t.wrongAttendance]];
  if (sent) return <div className="app-page"><div className="page-width narrow-page success-view"><div className="success-symbol terracotta" aria-hidden="true" /><p className="receipt-id">{t.grievanceId}</p><h1 data-page-title tabIndex={-1} aria-live="polite">{t.grievanceSent}</h1><p>{t.grievanceDraftBody}</p><button className="primary-button" type="button" onClick={() => setScreen("grievance-status")}>{t.track}<Icon name="arrow" /></button></div></div>;
  return <div className="app-page"><div className="page-width narrow-page"><PageTitle title={t.grievanceTitle} subtitle={t.grievanceLead} t={t} onBack={() => setScreen("home")} /><div className="grievance-options">{options.map(([key, label]) => <button className={`grievance-option ${selected === key ? "selected" : ""}`} type="button" key={key} aria-pressed={selected === key} onClick={() => setSelected(key)}><span className="option-marker"><Icon name={key === "money" ? "rupee" : key === "work" ? "briefcase" : "check"} /></span><span>{label}</span><Icon name="arrow" /></button>)}</div>{selected && <section className="draft-panel"><div className="draft-label">{t.grievanceDraft}</div><p>{selected === "money" ? t.moneyMissing : selected === "work" ? t.workMissing : t.wrongAttendance}. {profile.name[language]}, {profile.village[language]}.</p><button className="primary-button" type="button" onClick={() => setSent(true)}>{t.sendGrievance}<Icon name="arrow" /></button></section>}</div></div>;
}

function GrievanceStatus({ t, setScreen }: { t: Copy; setScreen: (s: Screen) => void }) { return <div className="app-page"><div className="page-width narrow-page"><PageTitle title={t.grievanceTrack} subtitle={t.grievanceId} t={t} onBack={() => setScreen("grievance")} /><section className="feature-panel grievance-panel"><div className="panel-label">{t.grievanceId}</div><h2>{t.grievanceSent}</h2><p>{t.grievanceDraftBody}</p><Ladder t={t} grievance /></section></div></div>; }

function Profile({ t, language, setLanguage, setScreen, profile }: { t: Copy; language: Lang; setLanguage: (l: Lang) => void; setScreen: (s: Screen) => void; profile: Profile; profileIndex?: number; setProfileIndex?: (i: number) => void }) { return <div className="app-page"><div className="page-width narrow-page"><PageTitle title={t.profileTitle} subtitle={t.profileNote} t={t} onBack={() => setScreen("home")} /><section className="profile-card"><div className="large-avatar">{profile.initials}</div><h2>{profile.name[language]}</h2><p>{profile.jobCard}</p><span>{profile.village[language]}</span></section><div className="settings-list"><button type="button" onClick={() => setLanguage(language === "hi" ? "en" : "hi")}><span>{language === "hi" ? t.english : t.hindi}</span><Icon name="switch" /></button><div><span>{t.dataLabel}</span><strong>{t.syntheticDemo}</strong></div><div><span>{t.versionLabel}</span><strong>{t.hackathonBuild}</strong></div></div></div></div>; }

function PageTitle({ title, subtitle, t, onBack }: { title: string; subtitle: string; t: Copy; onBack: () => void }) { return <div className="page-title"><button className="back-button" type="button" onClick={onBack} aria-label={t.back}><Icon name="back" /></button><div><h1 data-page-title tabIndex={-1}>{title}</h1><p>{subtitle}</p></div></div>; }

export default function App() {
  const [language, setLanguage] = useState<Lang>("hi");
  const [screen, setScreen] = useState<Screen>("landing");
  const [profileIndex, setProfileIndex] = useState(0);
  const t = useMemo(() => copy[language], [language]);
  const profile = profiles[profileIndex];
  const inApp = !["landing", "login"].includes(screen);

  useEffect(() => {
    setScreen(pathToScreen());
    const onPop = () => setScreen(pathToScreen());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const go = (s: Screen) => {
    const path = s === "landing" ? "/" : `/${s}`;
    if (window.location.pathname !== path) window.history.pushState({}, "", path);
    setScreen(s);
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = language === "hi" ? "मेरा रोज़गार | MGNREGA" : "Mera Rozgar | MGNREGA";
  }, [language]);

  useEffect(() => {
    if (inApp) requestAnimationFrame(() => (document.querySelector("[data-page-title]") as HTMLElement | null)?.focus());
  }, [screen, inApp]);

  if (screen === "landing") return <Landing t={t} language={language} setLanguage={setLanguage} onContinue={() => go("login")} onHome={() => go("landing")} />;
  if (screen === "login") return <Login t={t} language={language} setLanguage={setLanguage} onLogin={() => go("home")} onBack={() => go("landing")} profileIndex={profileIndex} setProfileIndex={setProfileIndex} />;

  const view = screen === "home" ? <Home t={t} setScreen={go} profile={profile} language={language} />
    : screen === "track" ? <Track t={t} setScreen={go} profile={profile} language={language} />
    : screen === "wage" ? <Wage t={t} setScreen={go} language={language} profile={profile} />
          : screen === "demand" ? <Demand t={t} setScreen={go} language={language} />
          : screen === "grievance" ? <Grievance t={t} setScreen={go} profile={profile} language={language} />
            : screen === "grievance-status" ? <GrievanceStatus t={t} setScreen={go} />
              : <Profile t={t} language={language} setLanguage={setLanguage} setScreen={go} profile={profile} profileIndex={profileIndex} setProfileIndex={setProfileIndex} />;

  return <div className="app-shell"><BrandHeader language={language} setLanguage={setLanguage} t={t} compact onHome={() => go("home")} /><main>{view}</main><BottomNav screen={screen === "grievance-status" ? "grievance" : screen} setScreen={go} t={t} /></div>;
}
