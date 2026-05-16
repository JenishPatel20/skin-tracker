# SkinTrack AI — Project Context for Claude

## What This Is
Personal acne & skincare tracking PWA. Single-user app. Mobile-first.
Live at: **https://skin-tracker-ivory.vercel.app**
GitHub: **https://github.com/JenishPatel20/skin-tracker**

## Tech Stack
- **Next.js 16** (App Router, TypeScript, Turbopack)
- **Tailwind CSS v4** — custom design tokens in `globals.css` (no tailwind.config needed)
- **Supabase** — Auth + Postgres + Storage (project: `grnvlwpylpchcwjbtnjk`)
- **Zustand** — global client state (`src/lib/store.ts`)
- **Recharts** — all analytics charts
- **Radix UI primitives** — installed but custom UI components used instead
- **Framer Motion** — installed, not yet wired to animations

## Run & Deploy
```bash
npm run dev          # localhost:3001 (3000 may be in use)
npx vercel --prod    # deploy to Vercel (already logged in as jenishpatel20)
```
Env vars live in `.env.local` (gitignored). Copy from `.env.local.example`.

## Project Structure
```
src/
├── app/
│   ├── (app)/               # Authenticated route group
│   │   ├── layout.tsx       # Adds BottomNav, 24px bottom padding
│   │   ├── dashboard/       # Home screen
│   │   ├── routine/         # AM/PM checklist
│   │   ├── symptoms/        # 14 symptom sliders
│   │   ├── lifestyle/       # Sleep, water, stress, triggers
│   │   ├── notes/           # Journal (localStorage only — not yet in Supabase)
│   │   ├── photos/          # Upload sessions + before/after slider (local URLs only — not yet in Supabase Storage)
│   │   ├── analytics/       # 5 Recharts graphs, loads real data
│   │   ├── insights/        # Rule-based AI + LLM export
│   │   ├── settings/        # Theme, notifications, streaks
│   │   └── notifications/   # Static notification list (not yet wired to push)
│   ├── auth/                # Sign in / Sign up
│   └── page.tsx             # Redirects to /auth
├── components/
│   ├── layout/
│   │   ├── bottom-nav.tsx   # 6-tab nav (Home, Routine, Track, Photos, Charts, AI)
│   │   └── header.tsx       # Sticky header with theme toggle + bell
│   └── ui/
│       ├── button.tsx       # variants: default, outline, ghost, destructive, secondary
│       ├── card.tsx         # glassmorphism card (glass-card CSS class)
│       ├── badge.tsx        # variants: default, success, warning, error, muted
│       ├── progress.tsx     # teal progress bar
│       ├── slider.tsx       # range input with teal thumb
│       ├── toggle.tsx       # checkable row item
│       └── score-ring.tsx   # SVG circular score widget
├── lib/
│   ├── api.ts               # ALL Supabase CRUD — import from here always
│   ├── insights.ts          # Rule-based AI engine + LLM summary generator
│   ├── store.ts             # Zustand store (todayLog, symptoms, habitStats, skinScore, theme)
│   ├── utils.ts             # cn(), formatDate(), getTodayString(), getPMRoutineForDay()
│   └── supabase/
│       ├── client.ts        # createClient() for "use client" components
│       └── server.ts        # createClient() for server components / middleware
├── middleware.ts             # Auth guard — redirects unauthenticated to /auth
└── types/index.ts            # All shared TypeScript types
supabase/
└── schema.sql                # ✅ Already run in Supabase dashboard
```

