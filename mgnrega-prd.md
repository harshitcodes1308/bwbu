# MGNREGA Portal Revamp — Build Plan & Agent Prompt
**For: Build What Moves India hackathon | Deadline: Aug 28, 2026, 8:00 PM IST**

---

## ⚠️ Non-negotiable hackathon rule before anything else

Your prototype **must be built with Codex or powered by an OpenAI model** — Codex has to be a meaningful part of the build, not bolted on for the demo. Your agentic IDE (Antigravity / Claude Code CLI) can scaffold and write code, but somewhere in the actual product, an OpenAI model needs to do real work. Bake this into the product itself, don't just use it as your coding tool. Suggested real uses (pick one, don't overdo it):

- **Grievance/complaint drafting assistant** — worker describes issue in Hindi/broken English/voice, OpenAI model structures it into a formal complaint with correct scheme references.
- **Status explainer** — takes raw wage/muster-roll data and explains in plain vernacular language why payment is delayed.
- **Voice-to-form** — worker speaks their job demand, model fills the structured application.

Pick ONE of these as your Codex-powered feature. This becomes your differentiator in judging criteria "product thinking."

---

## 1. The one problem you're solving

**Problem statement:** A rural MGNREGA worker cannot independently check their job card status, track wage payment delays, or raise a grievance — because the official NREGA portal is a data-transparency dashboard built for auditors and officials, not a usable tool for the worker it's meant to serve. Workers depend on middlemen (panchayat clerks, cyber cafes) to access their own entitlement data.

**Who faces it:** Rural daily-wage workers, often first-generation smartphone users, low digital literacy, regional language only, on 2G/3G, often on a shared or basic Android phone.

**Why current experience fails:**
- English/bureaucratic UI, dense tables, no vernacular support
- Not mobile-optimized, requires desktop-style navigation
- No plain-language explanation of *why* wages are delayed
- No self-service grievance flow — worker has no direct channel

---

## 2. Citizen journey to build (this is your demo spine)

Build this as ONE continuous, working flow. Everything else is secondary.

1. **Onboard / Login** — phone number + job card number (mock OTP), auto-detects preferred language
2. **Home / My Status** — plain-language summary card: "Aapka kaam chal raha hai" / "Payment 12 din se pending hai" with a simple icon-first status, not a table
3. **Demand Work** — simple form: village, dates available, number of days → submit application (mocked backend acknowledgment)
4. **Track Application** — visual step-tracker (Applied → Work Allotted → Attendance Marked → Wage Processed → Paid), each step in plain language, not government jargon
5. **Wage & Attendance Detail** — muster roll days worked, wage due, wage paid, and if delayed: plain-language reason (bank issue / fund release delay / verification pending) — **this is where your Codex-powered explainer feature sits**
6. **Raise Grievance** — one-tap "Mera paisa nahi mila" / "Kaam nahi mila" buttons pre-fill a structured complaint (Codex-powered drafting if you chose that feature), submits with a tracking ID
7. **Grievance Status** — simple tracker, same visual language as application tracker

Keep it to these 7 screens. A working shallow flow beats a broad, half-built one — judging weighs "does the main journey actually work."

---

## 3. Information architecture (what NOT to carry over from the real site)

Drop these from the real NREGA portal, they exist for auditors, not citizens:
- District/state-wise MIS reports, financial year dropdowns, scheme code tables
- Raw muster roll number grids
- Any admin/official-facing report generator

Keep the underlying **data concepts** (job card, muster roll, wage, work demand, grievance) but re-skin every one of them into a citizen-first status object.

---

## 4. Design system — tokens for your agent to follow exactly

Ground the visual identity in the subject: rural India, physical labor, sunlight, soil, community — not a generic govt-blue dashboard, and not a generic AI-cream/terracotta SaaS look either.

