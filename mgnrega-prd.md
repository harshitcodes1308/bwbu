# Mera Rozgar — PRD

## One-line pitch
Mera Rozgar helps rural workers understand delayed MGNREGA wages and raise a
ready-to-submit grievance in their own language.

The official NREGA portal exposes reports, attendance, work, and grievance
information, but its structure is administrative and report-oriented rather than
built around a worker's immediate question: **"Where is my money, and what can I
do now?"** ([nrega.dord.gov.in](https://nrega.dord.gov.in/MGNREGA_new/Nrega_home.aspx))

## Product overview
Mera Rozgar is a Hindi-first, mobile-first worker tool for understanding and
acting on delayed MGNREGA wage payments. It converts complex employment records
into a plain-language wage timeline and uses OpenAI to (1) explain the delay and
(2) draft a grievance from the worker's own words.

The prototype focuses on **one high-value scenario**: a worker has completed
work, but payment has not arrived. The worker can see the payment journey, ask
AI to explain the current status, create an editable grievance, and receive a
mock tracking ID.

The story the demo tells, end to end:
> "I worked, my money is delayed, I understand why, and I can take action."

## Two core features
1. **Wage Delay Explainer** — AI explains, in plain Hindi/English, why a worker's
   payment is delayed and what to do next.
2. **One-Tap Grievance Builder** — AI converts the worker's free-text description
   into a clear, editable, ready-to-submit complaint.

## Scope decision
Do not build all flows as equal features. Supporting screens stay shallow.

| Feature | Priority | Prototype depth |
|---|---:|---|
| Mock login | Required | Very shallow |
| Worker home / status | Required | One polished screen |
| Wage timeline | Core | Fully interactive |
| AI wage explanation | Core | Real OpenAI API call |
| Grievance creation | Core | Fully interactive |
| AI grievance drafting | Core | Real OpenAI API call |
| Work-demand application | Removed | Not in prototype |
| Admin dashboard | Excluded | Do not build |
| MIS reports | Excluded | Do not build |
| Real Aadhaar / bank integration | Excluded | Unsafe and unnecessary |

The prototype does not connect to real government records. All data is synthetic
and carries a visible label:
> यह डेमो नकली जानकारी से बना है। इसमें असली आधार, बैंक या सरकारी रिकॉर्ड का उपयोग नहीं हुआ है।
> This demo uses synthetic data. No real Aadhaar, bank, or government records are used.

## Problem
A worker may know wages have not arrived but not know:
- Whether attendance was recorded.
- Whether the work was verified.
- Whether payment was sent.
- Whether the delay is a bank or verification issue.
- Which authority or action is appropriate.
- How to write a formal grievance.

The public portal holds this information, but its report-oriented structure
creates friction for a worker who wants a direct explanation and a next action.

## Target user
Primary:
- Rural MGNREGA worker.
- First-generation or low-confidence smartphone user.
- Hindi or regional-language reader, small Android phone, unreliable connectivity.
- Wants a quick answer, not a report.

Secondary:
- A family member, local volunteer, or facilitator helping the worker.

## Goals
- Explain wage status in under 30 seconds.
- Show the payment journey without administrative jargon.
- Give the worker one clear next action.
- Generate an editable grievance in the worker's language.
- Demonstrate meaningful use of OpenAI, not a decorative chatbot.

## Non-goals
Real government auth · real Aadhaar/bank verification · real payment processing ·
official grievance submission · accurate live payment status · full NREGA MIS ·
admin/officer dashboard · full voice product.

## Demo persona
- **Name:** Sita Devi
- **Village:** Rampur
- **Job-card number:** `RJ-XX-2048`
- **Work:** Pond restoration (तालाब की मरम्मत)
- **Days worked:** 12
- **Wages due:** ₹2,568
- **Muster-roll closure:** 18 August 2026
- **Current status:** Payment pending (verification pending)

All values are fictional and marked synthetic. Three additional profiles (paid,
grievance-in-review, new applicant) exist in mock data and are selectable through
a small "Demo scenario" control for judges. The main demo uses only Sita Devi.

## Central demo journey (five screens, under 2 minutes)
1. **Login** — mobile + job-card + OTP (demo OTP printed to the server log).
   Straight to home after login.
2. **Home ("My money")** — one status sentence, the amount, three facts
   (work, days, payment status), and two buttons: "पैसा क्यों रुका है?" and
   "शिकायत बनाएं".
3. **Wage status** — the ladder tracker, amount/dates, an expandable
   "रिकॉर्ड का विवरण" for authentic terms, and an "AI से समझें" button.
4. **AI explanation** — real `/api/explain-wage` call, shown as
   **क्या हुआ? / अब क्या करें? / ध्यान दें**.
