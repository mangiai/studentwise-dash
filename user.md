# UniFlow — Test Users & Demo Reference

All test accounts use the same password:

```
StudentWise123!
```

> **Build & deploy:** see [README.md](./README.md) for full step-by-step instructions (migrations → seeds → Vercel).

## Portal login (`/login`)

| Email | Role | Name | Linked record |
|-------|------|------|---------------|
| `sarah@studentwise.test` | student | Sarah Ahmed | Student `2026-BSCS-0042` |
| `hassan@studentwise.test` | student | Hassan Raza | Student `2026-BSCS-0043` |
| `maryam@studentwise.test` | student | Maryam Khan | Student `2025-BSEE-0118` |
| `teacher@studentwise.test` | teacher | Dr. Aamir Khan | Teacher `FAC-2018-014` |

## Admin login (`/admin/login`)

| Email | Role | Name |
|-------|------|------|
| `admin@studentwise.test` | admin | Portal Admin |
| `moderator@studentwise.test` | moderator | Portal Moderator |

## Quick seed (Supabase cloud, run once)

```bash
# 1. Migrations
npm run db:push

# 2. Demo data — paste supabase/seed-cloud-complete.sql in SQL Editor, OR:
npm run db:seed:cloud

# 3. Auth users
npm run seed:users

# 4. Fall 2026 attendance calendar
npm run db:seed:attendance
```

## Environment variables

See `.env.example` — all Supabase keys must be set locally and on Vercel. Service role key is required for reliable student data and seed scripts.
