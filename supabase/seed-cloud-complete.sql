-- StudentWise complete cloud seed
-- Supabase Dashboard -> SQL Editor -> New query -> paste ALL of this file -> Run
-- IMPORTANT: First line must start with -- (two dashes). Do not add = or other characters before it.
-- Requires: run migrations first (npm run db:push) OR initial schema already applied.

-- STEP 0: notifications + grades tables (safe to re-run)

CREATE TABLE IF NOT EXISTS public.course_grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text NOT NULL REFERENCES public.students (id) ON DELETE CASCADE,
  course_id text NOT NULL REFERENCES public.courses (id) ON DELETE CASCADE,
  semester text NOT NULL,
  grade text NOT NULL,
  grade_points numeric(4, 1) NOT NULL CHECK (grade_points >= 0 AND grade_points <= 16),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, course_id, semester)
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('fee', 'attendance', 'course', 'announcement')),
  title text NOT NULL,
  body text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_course_grades_student_id ON public.course_grades (student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications (user_id, read);

ALTER TABLE public.course_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students read own grades" ON public.course_grades;
CREATE POLICY "Students read own grades"
ON public.course_grades FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.id = course_grades.student_id AND s.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Admins manage grades" ON public.course_grades;
CREATE POLICY "Admins manage grades"
ON public.course_grades FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "Users read own notifications" ON public.notifications;
CREATE POLICY "Users read own notifications"
ON public.notifications FOR SELECT TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users update own notifications" ON public.notifications;
CREATE POLICY "Users update own notifications"
ON public.notifications FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins manage notifications" ON public.notifications;
CREATE POLICY "Admins manage notifications"
ON public.notifications FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- STEP 1: demo data

INSERT INTO public.departments (id, name, code) VALUES
  ('11111111-1111-1111-1111-111111111101', 'Computer Science', 'CS'),
  ('11111111-1111-1111-1111-111111111102', 'Electrical Engineering', 'EE'),
  ('11111111-1111-1111-1111-111111111103', 'Business Administration', 'BBA'),
  ('11111111-1111-1111-1111-111111111104', 'Mathematics', 'MATH')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.teachers (id, name, department_id, courses_count, status) VALUES
  ('FAC-2018-014', 'Dr. Aamir Khan', '11111111-1111-1111-1111-111111111101', 3, 'Active'),
  ('FAC-2015-008', 'Prof. Sana Ali', '11111111-1111-1111-1111-111111111101', 2, 'Active'),
  ('FAC-2020-031', 'Dr. Hamza Saeed', '11111111-1111-1111-1111-111111111101', 4, 'Active'),
  ('FAC-2017-022', 'Dr. Maria Iqbal', '11111111-1111-1111-1111-111111111101', 2, 'On Leave')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.students (id, name, department_id, semester, fee_status, status, gpa, credits_completed) VALUES
  ('2026-BSCS-0042', 'Sarah Ahmed', '11111111-1111-1111-1111-111111111101', 7, 'Paid', 'Active', 3.70, 96),
  ('2026-BSCS-0043', 'Hassan Raza', '11111111-1111-1111-1111-111111111101', 7, 'Pending', 'Active', 3.20, 88),
  ('2025-BSEE-0118', 'Maryam Khan', '11111111-1111-1111-1111-111111111102', 5, 'Paid', 'Active', 3.55, 72),
  ('2024-BBA-0204', 'Usman Tariq', '11111111-1111-1111-1111-111111111103', 3, 'Overdue', 'Hold', 2.80, 36),
  ('2026-MATH-0019', 'Ayesha Malik', '11111111-1111-1111-1111-111111111104', 1, 'Paid', 'Active', 3.90, 12),
  ('2025-BSCS-0091', 'Bilal Yousaf', '11111111-1111-1111-1111-111111111101', 3, 'Paid', 'Active', 3.40, 42)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.courses (id, name, credits, instructor_id, department_id, status) VALUES
  ('CS-304', 'Database Systems', 3, 'FAC-2018-014', '11111111-1111-1111-1111-111111111101', 'Ongoing'),
  ('CS-307', 'Operating Systems', 3, 'FAC-2015-008', '11111111-1111-1111-1111-111111111101', 'Ongoing'),
  ('CS-401', 'Software Engineering', 4, 'FAC-2020-031', '11111111-1111-1111-1111-111111111101', 'Ongoing'),
  ('CS-403', 'Computer Networks', 3, 'FAC-2017-022', '11111111-1111-1111-1111-111111111101', 'Ongoing'),
  ('CS-411', 'Artificial Intelligence', 3, 'FAC-2020-031', '11111111-1111-1111-1111-111111111101', 'Ongoing'),
  ('MATH-204', 'Discrete Mathematics', 3, NULL, '11111111-1111-1111-1111-111111111104', 'Ongoing')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.enrollments (id, student_id, course_id, semester) VALUES
  ('22222222-2222-2222-2222-222222222201', '2026-BSCS-0042', 'CS-304', 'Spring 2026'),
  ('22222222-2222-2222-2222-222222222202', '2026-BSCS-0042', 'CS-307', 'Spring 2026'),
  ('22222222-2222-2222-2222-222222222203', '2026-BSCS-0042', 'CS-401', 'Spring 2026'),
  ('22222222-2222-2222-2222-222222222204', '2026-BSCS-0042', 'CS-403', 'Spring 2026'),
  ('22222222-2222-2222-2222-222222222205', '2026-BSCS-0042', 'CS-411', 'Spring 2026'),
  ('22222222-2222-2222-2222-222222222206', '2026-BSCS-0042', 'MATH-204', 'Spring 2026'),
  ('22222222-2222-2222-2222-222222222301', '2026-BSCS-0043', 'CS-304', 'Spring 2026'),
  ('22222222-2222-2222-2222-222222222302', '2026-BSCS-0043', 'CS-307', 'Spring 2026'),
  ('22222222-2222-2222-2222-222222222303', '2026-BSCS-0043', 'CS-401', 'Spring 2026'),
  ('22222222-2222-2222-2222-222222222401', '2025-BSEE-0118', 'CS-401', 'Spring 2026'),
  ('22222222-2222-2222-2222-222222222402', '2025-BSEE-0118', 'CS-403', 'Spring 2026')
ON CONFLICT (student_id, course_id, semester) DO NOTHING;

INSERT INTO public.attendance_records (enrollment_id, total_classes, classes_attended) VALUES
  ('22222222-2222-2222-2222-222222222201', 28, 23),
  ('22222222-2222-2222-2222-222222222202', 25, 17),
  ('22222222-2222-2222-2222-222222222203', 22, 20),
  ('22222222-2222-2222-2222-222222222204', 26, 19),
  ('22222222-2222-2222-2222-222222222205', 24, 21),
  ('22222222-2222-2222-2222-222222222206', 24, 16),
  ('22222222-2222-2222-2222-222222222301', 28, 24),
  ('22222222-2222-2222-2222-222222222302', 25, 16),
  ('22222222-2222-2222-2222-222222222303', 22, 19),
  ('22222222-2222-2222-2222-222222222401', 22, 20),
  ('22222222-2222-2222-2222-222222222402', 26, 22)
ON CONFLICT (enrollment_id) DO NOTHING;

INSERT INTO public.semester_fees (student_id, semester, total_amount_pkr, amount_paid_pkr, due_date) VALUES
  ('2026-BSCS-0042', 'Spring 2026', 98000, 98000, '2026-03-15'),
  ('2026-BSCS-0043', 'Spring 2026', 98000, 49000, '2026-03-15'),
  ('2025-BSEE-0118', 'Spring 2026', 98000, 98000, '2026-03-15'),
  ('2026-BSCS-0042', 'Fall 2026', 98000, 49000, '2026-09-15'),
  ('2026-BSCS-0043', 'Fall 2026', 98000, 49000, '2026-09-15'),
  ('2025-BSEE-0118', 'Fall 2026', 98000, 98000, '2026-09-15')
ON CONFLICT (student_id, semester) DO NOTHING;

INSERT INTO public.fee_transactions (student_id, transaction_date, description, payment_method, amount_pkr, status) VALUES
  ('2026-BSCS-0042', '2026-08-12', 'Spring 26 Installment 2', 'Bank Transfer', 49000, 'Paid'),
  ('2026-BSCS-0042', '2026-03-04', 'Spring 26 Installment 1', 'Credit Card', 49000, 'Paid'),
  ('2026-BSCS-0042', '2025-10-18', 'Fall 25 Full Payment', 'Bank Transfer', 98000, 'Paid'),
  ('2026-BSCS-0043', '2026-03-04', 'Spring 26 Installment 1', 'Bank Transfer', 49000, 'Paid'),
  ('2025-BSEE-0118', '2026-03-04', 'Spring 26 Full Payment', 'Credit Card', 98000, 'Paid');

INSERT INTO public.course_grades (student_id, course_id, semester, grade, grade_points) VALUES
  ('2026-BSCS-0042', 'CS-304', 'Fall 2025', 'A', 12.0),
  ('2026-BSCS-0042', 'CS-307', 'Fall 2025', 'A-', 11.1),
  ('2026-BSCS-0042', 'CS-401', 'Fall 2025', 'B+', 13.2),
  ('2026-BSCS-0042', 'MATH-204', 'Fall 2025', 'B', 9.0),
  ('2026-BSCS-0042', 'CS-403', 'Spring 2025', 'A-', 11.1),
  ('2026-BSCS-0042', 'CS-411', 'Spring 2025', 'A', 12.0)
ON CONFLICT (student_id, course_id, semester) DO NOTHING;

-- STEP 2: link auth users to student/teacher records

-- Ensure moderator auth user exists (safe to re-run)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a0000006-0006-4006-8006-000000000006',
  'authenticated', 'authenticated',
  'moderator@studentwise.test',
  crypt('StudentWise123!', gen_salt('bf', 10)),
  now(),
  '{"provider":"email","providers":["email"],"role":"moderator"}'::jsonb,
  '{"full_name":"Portal Moderator"}'::jsonb,
  now(), now(), '', '', '', ''
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  encrypted_password = EXCLUDED.encrypted_password,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  updated_at = now();

INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
  'b0000006-0006-4006-8006-000000000006',
  'a0000006-0006-4006-8006-000000000006',
  'moderator@studentwise.test',
  '{"sub":"a0000006-0006-4006-8006-000000000006","email":"moderator@studentwise.test","email_verified":true}'::jsonb,
  'email', now(), now(), now()
)
ON CONFLICT (provider_id, provider) DO UPDATE SET
  user_id = EXCLUDED.user_id,
  identity_data = EXCLUDED.identity_data,
  updated_at = now();

