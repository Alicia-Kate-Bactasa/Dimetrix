# Dimetrix — Metro Cebu & Lapu-Lapu Power Outage Tracker

**Dimetrix** is an independent, real-time power outage tracking and grid monitoring platform specifically built for **Metro Cebu, Lapu-Lapu City, and Mactan Island**.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, Tailwind CSS, shadcn/ui
- **Backend:** Next.js Route Handlers, Prisma ORM
- **Database:** Neon PostgreSQL
- **Auth:** Auth.js v5 (NextAuth) — Credentials + Google OAuth
- **Validation:** Zod
- **Deployment:** Vercel

## Getting Started

1. **Install:** `npm install`
2. **Configure env:** copy `.env.example` to `.env.local` and fill in `DATABASE_URL`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL`. Google OAuth vars are optional.
3. **Push schema:** `npm run db:push`
4. **Seed demo data:** log in as an admin and use the "Seed sample data" action in the Moderation panel.
5. **Run dev:** `npm run dev` → http://localhost:3000

## Security

- All API mutation routes require an authenticated session (enforced in middleware + per-route).
- Zod validation on all inputs; passwords hashed with bcrypt (cost 12).
- Per-route rate limiting for registration, password change, report creation, confirm, and flag endpoints (in-memory — swap for a shared store on serverless fleets for strict guarantees).
- Content Security Policy, HSTS, X-Frame-Options, and other security headers set in `next.config.mjs`.
- Environment variables validated at startup in production (`src/lib/env.js`).
- Safe `returnTo` redirect validation prevents open-redirect attacks (`src/lib/authReturnTo.js`).

## Deploying to Vercel

1. Push the repo to GitHub.
2. In Vercel, **Import Project** → select the repo. Vercel auto-detects Next.js from `vercel.json`.
3. Add the environment variables from `.env.example` (set `NEXTAUTH_URL` to your production URL, generate a fresh `NEXTAUTH_SECRET` with `openssl rand -base64 32`).
4. Deploy.

---

## Key Features

- **Live Interactive Grid Map**: Powered by React-Leaflet with custom incident pins for active power outages, exploded transformers, scheduled brownouts, voltage fluctuations, and fallen poles.
- **Strict Metro Boundary Locking**: Viewport is strictly constrained to Cebu City, Mandaue City, Lapu-Lapu City, Mactan Island, Cordova, Talisay City, Consolacion, Liloan, and Minglanilla (`CEBU_BOUNDS`).
- **Transparent Location & Grid Coverage**: 
  - **Grid Provider Indexing**: Clear distinction between **MECO** (*Mactan Electric Company*) for Lapu-Lapu City, Mactan Island, and Cordova vs. **VECO** (*Visayan Electric Company*) for Cebu City and Metro Cebu mainland.
  - **Barangay & Landmark Breakdown**: Real-time coverage callouts showing covered barangays, hospital hubs, BPO parks, and major highways when filtering locations.
- **Verified Community Incident Reporting**: Interactive modal allowing users to report outages, pin precise map coordinates, attach descriptions, select severity levels, and undergo identity verification.
- **Power Grid Analytics**: Real-time outage statistics, severity breakdown charts, resolution status tracking, and provider metrics powered by Recharts.

---

## Geographical Coverage & Utility Providers

| Region / City | Utility Provider | Key Coverage & Landmarks |
| :--- | :--- | :--- |
| **Lapu-Lapu City** | **MECO** (Mactan Electric Co.) | Basak, Gun-ob, Pajo, Poblacion, Canjulao, Pusok, City Hall, Gaisano Grand Plaza, CLIP Industrial Park |
| **Mactan Island** | **MECO** (Mactan Electric Co.) | Brgy. Mactan, Punta Engano, Maribago, Mactan Newtown, MCIA Airport, JPark & Shangri-La Resorts |
| **Cordova** | **MECO** (Mactan Electric Co.) | All 13 Barangays, CCLEX Tollway Entrance, Pilipog Bridge, Day-as Boardwalk, Gabi Bridge |
| **Cebu City** | **VECO** (Visayan Electric Co.) | Lahug, Banilad, Guadalupe, Mabolo, Cebu IT Park, Ayala Center, Provincial Capitol, Chong Hua |
| **Mandaue City** | **VECO** (Visayan Electric Co.) | Subangdaku, Tipolo, Maguikay, A.S. Fortuna, Oakridge, SM City NRA, Cebu Int'l Port |
| **Talisay City** | **VECO** (Visayan Electric Co.) | Tabunok, Lawaan, Dumlog, SRP Coastal Highway, Gaisano Grand Fiesta Mall |
| **Consolacion** | **VECO** (Visayan Electric Co.) | Pitogo, Tayud, SM City Consolacion, Mendero Medical Center, Tayud Shipyards |
| **Liloan** | **VECO** (Visayan Electric Co.) | Yati, Poblacion Liloan, Liloan Boardwalk, Suba Bridge |
| **Minglanilla** | **VECO** (Visayan Electric Co.) | Poblacion, Calajoan, Tulay, N. Bacalso Highway, Tubod Flowing Waters |

---

## 📜 Attributions & Licenses

- **Map Tiles**: Powered by [OpenStreetMap](https://www.openstreetmap.org/) (`&copy; OpenStreetMap contributors`).
- **Icons**: [Lucide Icons](https://lucide.dev/) (MIT License).
