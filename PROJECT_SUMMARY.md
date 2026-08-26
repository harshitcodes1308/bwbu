# Project summary

Mera Rozgar is a Hindi-first, mobile citizen portal that turns MGNREGA records into clear actions for rural workers. Instead of administrative tables, workers see one plain status sentence and a literal work-ladder showing where their application, attendance, wage, or grievance has reached.

The prototype covers the complete citizen journey: mock phone and job-card login, work status, demand-for-work form, application tracking, wage details, grievance creation, and grievance tracking. A Hindi/English switch is available on every screen, with Hindi selected by default. Four synthetic worker profiles demonstrate fully paid, delayed wage, active grievance, and new applicant states. No real Aadhaar, bank, OTP, job-card, or government backend data is used.

The differentiating feature is an OpenAI-powered wage-delay explainer. It receives structured synthetic wage status fields and returns two short plain-language sentences plus a practical next step in Hindi or English. The feature uses the OpenAI Responses API when `OPENAI_API_KEY` is configured and shows an honest setup message otherwise.

Built with Codex using React, Vite, native CSS, a Vercel-compatible API route, and a narrow citizen-first scope.
