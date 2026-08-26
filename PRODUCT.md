# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Delegated by the user through the PRD: React with a small Vite client, native CSS, local synthetic JSON data, and one lightweight serverless API route. The project should deploy cleanly to Vercel.

## Users

Primary users are rural MGNREGA workers, often first-generation smartphone users who read a regional language, use low-cost or shared Android phones, and may have slow 2G/3G connections. They need to check job-card and wage status, demand work, track progress, and raise a grievance without depending on a clerk or cyber cafe.

## Product Purpose

Make a worker's MGNREGA entitlements understandable and actionable in one continuous mobile flow. Success means the worker can learn what is happening, why money is delayed, and what to do next without reading administrative tables or scheme jargon.

## Positioning

This is a citizen tool rather than an auditor dashboard: it translates scheme records into plain Hindi-first status sentences and reuses one literal step-ladder tracker across work and grievance journeys. A real OpenAI wage-delay explainer turns raw status data into a short vernacular explanation and next step.

## Operating Context

Workers may use the product outdoors, on small touchscreens, under bright light, with intermittent connectivity and limited time. Core tasks must remain within two taps of Home, Track, Grievance, or Profile. Login uses a phone number, job-card number, and disclosed mock OTP.

## Capabilities and Constraints

- Seven citizen-facing screens only: login, home, demand work, application tracking, wage and attendance detail, grievance creation, and grievance tracking.
- Hindi-first copy with an English toggle.
- Synthetic data for four representative worker states: paid, wage delayed, grievance active, and new applicant.
- No real Aadhaar, bank, OTP, payment, or government backend data.
- OpenAI powers the wage-delay plain-language explainer through a real API route when an API key is configured.
- Mobile-first single-column layout, 48px minimum targets, keyboard focus, reduced motion, and graceful slow-network behavior.
- No MIS, district/state dashboards, admin tools, report generators, or raw tables.

## Brand Commitments

The PRD fixes the palette: soil brown `#6B4226`, wheat `#F4E3B2`, leaf green `#4C7A3F`, sun amber `#E8912D`, terracotta red `#B5482C`, and ink `#2B2420`. The voice is short, direct, respectful, and Hindi-first. The visual identity must feel grounded in rural work, sunlight, soil, and community without becoming rustic decoration or generic government blue.

## Evidence on Hand

The build brief is [mgnrega-prd.md](/Users/harshitsingh/Documents/bwbu/mgnrega-prd.md). There are no real worker records, official integrations, identity assets, testimonials, or performance claims. All demonstration names and values must be clearly labeled synthetic.

## Product Principles

- Explain the worker's situation before showing underlying numbers.
- One task, one clear next action.
- Use familiar plain language instead of administrative vocabulary.
- Preserve dignity through clarity, not decoration.
- Keep the demo narrow, continuous, and genuinely functional.

## Accessibility & Inclusion

The interface must support Devanagari well, use generous line height and contrast, avoid color-only status cues, expose visible focus states, keep controls at least 48px, respect reduced motion, and remain usable at small mobile widths and browser text zoom.

