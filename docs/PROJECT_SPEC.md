# StudentWise — Full Project Specification

> **Document purpose:** Presentation-ready spec for PPT slides  
> **Project:** StudentWise University Portal Dashboard  
> **Repository:** [github.com/mangiai/studentwise-dash](https://github.com/mangiai/studentwise-dash)  
> **Last updated:** June 10, 2026

---

## 1. Executive Summary

**StudentWise** is a full-stack university portal that lets students, teachers, and administrators manage courses, attendance, fees, grades, and notifications from a single dashboard. The app is built with **React 19 + TanStack Start**, deployed on **Vercel**, and backed by **Supabase Postgres** with Row Level Security (RLS).

| Attribute | Value |
|-----------|-------|
| **Product name** | StudentWise |
| **Tagline** | University Portal |
| **Package name** | `studentwise-dash` |
| **Local dev URL** | http://localhost:3000 |
| **Production URL** | https://studentwise-dash.vercel.app *(configure in Vercel)* |
| **GitHub** | https://github.com/mangiai/studentwise-dash |
| **Source files** | ~86 TypeScript/TSX files (~9,400 lines) |
| **Total commits** | 11 (single-day sprint: June 10, 2026) |

---

## 2. Problem Statement & Goals

### Problem
Universities need a centralized digital portal where students can track academic progress, fees, and attendance; teachers can view analytics; and admins can manage enrollment data — without juggling multiple disconnected systems.

### Goals Achieved
- Role-based portal for **students**, **teachers**, and **admins**
- Live data from Supabase (not static mock data)
- Secure authentication with session cookies (SSR-compatible)
- Admin CRUD for students, teachers, courses, and enrollments
- Production deployment on Vercel with Nitro serverless functions
- Demo-ready seed data and test accounts for presentations

---

## 3. Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2 | UI framework |
| **TanStack Router** | 1.168 | File-based routing |
| **TanStack Start** | 1.167 | Full-stack React framework (SSR + server functions) |
| **TanStack React Query** | 5.83 | Server state / data fetching |
| **Tailwind CSS** | 4.2 | Utility-first styling |
| **shadcn/ui + Radix UI** | Latest | Accessible component library (40+ UI primitives) |
| **Recharts** | 2.15 | Dashboard charts and analytics |
| **Lucide React** | 0.575 | Icon set |
| **React Hook Form + Zod** | 7.71 / 3.24 | Form validation |
| **Sonner** | 2.0 | Toast notifications |
| **date-fns** | 4.1 | Date formatting |

### Backend & Database
| Technology | Purpose |
|------------|---------|
| **Supabase Postgres** | Primary database |
| **Supabase Auth** | Email/password authentication |
| **@supabase/ssr** | Cookie-based sessions for SSR |
| **Row Level Security (RLS)** | Per-role data access policies |
| **pgcrypto** | Password hashing for seed users |

### Build, Deploy & Tooling
| Technology | Purpose |
|------------|---------|
| **Vite** | 7.3 — Dev server and bundler |
| **Nitro** | 3.0 — Serverless preset for Vercel |
| **Node.js** | 22.x — Runtime (local + Vercel functions) |
| **TypeScript** | 5.8 — Type safety |
| **ESLint + Prettier** | Code quality |
| **Supabase CLI** | Migrations, local DB, type generation |

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (React 19)                       │
│  TanStack Router │ shadcn/ui │ Recharts │ Tailwind CSS v4   │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP / Cookies
┌──────────────────────────▼──────────────────────────────────┐
│              Vercel (Nitro Serverless Functions)             │
│         TanStack Start Server Functions (SSR)                │
│    auth guards │ data loaders │ admin CRUD mutations           │
└──────────────────────────┬──────────────────────────────────┘
                           │ Supabase JS Client
┌──────────────────────────▼──────────────────────────────────┐
│                    Supabase Cloud                            │
│   Auth (GoTrue) │ Postgres + RLS │ Realtime (ready)          │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. User Roles & Access Control

| Role | Login URL | Access |
|------|-----------|--------|
| **Student** | `/login` | Dashboard, courses, attendance, fees, teachers, results, notifications, settings |
| **Teacher** | `/login` | All student pages + **Reports & Analytics** |
| **Admin** | `/admin/login` | Full portal + **Admin Dashboard** (CRUD) |

### Auth Guards
- `requireAuth` — redirects unauthenticated users to `/login`
- `requireGuest` — redirects signed-in users away from login/signup
- `requireAdmin` — restricts admin routes to `role = admin`
- `requireAdminGuest` — admin login page guard

### Session Model
- Supabase Auth with **HTTP cookies** via `@supabase/ssr`
- Profile auto-created on signup via Postgres trigger (`handle_new_user`)
- Role stored in `auth.users.raw_app_meta_data.role` and `profiles.role`

---

## 5. Feature Map — All Routes & Links

> Replace `{BASE_URL}` with `http://localhost:3000` (local) or your Vercel production URL.

### 5.1 Public / Auth Routes

| Feature | Route | Link | Description |
|---------|-------|------|-------------|
| **Home redirect** | `/` | `{BASE_URL}/` | Redirects to `/dashboard` if logged in, else `/login` |
| **Student/Teacher Login** | `/login` | `{BASE_URL}/login` | Email + password sign-in |
| **Admin Login** | `/admin/login` | `{BASE_URL}/admin/login` | Separate admin portal entry |
| **Sign Up** | `/signup` | `{BASE_URL}/signup` | New student registration + student ID linking |

### 5.2 Student & Shared Portal Routes

| Feature | Route | Link | Roles | Live Data |
|---------|-------|------|-------|-----------|
| **Dashboard** | `/dashboard` | `{BASE_URL}/dashboard` | All | ✅ Stats, charts, GPA, attendance overview |
| **My Courses** | `/courses` | `{BASE_URL}/courses` | All | ✅ Enrollments, credits, attendance badges |
| **Attendance** | `/attendance` | `{BASE_URL}/attendance` | All | ✅ Per-course %, ring charts, short-attendance alerts |
| **Fee Management** | `/fees` | `{BASE_URL}/fees` | Student, Admin | ✅ Semester balance, payment history (PKR) |
| **Faculty Directory** | `/teachers` | `{BASE_URL}/teachers` | All | ✅ Teacher cards from database |
| **Academic Results** | `/results` | `{BASE_URL}/results` | All | ✅ Semester grades, CGPA, grade badges |
| **Notifications** | `/notifications` | `{BASE_URL}/notifications` | All | ✅ Fee, attendance, course, announcement alerts |
| **Settings** | `/settings` | `{BASE_URL}/settings` | All | Profile, notification preferences (UI) |

### 5.3 Teacher & Admin Analytics

| Feature | Route | Link | Roles | Live Data |
|---------|-------|------|-------|-----------|
| **Reports & Analytics** | `/reports` | `{BASE_URL}/reports` | Teacher, Admin | ✅ Enrollment trends, fee status, attendance, department charts |

### 5.4 Admin Panel

| Feature | Route | Link | Roles | Live Data |
|---------|-------|------|-------|-----------|
| **Admin Dashboard** | `/admin/dashboard` | `{BASE_URL}/admin/dashboard` | Admin only | ✅ Full CRUD operations |

**Admin capabilities:**
- Create / edit / delete **students**
- Create / edit / delete **teachers**
- Create / edit / delete **courses**
- **Enroll / unenroll** students in courses
- **Assign instructors** to courses
- Search and filter across all entities
- Tabbed interface: Students | Teachers | Courses

### 5.5 Sidebar Navigation (Role-Filtered)

Defined in `AppLayout.tsx` — each link appears only for allowed roles:

| Nav Item | Route | Student | Teacher | Admin |
|----------|-------|:-------:|:-------:|:-----:|
| Dashboard | `/dashboard` | ✅ | ✅ | ✅ |
| My Courses | `/courses` | ✅ | ✅ | ✅ |
| Attendance | `/attendance` | ✅ | ✅ | ✅ |
| Fee Management | `/fees` | ✅ | — | ✅ |
| Teachers | `/teachers` | ✅ | ✅ | ✅ |
| Results | `/results` | ✅ | ✅ | ✅ |
| Reports | `/reports` | — | ✅ | ✅ |
| Admin Panel | `/admin/dashboard` | — | — | ✅ |
| Notifications | `/notifications` | ✅ | ✅ | ✅ |
| Settings | `/settings` | ✅ | ✅ | ✅ |

---

## 6. Test Users & Demo Credentials

### Universal Password
```
StudentWise123!
```

### Portal Login — `/login`

| Email | Role | Display Name | Linked Record | Best For Demo |
|-------|------|--------------|---------------|---------------|
| `sarah@studentwise.test` | student | Sarah Ahmed | Student `2026-BSCS-0042` | **Primary student demo** — 6 courses, grades, fees, notifications |
| `hassan@studentwise.test` | student | Hassan Raza | Student `2026-BSCS-0043` | Pending fees, low attendance scenario |
| `maryam@studentwise.test` | student | Maryam Khan | Student `2025-BSEE-0118` | EE department, paid fees |
| `teacher@studentwise.test` | teacher | Dr. Aamir Khan | Teacher `FAC-2018-014` | **Teacher demo** — Reports page |

### Admin Login — `/admin/login`

| Email | Role | Display Name | Best For Demo |
|-------|------|--------------|---------------|
| `admin@studentwise.test` | admin | Portal Admin | **Admin CRUD demo** — full management panel |

### Per-User Demo Highlights

**Sarah Ahmed** (`sarah@studentwise.test`)
- 6 enrolled courses: CS-304, CS-307, CS-401, CS-403, CS-411, MATH-204
- Real attendance records (e.g., OS at 68% — short attendance alert)
- Fee history + Fall 2026 semester balance (PKR 98,000 total)
- Grades for Fall 2025 and Spring 2025
- 4 notifications (2 unread)

**Hassan Raza** (`hassan@studentwise.test`)
- Fee status: Pending
- 3 enrolled courses
- Lower attendance on Operating Systems

**Maryam Khan** (`maryam@studentwise.test`)
- Electrical Engineering (BSEE)
- Paid fees, Software Engineering enrollment

**Dr. Aamir Khan** (`teacher@studentwise.test`)
- CS faculty, 3 courses
- Access to Reports & Analytics with live charts

**Portal Admin** (`admin@studentwise.test`)
- Full Admin Dashboard at `/admin/dashboard`
- CRUD students, teachers, courses (persisted to Supabase)

---

## 7. Database Schema

### Tables (11 total)

| Table | Description |
|-------|-------------|
| `departments` | CS, EE, BBA, MATH |
| `profiles` | User profiles linked to `auth.users` |
| `students` | Student records (ID, GPA, credits, fee status) |
| `teachers` | Faculty records |
| `courses` | Course catalog with instructor assignment |
| `enrollments` | Student ↔ course mapping per semester |
| `attendance_records` | Auto-calculated attendance % per enrollment |
| `fee_transactions` | Payment history (PKR) |
| `semester_fees` | Current semester fee balances |
| `course_grades` | Semester grades and grade points |
| `notifications` | User-specific alerts (fee, attendance, course, announcement) |

### Enums
- `fee_status`: Paid, Pending, Overdue
- `person_status`: Active, Hold, On Leave

### Security
- **RLS enabled** on all public tables
- Students read **own** records only
- Teachers read students, enrollments, attendance (read-only)
- Admins have **full CRUD** on all tables
- Auto-profile trigger on new auth user signup

### Migrations
| File | Description |
|------|-------------|
| `20250610000000_initial_schema.sql` | Core schema + RLS policies |
| `20250610100000_grades_notifications.sql` | Grades, notifications, teacher read policies |

### Seed Scripts
| File / Command | Purpose |
|----------------|---------|
| `supabase/seed.sql` | Demo departments, students, courses, enrollments, fees, grades |
| `supabase/seed-auth-users.sql` | 5 test auth users with fixed UUIDs |
| `npm run seed:users` | Admin API seed script (recommended for cloud) |

---

## 8. Server Functions (API Layer)

All data access goes through TanStack Start server functions in `src/lib/supabase/data.ts`:

| Function | Method | Purpose |
|----------|--------|---------|
| `fetchPortalDashboard` | GET | Role-aware dashboard stats and charts |
| `fetchStudentCourses` | GET | Enrolled courses with attendance |
| `fetchStudentAttendance` | GET | Per-course attendance + summary |
| `fetchStudentFees` | GET | Semester fees + transaction history |
| `fetchTeachersDirectory` | GET | Faculty directory |
| `fetchStudentResults` | GET | Grades grouped by semester |
| `fetchNotifications` | GET | User notifications |
| `markNotificationsRead` | POST | Mark all notifications as read |
| `fetchReportsData` | GET | Analytics for teachers/admins |
| `fetchAdminData` | GET | Admin panel data (students, teachers, courses) |
| `fetchDepartments` | GET | Department list for forms |
| `adminUpsertStudent` | POST | Create/update student |
| `adminDeleteStudent` | POST | Delete student |
| `adminUpsertTeacher` | POST | Create/update teacher |
| `adminDeleteTeacher` | POST | Delete teacher |
| `adminUpsertCourse` | POST | Create/update course |
| `adminDeleteCourse` | POST | Delete course |
| `adminEnrollStudent` | POST | Enroll student in course |
| `adminUnenrollStudent` | POST | Remove enrollment |
| `adminAssignInstructor` | POST | Assign teacher to course |

---

## 9. Development Timeline & Effort

### Git Commit History (June 10, 2026)

| # | Commit | Description |
|---|--------|-------------|
| 1 | `99f4c4e` | **Initial commit** — StudentWise university dashboard (UI scaffold) |
| 2 | `f1a1ca4` | Initial commit to repo |
| 3 | `c07795a` | Redeploy |
| 4 | `095cf4d` | **Vercel account** setup and deployment config |
| 5 | `521a6c1` | Removed Lovable branding — custom StudentWise identity |
| 6 | `5a70dbe` | **Auth setup** — Supabase login, signup, session cookies, test users |
| 7 | `6850f09` | **Admin route** — dedicated admin login + admin dashboard |
| 8 | `ee52777` | Fix dashboard navigation buttons |
| 9 | `cdee9f2` | **Dynamic data** — live Supabase integration across all pages |
| 10 | `529fcaf` | Fix 404 errors on console |
| 11 | `b2d522b` | Fix page not found on homepage |

### Development Effort Summary

| Area | Work Completed |
|------|----------------|
| **UI / UX** | 10+ portal pages, responsive sidebar layout, admin panel with dialogs/tabs/tables, Recharts dashboards, role-based navigation |
| **Authentication** | Email/password login, signup with student linking, SSR cookie sessions, role guards, separate admin login |
| **Database** | 2 migrations, 11 tables, RLS policies, triggers, seed data for 6 students + 4 teachers + 9 courses |
| **Backend integration** | 19 server functions, typed Supabase client, admin CRUD mutations |
| **DevOps** | Vercel deployment (Nitro preset), env config, cache headers, Node 22 runtime |
| **Documentation** | README, AUTH_SETUP.md, user.md, seed scripts |
| **Code volume** | 262 files changed since initial commit (~109K insertions) |

### Key Milestones (for PPT slides)

1. **Phase 1 — Foundation:** React dashboard UI with shadcn components
2. **Phase 2 — Deploy:** Vercel + Nitro serverless + custom branding
3. **Phase 3 — Auth:** Supabase Auth, profiles, role-based guards
4. **Phase 4 — Admin:** Full admin CRUD panel
5. **Phase 5 — Live Data:** Supabase Postgres integration on every page
6. **Phase 6 — Polish:** 404 fixes, homepage redirect, production hardening

---

## 10. Deployment & Environment

### Vercel Configuration (`vercel.json`)
- Framework: **TanStack Start**
- Build: `npm run build`
- Node.js **22.x** runtime
- Cache-Control: no-store for HTML, immutable for `/assets/**`

### Required Environment Variables

| Variable | Scope | Required |
|----------|-------|:--------:|
| `VITE_SUPABASE_URL` | Browser | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Browser | ✅ |
| `SUPABASE_URL` | Server (SSR) | ✅ |
| `SUPABASE_ANON_KEY` | Server (SSR) | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Server (admin seed, signup linking) | ✅ |

### NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server at :3000 |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm run db:push` | Push migrations to Supabase |
| `npm run db:reset` | Reset local DB with seed |
| `npm run db:types` | Regenerate TypeScript types |
| `npm run seed:users` | Create test auth users via Admin API |

---

## 11. Demo Walkthrough (Suggested PPT Flow)

### Slide-friendly demo script

1. **Landing** → Open `{BASE_URL}` → auto-redirect to login
2. **Student view** → Login as `sarah@studentwise.test` / `StudentWise123!`
3. **Dashboard** → Show GPA, attendance chart, course progress
4. **Courses** → 6 enrolled courses with attendance badges
5. **Attendance** → Ring charts, short-attendance warning on OS
6. **Fees** → PKR balance, payment history
7. **Results** → Semester grades table, CGPA
8. **Notifications** → Unread fee + attendance alerts
9. **Logout** → Sign out
10. **Teacher view** → Login as `teacher@studentwise.test` → **Reports** page with charts
11. **Admin view** → Go to `/admin/login` → `admin@studentwise.test` → CRUD a student or course live

---

## 12. Project Structure

```
studentwise-dash/
├── src/
│   ├── routes/              # File-based pages (TanStack Router)
│   │   ├── admin/           # Admin login + dashboard
│   │   ├── dashboard.tsx    # Main dashboard
│   │   ├── courses.tsx      # Enrolled courses
│   │   ├── attendance.tsx   # Attendance tracking
│   │   ├── fees.tsx         # Fee management
│   │   ├── teachers.tsx     # Faculty directory
│   │   ├── results.tsx      # Academic grades
│   │   ├── reports.tsx      # Analytics (teacher/admin)
│   │   ├── notifications.tsx
│   │   ├── settings.tsx
│   │   ├── login.tsx / signup.tsx
│   │   └── index.tsx        # Root redirect
│   ├── components/
│   │   ├── AppLayout.tsx    # Sidebar + header shell
│   │   ├── AdminLayout.tsx  # Admin panel shell
│   │   └── ui/              # shadcn/ui components (40+)
│   ├── lib/
│   │   ├── supabase/        # Client, server, auth, data layer
│   │   ├── auth-guards.ts   # Route protection
│   │   └── database.types.ts
│   └── hooks/
│       └── use-auth.ts
├── supabase/
│   ├── migrations/          # Schema + RLS
│   ├── seed.sql             # Demo data
│   └── seed-auth-users.sql  # Test accounts
├── scripts/
│   └── seed-test-users.mjs  # Admin API user seeder
├── docs/
│   ├── PROJECT_SPEC.md      # This document
│   └── AUTH_SETUP.md        # Auth configuration guide
├── vercel.json
├── nitro.config.ts
└── package.json
```

---

## 13. Future Enhancements (Roadmap)

| Priority | Feature | Status |
|----------|---------|--------|
| High | Settings page — persist profile updates to Supabase | UI only |
| High | Fee payment gateway integration | Not started |
| Medium | Teacher — mark attendance for students | Not started |
| Medium | Real-time notifications via Supabase Realtime | Infrastructure ready |
| Medium | PDF export for results / fee receipts | Button UI exists |
| Low | Mobile sidebar drawer | Partial (desktop sidebar) |
| Low | Email notifications | Toggle in settings (UI only) |

---

## 14. Quick Reference Card (Copy to PPT)

```
┌──────────────────────────────────────────────────────────────┐
│  STUDENTWISE — UNIVERSITY PORTAL                              │
├──────────────────────────────────────────────────────────────┤
│  Stack: React 19 · TanStack Start · Supabase · Vercel        │
│  Repo:  github.com/mangiai/studentwise-dash                  │
│  Local: http://localhost:3000                                │
├──────────────────────────────────────────────────────────────┤
│  TEST USERS (password: StudentWise123!)                      │
│  Student:  sarah@studentwise.test    → /login                │
│  Teacher:  teacher@studentwise.test  → /login                │
│  Admin:    admin@studentwise.test    → /admin/login          │
├──────────────────────────────────────────────────────────────┤
│  KEY ROUTES                                                   │
│  /dashboard  /courses  /attendance  /fees  /results          │
│  /teachers   /notifications  /reports  /admin/dashboard      │
└──────────────────────────────────────────────────────────────┘
```

---

*End of specification document.*
