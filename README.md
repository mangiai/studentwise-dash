# UniFlow — Build & Deploy Instructions

University portal (student, teacher, admin, moderator) built with **TanStack Start**, **Supabase Postgres**, deployed on **Vercel**.

This document is the **build playbook** — follow the phases in order.

---

## Architecture

```
Browser  →  TanStack Start (Vercel)  →  Supabase Postgres + Auth + Realtime
                ↑
         Server functions in src/lib/supabase/data.ts
         RLS on all student-facing tables
```

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TanStack Router, Tailwind v4, shadcn/ui |
| Server | TanStack Start server functions (`createServerFn`) |
| Database | Supabase Postgres, migrations in `supabase/migrations/` |
| Auth | Supabase Auth + `profiles` table (roles: student, teacher, admin, moderator) |
| Deploy | Vercel (`vercel.json` runs migrations then `npm run build`) |

---

## Phase 1 — Prerequisites

Install on your machine:

- **Node.js 22.x** (`node -v`)
- **npm**
- **Git**
- **Supabase CLI** (optional but recommended): `npm install -g supabase`

Create a **Supabase cloud project** at [supabase.com/dashboard](https://supabase.com/dashboard).

---

## Phase 2 — Clone & install

```bash
git clone <your-repo-url>
cd studentwise-dash-main
npm install
cp .env.example .env
```

---

## Phase 3 — Environment variables

Edit `.env` with values from **Supabase → Project Settings → API**:

| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_SUPABASE_URL` | Yes | Browser Supabase client |
| `VITE_SUPABASE_ANON_KEY` | Yes | Browser Supabase client |
| `SUPABASE_URL` | Yes | Server-side Supabase |
| `SUPABASE_ANON_KEY` | Yes | Server-side Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | **Yes for seeds** | Bypass RLS in seed scripts & reliable student data reads |

**Vercel (Production + Preview)** — add the same five variables in **Project Settings → Environment Variables**.

**Optional (auto-migrate on deploy):**

| Variable | Purpose |
|----------|---------|
| `SUPABASE_ACCESS_TOKEN` | Supabase account access token |
| `SUPABASE_DB_PASSWORD` | Database password |
| `SUPABASE_PROJECT_REF` | Project ref (e.g. `abcdefgh` from URL) |

When these three are set, `npm run db:deploy` runs `supabase db push` during Vercel build.

---

## Phase 4 — Database migrations

Migrations apply **in filename order**. Do not skip any.

| Migration | What it adds |
|-----------|--------------|
| `20250610000000_initial_schema.sql` | Core tables, RLS, departments, students, courses, fees |
| `20250610100000_grades_notifications.sql` | Grades, notifications, extra RLS |
| `20250610200000_moderator_settings_realtime.sql` | Moderator role, settings, realtime |
| `20250610300000_moderator_auth_user.sql` | Moderator auth user (SQL seed) |
| `20250610400000_class_sessions_attendance.sql` | Fall attendance calendar, session marks |

### Option A — Linked Supabase project (recommended)

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npm run db:push
```

### Option B — Local Supabase

```bash
npm run db:start
npm run db:reset    # applies all migrations + supabase/seed.sql
```

### Option C — Vercel / CI

Set deploy env vars → push to `main` → Vercel runs `npm run db:deploy && npm run build`.

GitHub Actions also runs migrations when `supabase/migrations/**` changes (`.github/workflows/supabase-migrate.yml`).

---

## Phase 5 — Seed data (one-time per environment)

Run **after** migrations. Order matters.

### Step 5.1 — Demo rows (students, courses, enrollments, fees)

**Easiest (SQL Editor):** Supabase Dashboard → **SQL Editor** → paste & run entire file:

```
supabase/seed-cloud-complete.sql
```

**Or CLI:**

```bash
npm run db:seed:cloud
```

### Step 5.2 — Auth users (login accounts)

Requires `SUPABASE_SERVICE_ROLE_KEY` in `.env`:

```bash
npm run seed:users
```

**Or SQL:**

```bash
npm run db:seed:auth
```

If moderator login fails, also run:

```bash
npx supabase db query --linked --file supabase/seed-moderator-user.sql
```

### Step 5.3 — Fall 2026 attendance (calendar + session marks)

**SQL Editor (recommended):**

```
supabase/seed-fall-attendance.sql
```

**Or CLI:**

```bash
npm run db:seed:attendance
```

**Or Node** (needs service role key in `.env`):

```bash
npm run seed:attendance
```

---

## Phase 6 — Local development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Portal | URL | Test login |
|--------|-----|------------|
| Student / Teacher | `/login` | `sarah@studentwise.test` |
| Admin / Moderator | `/admin/login` | `admin@studentwise.test` or `moderator@studentwise.test` |

**Password for all test users:** `StudentWise123!`

See `user.md` for full test-user reference.

---

## Phase 7 — Production build & deploy

### Local production check

```bash
npm run build
npm run preview
```

### Deploy to Vercel

1. Push repo to GitHub.
2. Import project at [vercel.com/new](https://vercel.com/new) (framework: **TanStack Start**).
3. Set all env vars from Phase 3.
4. Deploy — build command is already:

   ```
   npm run db:deploy && npm run build
   ```

5. After first deploy, run **Phase 5 seeds** against production Supabase if not done yet (SQL Editor on cloud project).

```bash
npx vercel --prod
```

---

## Phase 8 — Verify it works

Use this checklist after build + seed:

- [ ] `/login` → student dashboard shows courses & attendance **> 0%**
- [ ] `/attendance` → calendar has sessions (Jan–Jun 2026)
- [ ] `/fees` → Download Challan works
- [ ] `/admin/login` → admin sees students, can edit challan status
- [ ] `moderator@studentwise.test` → staff portal (no delete on admin-only actions)
- [ ] Realtime: open student + admin side-by-side; admin edit reflects on student after refresh

---

## Scripts reference

| Command | When to use |
|---------|-------------|
| `npm run dev` | Local development |
| `npm run build` | Production build only |
| `npm run db:push` | Apply migrations to linked Supabase |
| `npm run db:deploy` | CI/Vercel migration push |
| `npm run db:reset` | Local DB wipe + migrate + seed.sql |
| `npm run seed:users` | Create auth users (needs service role key) |
| `npm run seed:attendance` | Generate Fall 2026 session attendance |
| `npm run db:seed:cloud` | Full demo data via SQL file |
| `npm run db:seed:attendance` | Attendance seed via SQL file |
| `npm run db:types` | Regenerate `src/lib/database.types.ts` (local) |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Student sees 0 courses | Run `seed-cloud-complete.sql`; ensure `SUPABASE_SERVICE_ROLE_KEY` on Vercel |
| Attendance page empty | Run `seed-fall-attendance.sql` after migration `10400000` |
| Moderator invalid credentials | Run `seed-moderator-user.sql` |
| Migrations not on deploy | Set `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD`, `SUPABASE_PROJECT_REF` on Vercel |
| Build fails locally without Supabase | Expected — `db:deploy` skips if deploy vars missing; `npm run build` still works |

---

## Project layout (key paths)

```
src/
  routes/           # Pages (file-based routing)
  lib/supabase/     # data.ts (server functions), auth.ts, client.ts
  components/       # AppLayout, AdminLayout, UI
supabase/
  migrations/       # Schema (source of truth)
  seed-cloud-complete.sql
  seed-fall-attendance.sql
  seed-auth-users.sql
scripts/
  deploy-db.mjs
  seed-fall-attendance.mjs
  seed-test-users.mjs
```

Brand name and theme tokens: `src/lib/brand.ts`, `src/styles.css`.
