-- Moderator role, notification preferences, staff RLS, realtime publication

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('student', 'teacher', 'admin', 'moderator'));

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS notify_email boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_push boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_fee_reminders boolean NOT NULL DEFAULT true;

-- Staff = admin or moderator helper for policies
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role IN ('admin', 'moderator')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  );
$$;

-- Replace admin-only manage policies with staff manage + admin delete split

DROP POLICY IF EXISTS "Admins manage profiles" ON public.profiles;
CREATE POLICY "Staff manage profiles"
ON public.profiles FOR ALL TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "Admins manage departments" ON public.departments;
CREATE POLICY "Staff manage departments"
ON public.departments FOR ALL TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "Admins manage students" ON public.students;
CREATE POLICY "Staff manage students"
ON public.students FOR ALL TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "Admins manage teachers" ON public.teachers;
CREATE POLICY "Staff manage teachers"
ON public.teachers FOR ALL TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "Admins manage courses" ON public.courses;
CREATE POLICY "Staff manage courses"
ON public.courses FOR ALL TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "Admins manage enrollments" ON public.enrollments;
CREATE POLICY "Staff manage enrollments"
ON public.enrollments FOR ALL TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "Admins manage attendance" ON public.attendance_records;
CREATE POLICY "Staff manage attendance"
ON public.attendance_records FOR ALL TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "Admins manage fee transactions" ON public.fee_transactions;
CREATE POLICY "Staff manage fee transactions"
ON public.fee_transactions FOR ALL TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "Admins manage semester fees" ON public.semester_fees;
CREATE POLICY "Staff manage semester fees"
ON public.semester_fees FOR ALL TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "Admins manage grades" ON public.course_grades;
CREATE POLICY "Staff manage grades"
ON public.course_grades FOR ALL TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "Admins manage notifications" ON public.notifications;
CREATE POLICY "Staff manage notifications"
ON public.notifications FOR ALL TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());

-- Realtime (safe to re-run)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'enrollments'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.enrollments;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'semester_fees'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.semester_fees;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'course_grades'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.course_grades;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'attendance_records'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance_records;
  END IF;
END $$;