## Design System
All design tokens are CSS variables in `globals.css`:
- `--teal` (#2dd4bf), `--mint` (#6ee7b7) — primary accent
- `--glass`, `--glass-border` — glassmorphism values
- `.glass-card` — backdrop-blur card class
- `.gradient-text` — teal→mint gradient text
- `.teal-glow` — box-shadow glow effect

Dark mode is default. Light mode toggled via `.light` class on `<html>` (controlled by Zustand `theme` state — **not yet applied to `<html>`**; this is a known gap).

## Supabase Schema (all tables have RLS enabled, user_id = auth.uid())
| Table | Key columns |
|-------|-------------|
| `user_profiles` | id, display_name, skin_type, onboarded |
| `daily_logs` | date, am_completed, pm_completed, am_steps (jsonb), pm_steps (jsonb), pm_routine_type |
| `symptom_entries` | date, oiliness, dryness, burning, sensitivity, redness, irritation, itching, new_pimples, painful_acne, whiteheads, blackhead_severity, forehead_congestion, beard_irritation, dark_spot_severity, overall_trend |
| `lifestyle_entries` | date, sleep_hours, water_intake, stress_level, sugar_intake, dairy_consumed, whey_protein_consumed, junk_food_consumed, exercise, sweating, pillowcase_changed, beard_shaved, face_touched_frequently |
| `photo_entries` | date, front_url, left_url, right_url, forehead_url, nose_url, beard_jaw_url, lighting_notes |
| `ai_insights` | generated_at, insight_type, title, body, confidence, date_range_start, date_range_end |
| `notification_settings` | am_reminder, am_reminder_time, pm_reminder, pm_reminder_time, hydration, weekly_photo, pillowcase |

All upserts use `onConflict: "user_id,date"` — one entry per user per day.

## PM Routine Schedule (hardcoded logic in `utils.ts → getPMRoutineForDay()`)
| Days | Routine |
|------|---------|
| Mon, Wed, Fri | La Roche-Posay night |
| Tue, Thu, Sat | MyTret-C night (wait 20 min after cleanse, pea-sized amount) |
| Sun | Recovery night (moisturizer only) |
Rule: Never La Roche + MyTret same night.

## What's Fully Wired (Supabase)
- ✅ Auth (sign up, sign in, sign out, middleware guard)
- ✅ Routine page → `daily_logs` (loads + upserts)
- ✅ Symptoms page → `symptom_entries` (loads + upserts)
- ✅ Lifestyle page → `lifestyle_entries` (loads + upserts)
- ✅ Dashboard → reads last 30 days, computes real streak + skin score
- ✅ Analytics → reads real 14-day data for all charts

## Known Gaps / Not Yet Built
- ❌ **Theme toggle doesn't apply to `<html>`** — Zustand has the state but layout.tsx doesn't read it (needs a ThemeProvider client component)
- ❌ **Notes** — uses `localStorage`, not Supabase (`notes` column exists in `daily_logs` but not wired)
- ❌ **Photos** — local object URLs only, not uploaded to Supabase Storage (bucket `skin-photos` commented out in schema.sql)
- ❌ **Push notifications** — UI exists in settings but no service worker or push subscription
- ❌ **PWA icons** — `icon-192.png` and `icon-512.png` referenced in manifest.json but files don't exist in `/public`
- ❌ **Supabase MCP** — not yet configured (user plans to add later)
- ❌ **Insights page** — uses hardcoded demo data, not user's real Supabase data

## Key Patterns
- All Supabase reads/writes go through `src/lib/api.ts` — never import supabase client directly in pages
- `upsertDailyLog()`, `upsertSymptoms()`, `upsertLifestyle()` all use `getUser()` internally
- `computeHabitStats(logs)` and `computeSkinScore(logs, symptoms)` are pure functions in `api.ts`
- `generateInsights(symptoms, lifestyle, logs)` in `insights.ts` returns `AIInsight[]` — rule-based, no LLM call
- `generateLLMSummary(...)` returns a plaintext string ready to paste into ChatGPT/Claude

## npm Cache Note
The system npm cache has a permissions issue. Always prefix npm commands with:
```bash
npm_config_cache=/tmp/npm-cache-new npm install ...
npm_config_cache=/tmp/npm-cache-new npx vercel ...
```