UPDATE public.students s
SET user_id = u.id, name = 'Sarah Ahmed'
FROM auth.users u
WHERE u.email = 'sarah@studentwise.test' AND s.id = '2026-BSCS-0042';

UPDATE public.students s
SET user_id = u.id, name = 'Hassan Raza'
FROM auth.users u
WHERE u.email = 'hassan@studentwise.test' AND s.id = '2026-BSCS-0043';

UPDATE public.students s
SET user_id = u.id, name = 'Maryam Khan'
FROM auth.users u
WHERE u.email = 'maryam@studentwise.test' AND s.id = '2025-BSEE-0118';

UPDATE public.teachers t
SET user_id = u.id, name = 'Dr. Aamir Khan'
FROM auth.users u
WHERE u.email = 'teacher@studentwise.test' AND t.id = 'FAC-2018-014';

INSERT INTO public.profiles (id, full_name, role)
SELECT u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', u.email),
  COALESCE(u.raw_app_meta_data->>'role', 'student')
FROM auth.users u
WHERE u.email IN (
  'admin@studentwise.test',
  'moderator@studentwise.test',
  'sarah@studentwise.test',
  'hassan@studentwise.test',
  'teacher@studentwise.test',
  'maryam@studentwise.test'
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  updated_at = now();

-- STEP 3: notifications

INSERT INTO public.notifications (user_id, type, title, body, read)
SELECT u.id, v.type, v.title, v.body, v.read
FROM auth.users u
CROSS JOIN (VALUES
  ('sarah@studentwise.test', 'fee', 'Fee payment reminder', 'Fall 2026 installment is due by Sep 15, 2026.', false),
  ('sarah@studentwise.test', 'attendance', 'Short attendance alert', 'Operating Systems attendance is below 75%.', false),
  ('sarah@studentwise.test', 'course', 'New assignment posted', 'Software Engineering project milestone 2 is now live.', true),
  ('sarah@studentwise.test', 'announcement', 'Spring break schedule', 'Campus will be closed March 20-27 for spring break.', true),
  ('hassan@studentwise.test', 'fee', 'Pending fee notice', 'Spring 2026 second installment is pending.', false),
  ('admin@studentwise.test', 'announcement', 'Admin enrollment window', 'Fall 2026 enrollment opens next Monday.', false)
) AS v(email, type, title, body, read)
WHERE u.email = v.email
AND NOT EXISTS (
  SELECT 1 FROM public.notifications n
  WHERE n.user_id = u.id AND n.title = v.title
);

-- STEP 4: verify (Sarah should show 6 enrollments)

SELECT
  u.email,
  s.id AS student_id,
  s.name,
  (SELECT count(*) FROM public.enrollments e WHERE e.student_id = s.id) AS enrollments
FROM auth.users u
LEFT JOIN public.students s ON s.user_id = u.id
WHERE u.email LIKE '%@studentwise.test'
ORDER BY u.email;
