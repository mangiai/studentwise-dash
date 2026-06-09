# StudentWise Dash

University portal dashboard for Iqra University — built with TanStack Start, deployed on Vercel, backed by Supabase Postgres.

## Stack

- **Frontend:** React 19, TanStack Router/Start, Tailwind CSS v4, shadcn/ui
- **Deploy:** Vercel (Nitro preset)
- **Database:** Supabase Postgres with RLS

## Prerequisites

- Node.js 22.12+
- npm
- [Supabase CLI](https://supabase.com/docs/guides/cli) (optional, for local DB)
- A Supabase project (cloud) or local Supabase via CLI

## Quick start

```bash
npm install
cp .env.example .env
# Fill in your Supabase keys (see below)
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.example` to `.env` and set these values from your Supabase project dashboard (**Settings → API**):

| Variable | Where used | Required |
|----------|------------|----------|
| `VITE_SUPABASE_URL` | Browser client | Yes |
| `VITE_SUPABASE_ANON_KEY` | Browser client | Yes |
| `SUPABASE_URL` | Server functions / SSR | Yes |
| `SUPABASE_ANON_KEY` | Server functions / SSR | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin scripts only | Optional |

For Vercel, add the same variables in **Project Settings → Environment Variables** for Production, Preview, and Development.

## Supabase setup

### Option A — Supabase Cloud (recommended for Vercel)

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. Link the CLI and push migrations:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npm run db:push
```

3. Seed demo data (run once in the SQL editor or via CLI):

```bash
npx supabase db execute --file supabase/seed.sql
```

4. Regenerate TypeScript types after schema changes:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_REF > src/lib/database.types.ts
```

### Option B — Local Supabase

```bash
npm run db:start    # starts local Postgres + Auth + Studio
npm run db:reset    # applies migrations + seed.sql
npm run db:types    # regenerates src/lib/database.types.ts
```

Studio: [http://localhost:54323](http://localhost:54323)

## Database schema

Tables: `departments`, `profiles`, `students`, `teachers`, `courses`, `enrollments`, `attendance_records`, `fee_transactions`, `semester_fees`.

- RLS is enabled on all public tables
- Students can read their own records; admins (`profiles.role = 'admin'`) have full access
- New auth users auto-create a `profiles` row via trigger

Migration: `supabase/migrations/20250610000000_initial_schema.sql`

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the project in [vercel.com/new](https://vercel.com/new).
3. Vercel auto-detects **TanStack Start** — no custom build command needed.
4. Add Supabase env vars (see table above).
5. Deploy.

```bash
npx vercel          # preview
npx vercel --prod   # production
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build (Nitro + Vercel preset) |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm run db:push` | Push migrations to linked Supabase project |
| `npm run db:reset` | Reset local DB with migrations + seed |

## Project status

- UI routes use mock data today; Supabase client + server query helpers are wired and ready.
- Auth (login/signup) UI exists but is not yet connected to Supabase Auth.
- Sidebar links for `/teachers`, `/results`, `/notifications`, `/settings` are not implemented yet.

## What I need from you (Supabase)

To finish connecting the live database, please provide or set up:

1. **Supabase project URL** — `https://xxxx.supabase.co`
2. **Anon/public key** — safe for client + server with RLS
3. **Service role key** — server-only, for admin seeding (optional)
4. **Project ref** — for `supabase link` and type generation

Or authenticate the Supabase MCP plugin in Cursor so migrations can be applied directly from here.
