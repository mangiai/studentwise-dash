# StudentWise Auth Setup

## 1. Supabase Dashboard settings

### Authentication → Providers → Email
- Enable **Email** provider
- Turn **OFF** "Confirm email" for dev (already in `supabase/config.toml`)

### Authentication → URL Configuration
| Field | Value |
|-------|-------|
| Site URL | `http://localhost:3000` (local) or your Vercel URL |
| Redirect URLs | `http://localhost:3000/**` |
| | `https://your-app.vercel.app/**` |
| | `https://*.vercel.app/**` |

---

## 2. Environment variables

### Local `.env`
```env
VITE_SUPABASE_URL=https://YOUR_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=https://YOUR_REF.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Vercel (Production + Preview + Development)
Same 5 variables as above.

> `SUPABASE_SERVICE_ROLE_KEY` is required for signup student-linking and the test user seed script.

---

## 3. Push database + seed

```bash
npx supabase login
npx supabase link --project-ref YOUR_REF
npm run db:push
npx supabase db query --linked --file supabase/seed.sql
npm run seed:users
```

---

## 4. Test users (password for all: `StudentWise123!`)

| Email | Role | Linked record |
|-------|------|---------------|
| admin@studentwise.test | admin | Full access |
| sarah@studentwise.test | student | Student 2026-BSCS-0042 |
| hassan@studentwise.test | student | Student 2026-BSCS-0043 |
| teacher@studentwise.test | teacher | Teacher FAC-2018-014 |
| maryam@studentwise.test | student | Student 2025-BSEE-0118 |

---

## 5. How auth works in the app

- **Login / Signup** → Supabase Auth (email + password)
- **Session** → HTTP cookies via `@supabase/ssr`
- **Profiles** → auto-created on signup (trigger reads `app_metadata.role`)
- **Protected routes** → redirect to `/login` if not signed in
- **Admin panel** → only `role = admin`

---

## 6. Run locally

```bash
npm install
cp .env.example .env   # fill in keys
npm run seed:users     # create test users (once)
npm run dev
```

Open http://localhost:3000 → redirects to login → use any test email above.
