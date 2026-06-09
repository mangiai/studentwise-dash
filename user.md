# StudentWise — Test Users & Demo Reference

All test accounts use the same password:

```
StudentWise123!
```

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

## What each user sees (live Supabase data)

### Sarah Ahmed (`sarah@studentwise.test`)
- **6 enrolled courses** with real attendance (CS-304, CS-307, CS-401, CS-403, CS-411, MATH-204)
- **Fee history** and Fall 2026 semester balance
- **Grades** for Fall 2025 and Spring 2025 semesters
- **Notifications** (fee reminders, attendance alerts)

### Hassan Raza (`hassan@studentwise.test`)
- Pending fee status, 3 enrolled courses
- Lower attendance on Operating Systems

### Maryam Khan (`maryam@studentwise.test`)
- Electrical Engineering student, paid fees
- Software Engineering enrollment

### Dr. Aamir Khan (`teacher@studentwise.test`)
- Teacher profile linked to CS faculty
- Access to **Reports** with live department/enrollment stats

### Portal Admin (`admin@studentwise.test`)
- Full **Admin Dashboard** at `/admin/dashboard`
- CRUD students, teachers, courses (persisted to Supabase)
- Manage enrollments per course

## Seed commands (run once on Supabase cloud)

```bash
# 1. Schema + demo data
npx supabase db push
npx supabase db query --linked --file supabase/seed.sql

# 2. Auth users (pick one)
npm run seed:users
# OR
npx supabase db query --linked --file supabase/seed-auth-users.sql
```

## Environment variables

See `.env.example` — all 5 Supabase keys must be set on Vercel and locally.
