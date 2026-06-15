# UniFlow — Full Project Specification

> **Document purpose:** Presentation-ready spec for PPT slides  
> **Project:** UniFlow University Portal Dashboard  
> **Repository:** [github.com/mangiai/studentwise-dash](https://github.com/mangiai/studentwise-dash)  
> **Last updated:** June 15, 2026

---

## 1. Executive Summary

**UniFlow** is a full-stack university portal that lets students, teachers, and staff manage courses, attendance, fees, grades, and notifications from a single dashboard. The app is built with **React 19 + TanStack Start**, deployed on **Vercel**, and backed by **Supabase Postgres** with Row Level Security (RLS) and Realtime subscriptions.

| Attribute | Value |
|-----------|-------|
| **Product name** | UniFlow |
| **Tagline** | University Portal |
| **Package name** | `studentwise-dash` |
| **Local dev URL** | http://localhost:3000 |
| **Production URL** | https://studentwise-dash.vercel.app *(configure in Vercel)* |
| **GitHub** | https://github.com/mangiai/studentwise-dash |
| **Source files** | ~103 TypeScript/TSX files (~12,400 lines) |
| **Total commits** | 28 (sprint: June 10–15, 2026) |

---

## 2. Problem Statement & Goals

### Problem
Universities need a centralized digital portal where students can track academic progress, fees, and attendance; teachers can view analytics; and staff can manage enrollment data — without juggling multiple disconnected systems.

### Goals Achieved
- Role-based portal for **students**, **teachers**, **admins**, and **moderators**
- Live data from Supabase (not static mock data)
- Secure authentication with session cookies (SSR-compatible)
- Staff CRUD for students, teachers, courses, enrollments, attendance, fees, and notifications
- Session-level attendance tracking with auto-synced summaries
- Real-time UI updates via Supabase Realtime
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
| **Supabase Realtime** | Live invalidation on enrollments, fees, grades, attendance, notifications |
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
│  Realtime hooks  │ MobileNavBar │ NotificationBell           │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP / Cookies
┌──────────────────────────▼──────────────────────────────────┐
│              Vercel (Nitro Serverless Functions)             │
│         TanStack Start Server Functions (SSR)                │
│    auth guards │ data loaders │ staff CRUD mutations         │
└──────────────────────────┬──────────────────────────────────┘
                           │ Supabase JS Client
┌──────────────────────────▼──────────────────────────────────┐
│                    Supabase Cloud                            │
│   Auth (GoTrue) │ Postgres + RLS │ Realtime (active)         │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. User Roles & Access Control

| Role | Login URL | Access |
|------|-----------|--------|
| **Student** | `/login` | Dashboard, courses, attendance, fees, teachers, results, notifications, settings |
| **Teacher** | `/login` | All student pages + **Reports & Analytics** |
| **Admin** | `/admin/login` | Full staff portal — CRUD + **delete** permissions |
| **Moderator** | `/admin/login` | Staff portal — CRUD **without delete** |

### Staff vs Admin
- **Staff** = `admin` or `moderator` (shared staff portal at `/admin/*`)
- **Moderators** can create and edit records but cannot delete students, teachers, or courses
- Enforced in UI via `useStaffPermissions()` and in RLS via `is_staff()` / `is_admin()` helpers

### Auth Guards
- `requireAuth` — redirects unauthenticated users to `/login`
- `requireGuest` — redirects signed-in users away from login/signup
- `requireStaff` — restricts staff routes to `admin` or `moderator`
- `requireStaffGuest` — staff login page guard (redirects signed-in staff to `/admin/dashboard`)

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
| **Staff Login** | `/admin/login` | `{BASE_URL}/admin/login` | Admin & moderator portal entry |
| **Sign Up** | `/signup` | `{BASE_URL}/signup` | New student registration + student ID linking |

### 5.2 Student & Shared Portal Routes

| Feature | Route | Link | Roles | Live Data |
|---------|-------|------|-------|-----------|
| **Dashboard** | `/dashboard` | `{BASE_URL}/dashboard` | Student, Teacher, Admin | ✅ Stats, charts, GPA, attendance overview |
| **My Courses** | `/courses` | `{BASE_URL}/courses` | Student, Teacher, Admin | ✅ Enrollments, credits, attendance badges |
| **Attendance** | `/attendance` | `{BASE_URL}/attendance` | Student, Teacher, Admin | ✅ Per-course %, ring charts, short-attendance alerts |
| **Fee Management** | `/fees` | `{BASE_URL}/fees` | Student, Admin | ✅ Semester balance, payment history, fee challan (PKR) |
| **Faculty Directory** | `/teachers` | `{BASE_URL}/teachers` | Student, Teacher, Admin | ✅ Teacher cards from database |
| **Academic Results** | `/results` | `{BASE_URL}/results` | Student, Teacher, Admin | ✅ Semester grades, CGPA, grade badges |
| **Notifications** | `/notifications` | `{BASE_URL}/notifications` | Student, Teacher, Admin | ✅ Fee, attendance, course, announcement alerts |
| **Settings** | `/settings` | `{BASE_URL}/settings` | Student, Teacher, Admin | ✅ Profile, notification prefs, password change (persisted) |

### 5.3 Teacher & Admin Analytics

| Feature | Route | Link | Roles | Live Data |
|---------|-------|------|-------|-----------|
| **Reports & Analytics** | `/reports` | `{BASE_URL}/reports` | Teacher, Admin | ✅ Enrollment trends, fee status, attendance, department charts |

### 5.4 Staff Portal (Admin & Moderator)

| Feature | Route | Link | Roles | Live Data |
|---------|-------|------|-------|-----------|
| **Overview** | `/admin/dashboard` | `{BASE_URL}/admin/dashboard` | Staff | ✅ Summary stats and quick links |
| **Students** | `/admin/students` | `{BASE_URL}/admin/students` | Staff | ✅ Create / edit students (delete: admin only) |
| **Teachers** | `/admin/teachers` | `{BASE_URL}/admin/teachers` | Staff | ✅ Create / edit teachers (delete: admin only) |
| **Courses** | `/admin/courses` | `{BASE_URL}/admin/courses` | Staff | ✅ Create / edit courses, assign instructors |
| **Enrollments** | `/admin/enrollments` | `{BASE_URL}/admin/enrollments` | Staff | ✅ Enroll / unenroll students in courses |
| **Attendance** | `/admin/attendance` | `{BASE_URL}/admin/attendance` | Staff | ✅ Mark per-session attendance (Fall 2026 term) |
| **Fees & Challans** | `/admin/fees` | `{BASE_URL}/admin/fees` | Staff | ✅ Regenerate challans, update fee status |
| **Notifications** | `/admin/notifications` | `{BASE_URL}/admin/notifications` | Staff | ✅ Create and broadcast user notifications |

**Staff capabilities:**
- Create / edit **students**, **teachers**, **courses**
- **Enroll / unenroll** students in courses
- **Assign instructors** to courses
- **Mark session attendance** per student per class date
- **Manage fee challans** — regenerate and update Paid / Pending / Overdue
- **Send notifications** to individual users
- **Upsert grades** for students
- Search and filter across all entities
- **Delete** operations restricted to **admin** role only

### 5.5 Sidebar Navigation (Role-Filtered)

**Student portal** (`AppLayout.tsx`):

| Nav Item | Route | Student | Teacher | Admin |
|----------|-------|:-------:|:-------:|:-----:|
| Dashboard | `/dashboard` | ✅ | ✅ | ✅ |
| My Courses | `/courses` | ✅ | ✅ | ✅ |
| Attendance | `/attendance` | ✅ | ✅ | ✅ |
| Fee Management | `/fees` | ✅ | — | ✅ |
| Teachers | `/teachers` | ✅ | ✅ | ✅ |
| Results | `/results` | ✅ | ✅ | ✅ |
| Reports | `/reports` | — | ✅ | ✅ |
| Notifications | `/notifications` | ✅ | ✅ | ✅ |
| Settings | `/settings` | ✅ | ✅ | ✅ |

**Staff portal** (`AdminLayout.tsx`):

| Nav Item | Route | Admin | Moderator |
|----------|-------|:-----:|:---------:|
| Overview | `/admin/dashboard` | ✅ | ✅ |
| Students | `/admin/students` | ✅ | ✅ |
| Teachers | `/admin/teachers` | ✅ | ✅ |
| Courses | `/admin/courses` | ✅ | ✅ |
| Enrollments | `/admin/enrollments` | ✅ | ✅ |
| Attendance | `/admin/attendance` | ✅ | ✅ |
| Fees & Challans | `/admin/fees` | ✅ | ✅ |
| Notifications | `/admin/notifications` | ✅ | ✅ |

> Moderators use the same staff portal but delete buttons are hidden. Mobile bottom nav is available on student portal pages.

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

### Staff Login — `/admin/login`

| Email | Role | Display Name | Best For Demo |
|-------|------|--------------|---------------|
| `admin@studentwise.test` | admin | Portal Admin | **Full staff demo** — CRUD + delete |
| `moderator@studentwise.test` | moderator | Portal Moderator | **Limited staff demo** — CRUD without delete |

### Per-User Demo Highlights

**Sarah Ahmed** (`sarah@studentwise.test`)
- 6 enrolled courses: CS-304, CS-307, CS-401, CS-403, CS-411, MATH-204
- Real attendance records (e.g., OS at 68% — short attendance alert)
- Fee history + Spring 2026 semester balance (PKR)
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
- Full staff portal at `/admin/dashboard`
- CRUD students, teachers, courses, attendance, fees (persisted to Supabase)

**Portal Moderator** (`moderator@studentwise.test`)
- Same staff portal as admin
- Can edit records but cannot delete students, teachers, or courses

---

## 7. Database Schema

### Tables (13 total)

| Table | Description |
|-------|-------------|
| `departments` | CS, EE, BBA, MATH |
| `profiles` | User profiles linked to `auth.users` (includes notification prefs) |
| `students` | Student records (ID, GPA, credits, fee status) |
| `teachers` | Faculty records |
| `courses` | Course catalog with instructor assignment |
| `enrollments` | Student ↔ course mapping per semester |
| `attendance_records` | Auto-calculated attendance % per enrollment (synced from sessions) |
| `class_sessions` | Individual class dates/times per course (Fall 2026 term) |
| `session_attendance` | Per-session present/absent marks per enrollment |
| `fee_transactions` | Payment history (PKR) |
| `semester_fees` | Current semester fee balances |
| `course_grades` | Semester grades and grade points |
| `notifications` | User-specific alerts (fee, attendance, course, announcement) |

### Profile Notification Columns
- `notify_email` — email notification toggle
- `notify_push` — push notification toggle
- `notify_fee_reminders` — fee reminder toggle

### Enums
- `fee_status`: Paid, Pending, Overdue
- `person_status`: Active, Hold, On Leave
- `profiles.role`: student, teacher, admin, moderator

### Security
- **RLS enabled** on all public tables
- Students read **own** records only
- Teachers read students, enrollments, attendance (read-only)
- **Staff** (`admin` + `moderator`) have CRUD on all management tables via `is_staff()`
- **Admins** retain elevated delete privileges via `is_admin()` where applicable
- Auto-profile trigger on new auth user signup
- `sync_enrollment_attendance_summary` trigger keeps `attendance_records` in sync with `session_attendance`

### Realtime Publications
Tables published to `supabase_realtime`: `enrollments`, `notifications`, `semester_fees`, `course_grades`, `attendance_records`, `class_sessions`, `session_attendance`

### Migrations
| File | Description |
|------|-------------|
| `20250610000000_initial_schema.sql` | Core schema + RLS policies |
| `20250610100000_grades_notifications.sql` | Grades, notifications, teacher read policies |
| `20250610200000_moderator_settings_realtime.sql` | Moderator role, notification prefs, staff RLS, realtime |
| `20250610300000_moderator_auth_user.sql` | Moderator demo auth user |
| `20250610400000_class_sessions_attendance.sql` | Session-level attendance + summary sync trigger |

### Seed Scripts
| File / Command | Purpose |
|----------------|---------|
| `supabase/seed.sql` | Demo departments, students, courses, enrollments, fees, grades |
| `supabase/seed-cloud-complete.sql` | Full cloud seed (recommended for Supabase cloud) |
| `supabase/seed-auth-users.sql` | 6 test auth users with fixed UUIDs |
| `supabase/seed-fall-attendance.sql` | Fall 2026 class sessions + attendance marks |
| `npm run seed:users` | Admin API seed script (recommended for cloud) |
| `npm run db:seed:cloud` | Push cloud-complete seed via Supabase CLI |
| `npm run db:seed:attendance` | Push Fall 2026 attendance calendar |

### Academic Terms (constants)
| Constant | Value |
|----------|-------|
| `CURRENT_SEMESTER` | Spring 2026 |
| `ATTENDANCE_TERM` | Fall 2026 |
| `ATTENDANCE_TERM_START` | 2026-01-01 |
| `ATTENDANCE_TERM_END` | 2026-06-05 |

---

## 8. Server Functions (API Layer)

All data access goes through TanStack Start server functions in `src/lib/supabase/data.ts`:

| Function | Method | Purpose |
|----------|--------|---------|
| `fetchPortalDashboard` | GET | Role-aware dashboard stats and charts |
| `fetchStudentCourses` | GET | Enrolled courses with attendance |
| `fetchStudentAttendance` | GET | Per-course attendance + summary |
| `fetchAdminAttendance` | GET | Staff attendance grid (sessions per student/course) |
| `adminUpdateSessionAttendance` | POST | Mark present/absent for a class session |
| `fetchStudentFees` | GET | Semester fees + transaction history |
| `generateFeeInvoice` | GET | Generate fee challan for student |
| `fetchTeachersDirectory` | GET | Faculty directory |
| `fetchStudentResults` | GET | Grades grouped by semester |
| `fetchNotifications` | GET | User notifications |
| `fetchUnreadNotificationCount` | GET | Unread notification badge count |
| `markNotificationsRead` | POST | Mark all notifications as read |
| `markNotificationRead` | POST | Mark single notification as read |
| `fetchReportsData` | GET | Analytics for teachers/admins |
| `fetchAdminData` | GET | Staff panel summary data |
| `fetchAdminEnrollments` | GET | Enrollment list for staff portal |
| `fetchAdminStudentGrades` | GET | Grades for a specific student |
| `fetchDepartments` | GET | Department list for forms |
| `fetchUserSettings` | GET | Profile + notification preferences |
| `updateUserProfile` | POST | Save display name |
| `updateNotificationPreferences` | POST | Save notification toggles |
| `changeUserPassword` | POST | Change account password |
| `adminUpsertStudent` | POST | Create/update student |
| `adminDeleteStudent` | POST | Delete student (admin only) |
| `adminUpsertTeacher` | POST | Create/update teacher |
| `adminDeleteTeacher` | POST | Delete teacher (admin only) |
| `adminUpsertCourse` | POST | Create/update course |
| `adminDeleteCourse` | POST | Delete course (admin only) |
| `adminEnrollStudent` | POST | Enroll student in course |
| `adminUnenrollStudent` | POST | Remove enrollment |
| `adminAssignInstructor` | POST | Assign teacher to course |
| `adminUpsertGrade` | POST | Create/update student grade |
| `adminRegenerateChallan` | POST | Regenerate fee challan for student |
| `adminUpdateChallanStatus` | POST | Update fee status (Paid/Pending/Overdue) |
| `adminCreateNotification` | POST | Send notification to a user |

---

## 9. Development Timeline & Effort

### Git Commit History

**Phase 1 — Foundation & Deploy (June 10, 2026)**

| # | Commit | Description |
|---|--------|-------------|
| 1 | `99f4c4e` | **Initial commit** — University dashboard UI scaffold |
| 2–4 | `f1a1ca4`–`095cf4d` | Repo setup, Vercel deployment config |
| 5 | `521a6c1` | Removed Lovable branding — custom identity |
| 6 | `5a70dbe` | **Auth setup** — Supabase login, signup, session cookies |
| 7 | `6850f09` | **Admin route** — dedicated staff login + dashboard |
| 8–11 | `ee52777`–`b2d522b` | Live Supabase data, 404 fixes, homepage redirect |

**Phase 2 — Staff Portal & Features (June 11–15, 2026)**

| # | Commit | Description |
|---|--------|-------------|
| 12–16 | `09d338c`–`c8d1c35` | Env vars, Supabase key setup, build fixes |
| 17 | `80d66fe` | **Admin courses** — add courses from staff panel |
| 18 | `e2b7738` | **Complete seed** — cloud-ready demo data |
| 19 | `c5addf3` | **New server functions** — settings, challans, attendance, notifications |
| 20–24 | `9ec04db`–`c8d627a` | Attendance fixes, challan fixes, UI polish |
| 25–26 | `959a816`–`afadd79` | UI updates and polishing |
| 27 | `fd568e5` | **Rebranding** — StudentWise → UniFlow |

### Development Effort Summary

| Area | Work Completed |
|------|----------------|
| **UI / UX** | 10+ portal pages, staff portal with 8 sections, responsive sidebar + mobile nav, Recharts dashboards, role-based navigation |
| **Authentication** | Email/password login, signup with student linking, SSR cookie sessions, role guards, separate staff login |
| **Database** | 5 migrations, 13 tables, RLS policies, triggers, realtime publications, seed data |
| **Backend integration** | 33 server functions, typed Supabase client, staff CRUD mutations |
| **Realtime** | `useRealtimeInvalidate` hook — live refresh on 5+ tables |
| **Attendance** | Session-level tracking, staff marking UI, auto-synced summary records |
| **Fees** | Fee challan generation, staff challan management |
| **Settings** | Persisted profile, notification prefs, password change |
| **DevOps** | Vercel deployment (Nitro preset), env config, `db:deploy` auto-migrate, Node 22 runtime |
| **Documentation** | README, AUTH_SETUP.md, user.md, PROJECT_SPEC.md, seed scripts |

### Key Milestones (for PPT slides)

1. **Phase 1 — Foundation:** React dashboard UI with shadcn components
2. **Phase 2 — Deploy:** Vercel + Nitro serverless + custom branding
3. **Phase 3 — Auth:** Supabase Auth, profiles, role-based guards
4. **Phase 4 — Staff Portal:** Multi-section admin/moderator management panel
5. **Phase 5 — Live Data:** Supabase Postgres integration on every page
6. **Phase 6 — Attendance & Fees:** Session attendance, challans, realtime sync
7. **Phase 7 — Polish:** UniFlow rebrand, mobile nav, settings persistence, UI polish

---

## 10. Deployment & Environment

### Vercel Configuration (`vercel.json`)
- Framework: **TanStack Start**
- Build: `npm run build` (optionally preceded by `npm run db:deploy`)
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

### Optional (auto-migrate on deploy)

| Variable | Purpose |
|----------|---------|
| `SUPABASE_ACCESS_TOKEN` | Supabase account access token |
| `SUPABASE_DB_PASSWORD` | Database password |
| `SUPABASE_PROJECT_REF` | Project ref from Supabase URL |

### NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server at :3000 |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier format |
| `npm run db:push` | Push migrations to Supabase |
| `npm run db:deploy` | Auto-push migrations (Vercel build) |
| `npm run db:reset` | Reset local DB with seed |
| `npm run db:types` | Regenerate TypeScript types |
| `npm run seed:users` | Create test auth users via Admin API |
| `npm run db:seed:cloud` | Push full cloud seed |
| `npm run db:seed:attendance` | Push Fall 2026 attendance calendar |

---

## 11. Demo Walkthrough (Suggested PPT Flow)

### Slide-friendly demo script

1. **Landing** → Open `{BASE_URL}` → auto-redirect to login
2. **Student view** → Login as `sarah@studentwise.test` / `StudentWise123!`
3. **Dashboard** → Show GPA, attendance chart, course progress (live realtime)
4. **Courses** → 6 enrolled courses with attendance badges
5. **Attendance** → Ring charts, short-attendance warning on OS
6. **Fees** → PKR balance, payment history, download challan
7. **Results** → Semester grades table, CGPA
8. **Notifications** → Unread fee + attendance alerts
9. **Settings** → Update profile name, toggle notification prefs
10. **Logout** → Sign out
11. **Teacher view** → Login as `teacher@studentwise.test` → **Reports** page with charts
12. **Admin view** → Go to `/admin/login` → `admin@studentwise.test` → CRUD a student, mark attendance, update fee status
13. **Moderator view** → Login as `moderator@studentwise.test` → same portal, no delete buttons

---

## 12. Project Structure

```
studentwise-dash/
├── src/
│   ├── routes/              # File-based pages (TanStack Router)
│   │   ├── admin/           # Staff portal (8 sections)
│   │   │   ├── dashboard.tsx
│   │   │   ├── students.tsx
│   │   │   ├── teachers.tsx
│   │   │   ├── courses.tsx
│   │   │   ├── enrollments.tsx
│   │   │   ├── attendance.tsx
│   │   │   ├── fees.tsx
│   │   │   ├── notifications.tsx
│   │   │   └── login.tsx
│   │   ├── dashboard.tsx    # Main dashboard
│   │   ├── courses.tsx      # Enrolled courses
│   │   ├── attendance.tsx   # Attendance tracking
│   │   ├── fees.tsx         # Fee management + challan
│   │   ├── teachers.tsx     # Faculty directory
│   │   ├── results.tsx      # Academic grades
│   │   ├── reports.tsx      # Analytics (teacher/admin)
│   │   ├── notifications.tsx
│   │   ├── settings.tsx     # Persisted profile & prefs
│   │   ├── login.tsx / signup.tsx
│   │   └── index.tsx        # Root redirect
│   ├── components/
│   │   ├── AppLayout.tsx    # Student portal shell + realtime
│   │   ├── AdminLayout.tsx  # Staff portal shell
│   │   ├── MobileNavBar.tsx # Mobile bottom navigation
│   │   ├── NotificationBell.tsx
│   │   └── ui/              # shadcn/ui components (40+)
│   ├── lib/
│   │   ├── supabase/        # Client, server, auth, data layer
│   │   ├── auth-guards.ts   # Route protection
│   │   ├── auth-types.ts    # Roles + isStaffRole helper
│   │   ├── brand.ts         # UniFlow branding constants
│   │   ├── constants.ts     # Semester / term dates
│   │   ├── invoice.ts       # Fee challan generation
│   │   └── database.types.ts
│   └── hooks/
│       ├── use-auth.ts
│       ├── use-staff-permissions.ts
│       └── use-realtime-invalidate.ts
├── supabase/
│   ├── migrations/          # 5 schema + RLS migrations
│   ├── seed.sql             # Local demo data
│   ├── seed-cloud-complete.sql
│   ├── seed-auth-users.sql  # 6 test accounts
│   └── seed-fall-attendance.sql
├── scripts/
│   ├── seed-test-users.mjs  # Admin API user seeder
│   ├── seed-fall-attendance.mjs
│   └── deploy-db.mjs        # Vercel auto-migrate
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
| High | Fee payment gateway integration | Not started |
| Medium | PDF export for results / fee receipts | Challan UI exists; PDF export pending |
| Medium | Email notifications (actual delivery) | Toggle persisted; delivery not wired |
| Medium | Teacher self-service attendance marking | Staff portal only |
| Low | Push notifications (browser/mobile) | Preference toggle saved |
| Low | Bulk attendance import (CSV) | Not started |
| Low | Multi-semester attendance history | Fall 2026 term only |

---

## 14. Quick Reference Card (Copy to PPT)

```
┌──────────────────────────────────────────────────────────────┐
│  UNIFLOW — UNIVERSITY PORTAL                                  │
├──────────────────────────────────────────────────────────────┤
│  Stack: React 19 · TanStack Start · Supabase · Vercel        │
│  Repo:  github.com/mangiai/studentwise-dash                  │
│  Local: http://localhost:3000                                │
├──────────────────────────────────────────────────────────────┤
│  TEST USERS (password: StudentWise123!)                      │
│  Student:    sarah@studentwise.test     → /login             │
│  Teacher:    teacher@studentwise.test   → /login             │
│  Admin:      admin@studentwise.test     → /admin/login       │
│  Moderator:  moderator@studentwise.test → /admin/login       │
├──────────────────────────────────────────────────────────────┤
│  KEY ROUTES                                                   │
│  /dashboard  /courses  /attendance  /fees  /results          │
│  /teachers   /notifications  /reports  /settings             │
│  /admin/dashboard  /admin/students  /admin/attendance        │
│  /admin/fees  /admin/notifications                           │
└──────────────────────────────────────────────────────────────┘
```

---

*End of specification document.*
