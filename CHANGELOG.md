# Changelog

Running log of structural changes, with the reasoning so a future reader (human or LLM) inherits the context, not just the diff.

## 2026-08-27 — Nav + profile polish

**What changed**

- Removed the on-screen OTP hint line ("code prints in the server log"). The OTP panel is now title + input only; the wrong-code error still renders in that spot when verification fails.
- Bottom nav ("floating deck") no longer bends with the background: dropped the rounded top corners and the translucent blur, now solid `--paper` with a soft top shadow.
- Replaced the CSS pseudo-element nav icons with clean inline SVGs (house / list / chat-bubble / user) via a small `NavIcon` component.
- Profile page shows only the logged-in user — removed the other-people profile switcher. (Login keeps its demo-profile picker.)

**Left behind (harmless dead ends)**

- Unused `otpServerHint` copy key; `profileIndex`/`setProfileIndex` still passed to `Profile`. Drop in a cleanup pass if wanted.

## 2026-08-27 — Routing + login UX

**What changed**

- Replaced state-only screen switching with **History API routing** (`/login`, `/home`, `/wage`…) — clean paths, no `#`. `App` inits from `pathToScreen()`, listens to `popstate`, and `go(screen)` does `pushState` + `setState`. Browser Back/Forward work; deep links and refresh work (Vite serves index.html for unknown paths in dev).
- Brand lockup is now a button → home when logged in, landing otherwise.
- Login has a back button (→ landing); sub-screens keep their existing per-screen back.
- Demo profiles on login now prefill phone + job card (added `phone` to each profile).
- Demo OTP is no longer shown on screen — it's logged server-side (`POST /api/otp`), read from the server terminal, verified via `POST /api/otp/verify`.
- Smooth scroll for in-page anchors (`#why-made`); reduced-motion still overrides it.
- Fixed a pre-existing React warning: `fetchPriority` → lowercase `fetchpriority`.

**Gotchas**

- `#why-made` stays an in-page anchor: it changes the hash, not the pathname, so `pathToScreen()` ignores it and routing doesn't fire.
- Production/static hosting needs an SPA fallback (rewrite all paths to index.html) or deep links 404. Dev is covered by Vite. Add when you pick a host.

## 2026-08-27 — Split into client/server, TypeScript backend

**What changed**

- Restructured a single Vite app into npm workspaces: `client/` (React + Vite) and `server/` (TypeScript Express).
- Ported the old Vercel function `api/explain.js` → `server/src/index.ts` (`POST /api/explain`), same logic, now typed.
- `client/vite.config.js` proxies `/api` → `http://127.0.0.1:8787` so the browser calls a relative path and the server holds the OpenAI key.
- The OpenAI key moved from root `.env` to `server/.env` — it now lives only with the code that uses it.
- Root `package.json` runs both with one command: `npm run dev` (via `concurrently`).

**Why**

- Requested: a real backend so the OpenAI call is clearly server-side.
- Note for the record: the key was *already* server-side before this. The old `api/explain.js` ran as a Vercel serverless function (Node, not the browser), so no secret was ever shipped to the client. This change is a cleaner separation, not a leak fix.

**How to run**

```
npm install        # installs both workspaces
npm run dev        # client on :5173, server on :8787
npm run check      # server: tsc --noEmit + branch self-check
npm run build      # client production build + bundle sanity check
```

Client proxies `/api/*` to the server in dev. Demo login: any 10-digit phone + any job card, OTP `1234`. Four demo profiles cover paid / delayed / grievance / new.

**Gotchas learned**

- The dev harness injects `PORT` into every spawned process, so `Number(process.env.PORT) || 8787` made the server grab the client's port. Server port is now pinned to `8787` (it must match the Vite proxy). See the `ponytail:` comment in `server/src/index.ts` for the upgrade path if a deploy host assigns `$PORT`.
- `import "dotenv/config"` loads `.env` at import time. The self-check (`server/src/check.ts`) imports the app first, *then* deletes the key, because the route reads `process.env` live per request.
- A stale `package-lock.json` from a prior commit pointed at a sibling repo's `node_modules` (symlinks to `../gfghub`). Deleted and regenerated during setup.

**Skipped (deliberate, add when needed)**

- Production deploy config. Vercel served `api/` for free before; a standalone server needs its own host (Railway / Render / Fly) or a `vercel.json` targeting `server/`. Add when a deploy target is chosen.
- Server `$PORT` support — pinned to 8787 for local dev; switch to `process.env.PORT` when the host assigns one.