5. **Grievance** — issue selection → worker statement → AI draft
   (`/api/draft-grievance`) → editable preview → mock submission with a tracking ID.

The wage ladder:
```
काम दर्ज हुआ       ✓
हाजिरी दर्ज हुई    ✓
काम की जांच हुई    ✓
भुगतान भेजा गया    !
बैंक में पैसा आया   ○
```
Do not surface "FTO", "Stage I/II" as primary labels — keep them under the
expandable record-details section only.

MGNREGA wage payments are expected within 15 days of muster-roll closure, and
delays beyond the 16th day can attract compensation at 0.05% of unpaid wages per
day. The prototype explains this carefully and never presents a calculation as an
official determination.
([pib.gov.in](https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=1885507))

## AI feature 1 — Wage explainer
**Input:** structured wage/attendance data.
**Output:** one plain-language explanation, one next action, one disclaimer.

Rules:
- Never invent a transaction ID, official, bank, or payment date.
- Never claim a grievance was officially filed.
- Never expose personal financial data beyond synthetic demo data.
- If the reason is unknown, say it is unknown.
- Support Hindi and English.
- Return JSON validated by the backend.

## AI feature 2 — Grievance drafter
**Input:** worker free-text description, selected issue type, synthetic context.
**Output:** subject, category, formal complaint body, suggested records, hi/en.

Rules:
- Preserve the worker's facts; add no invented dates, amounts, names, or allegations.
- Respectful language, complaint under ~150 words.
- Worker must edit before submission; show the final text before the mock submit.

## API design
Two backend routes keep the OpenAI key server-side. Both validate the model
output and fall back to a synthetic template if no key is configured or the model
returns malformed JSON, so the demo always completes.

### `POST /api/explain-wage`
Request:
```json
{ "locale": "hi",
  "wageRecord": { "daysWorked": 12, "wageDue": 2568,
    "musterRollClosed": "2026-08-18",
    "currentStage": "payment_processing", "reason": "verification_pending" } }
```
Response:
```json
{ "configured": true,
  "summary": "आपकी हाजिरी दर्ज है, लेकिन भुगतान भेजने से पहले की जांच बाकी है।",
  "nextStep": "ग्राम पंचायत से भुगतान की वर्तमान स्थिति पूछें और जरूरत पड़ने पर शिकायत दर्ज करें।",
  "disclaimer": "यह synthetic demo record है। असली स्थिति सरकारी रिकॉर्ड से जांचें।" }
```

### `POST /api/draft-grievance`
Request:
```json
{ "locale": "hi", "issueType": "payment_not_received",
  "workerStatement": "मैंने 12 दिन काम किया था लेकिन पैसा नहीं मिला।",
  "context": { "workName": "तालाब की मरम्मत", "daysWorked": 12, "wageDue": 2568 } }
```
Response:
```json
{ "configured": true,
  "subject": "मनरेगा मजदूरी का भुगतान प्राप्त नहीं हुआ",
  "category": "वेतन भुगतान में देरी",
  "complaint": "मैंने तालाब की मरम्मत के काम में 12 दिन काम किया। मेरी हाजिरी दर्ज की गई थी, लेकिन ₹2,568 की मजदूरी अभी तक प्राप्त नहीं हुई है। कृपया भुगतान की स्थिति की जांच कर लंबित मजदूरी और लागू विलंब-क्षतिपूर्ति के बारे में जानकारी दी जाए।",
  "suggestedRecords": ["जॉब कार्ड", "हाजिरी का विवरण", "भुगतान की स्थिति"] }
```

## Route structure
```
/                    landing (pitch entry, CTA → /login)
/login
/home
/wage-status
/ai-explanation
/grievance
/grievance-preview
/grievance-submitted
/profile             language toggle + synthetic badge (minor)
```
Bottom navigation is retained visually (Home · Wage · Grievance · Profile). We do
not build four separate product areas.

## Evaluation criteria
| Metric | Target |
|---|---:|
| Judge understands the worker's problem | Under 10 seconds |
| Judge finds payment status | One tap |
| AI explanation appears | Under 5 seconds, with loading state |
| Complaint is generated | One interaction after text entry |
| Complaint remains editable | Always |
| Main demo completion time | Under 2 minutes |
| Minimum tap target | 48 × 48 px |
| Real personal data used | None |

## Two-minute pitch
> MGNREGA data exists, but a worker should not need to read government tables to
> know where their wages are. Mera Rozgar focuses on one moment: a worker has
> completed work, but payment has not arrived. The app turns the payment pipeline
> into a simple ladder, explains the delay in Hindi using OpenAI, and converts the
> worker's own words into an editable grievance. It is not a replacement for the
> government backend — it is a citizen-first layer that makes existing information
> understandable and actionable.