**Color (name these exactly, don't drift):**
- `--soil-brown: #6B4226` — primary text / high-emphasis elements, evokes earth/labor
- `--wheat: #F4E3B2` — warm background base, evokes harvested field
- `--leaf-green: #4C7A3F` — success/paid/completed states
- `--sun-amber: #E8912D` — pending/in-progress states, warm not alarming
- `--terracotta-red: #B5482C` — delayed/attention states — used sparingly, never as a scare color
- `--ink: #2B2420` — near-black for body text, not pure black

**Type:**
- Display face: a sturdy, high-legibility slab-serif or humanist sans with strong open counters (renders well at small sizes on cheap screens) — e.g. Mukta or Hind for Devanagari pairing, paired with a geometric sans for Latin/English toggle
- Body face: same family, regular weight, generous line-height (1.6+) for low-literacy scanning
- No decorative/script fonts anywhere — legibility over personality here

**Layout concept:**
- Single-column, thumb-zone-first mobile layout (nothing above the fold requires horizontal scroll)
- Status shown as **icon + one-line plain sentence**, never a data table, as the primary UI pattern
- Large tap targets (min 48px), minimal nested navigation — max 2 taps to any core action
- Bottom nav bar with 3–4 items max: Home, Track, Grievance, Profile

**Signature element:** a **"step ladder" progress tracker** used consistently across both the work-application flow and the grievance flow — visualized as literal rungs (nods to labor/construction, the subject's own vernacular) rather than a generic dotted progress bar. This is the one visual idea the whole product hangs on — don't dilute it with other decorative motifs.

**Language:** Hindi-first (Devanagari) with English toggle, not the reverse. Copy in short, plain sentences — "Aapka paisa 12 din se ruka hai" not "Payment status: Pending disbursement." Follow active-voice, plain-verb writing style throughout — see Writing section of your design skill.

**Motion:** minimal — a single reveal animation when a status step completes (the "rung is climbed"), nothing else. Reduced-motion respected.

---

## 5. Mock data strategy (required by brief)

- Fabricate 3–4 sample worker profiles with different states: (1) smooth case fully paid, (2) delayed payment case, (3) grievance-in-progress case, (4) new applicant case
- Clearly label every mocked element in your submission video/summary: "This uses synthetic job card and wage data, no real Aadhaar/bank/OTP details"
- Mock OTP = static code shown on screen, don't build real SMS auth

---

## 6. Tech stack suggestion (fits your existing tools)

- Frontend: React + Tailwind (works well in Antigravity/Claude Code CLI, fast to scaffold, mobile-first utility classes)
- State: local mock JSON acting as the "backend" — no real DB needed for a hackathon prototype
- OpenAI integration: call the API directly from a lightweight backend route (Node/Express or a serverless function) for whichever Codex-powered feature you picked in Section 0 — this is the part that must be real, not mocked
- Deploy: Vercel or similar so the "live public link" requirement is trivially met

---

## 7. Submission checklist (from the brief, don't miss any)

- [ ] Live public link, opens without login wall, includes mock login creds if needed
- [ ] 2-minute video: minute 1 = citizen demo, minute 2 = how you built it + why (mention Codex usage explicitly)
- [ ] Project summary, under 250 words
- [ ] Partner's registered email if team of two, both registered
- [ ] Clearly disclose what's real vs mocked, in both video and summary

---

## 8. Strict prompt for your agentic IDE

Copy everything below into your `.agents` workflow / Antigravity or Claude Code CLI session as the build brief.

```
You are building a citizen-facing mobile-first prototype that revamps the
Indian MGNREGA (NREGA) worker portal for the "Build What Moves India"
hackathon. Read this entire brief before writing any code.

BEFORE BUILDING:
Check every skill available in this project's .agents folder and load
any that are relevant — in particular anything covering frontend design,
UI/visual design tokens, accessibility, or copywriting. Apply the
frontend-design skill's process explicitly: brainstorm a compact design
token plan (color, type, layout, signature element) grounded in this
brief's subject matter, critique it against generic-AI-design defaults
(cream+terracotta SaaS look, dark+neon look, broadsheet-hairline look —
avoid all three), revise, and only then start writing code.

DESIGN TOKENS TO FOLLOW EXACTLY (do not substitute generic defaults):
- Color: soil-brown #6B4226, wheat #F4E3B2, leaf-green #4C7A3F,
  sun-amber #E8912D, terracotta-red #B5482C, ink #2B2420
- Type: humanist sans/slab pairing with strong Devanagari support
  (e.g. Hind or Mukta family), generous line-height, no decorative fonts
- Layout: single column, mobile-first, thumb-zone, max 2 taps to any
  action, bottom nav with 4 items max (Home / Track / Grievance / Profile)
- Signature element: a "step ladder" progress tracker (literal rungs,
  not a generic dotted progress bar) reused across both the work
  application flow and the grievance flow — this is the one visual idea
  to spend design effort on, keep everything else quiet and disciplined
- Copy: Hindi-first (Devanagari) with English toggle, short plain
  sentences, active voice, no bureaucratic jargon. A status like
  "Payment Pending" must become something like "Aapka paisa 12 din se
  ruka hai" — plain, specific, no filler

BUILD EXACTLY THIS CITIZEN JOURNEY, NOTHING BROADER:
1. Login — phone number + job card number, mock OTP
2. Home — plain-language status summary card (icon + one sentence, no tables)
3. Demand Work — simple form (village, available dates, days) → submit
4. Track Application — step-ladder tracker: Applied → Work Allotted →
   Attendance Marked → Wage Processed → Paid
5. Wage & Attendance Detail — days worked, wage due/paid, and if delayed,
   a plain-language reason for the delay
6. Raise Grievance — one-tap pre-filled complaint buttons, submits with
   a tracking ID
7. Grievance Status — same step-ladder visual pattern as step 4

MANDATORY REAL FEATURE (not mocked):
Integrate an actual OpenAI/Codex-powered feature — not just as a coding
tool, but as a working part of the product. Use it for [PICK ONE AND
STATE HERE: wage-delay plain-language explainer OR grievance drafting
assistant OR voice-to-form work demand]. Wire this to a real API call,
not a hardcoded response.

DATA:
Use only mock/synthetic data. Fabricate 3-4 sample worker profiles
covering: smooth fully-paid case, delayed-payment case, grievance-in-
progress case, new-applicant case. Never use real Aadhaar, bank, OTP,
or payment details. Static mock OTP shown on screen is fine.

STACK:
React + Tailwind, mobile-first utility classes, local mock JSON as the
data layer, a lightweight backend route for the real OpenAI API call,
deployable to Vercel for a public link.

QUALITY BAR:
Responsive down to small mobile viewports, visible keyboard focus states,
reduced-motion respected, large tap targets (48px minimum), fast load on
slow connections (no heavy unused libraries, optimize images/fonts).
Take a screenshot after each major screen is built and self-critique
against the design tokens before moving to the next screen.

Do not build any admin/official-facing views, MIS reports, or district/
state dashboards — this product is citizen-facing only.
```
