-- Course grades and user notifications for dynamic portal pages

CREATE TABLE public.course_grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text NOT NULL REFERENCES public.students (id) ON DELETE CASCADE,
  course_id text NOT NULL REFERENCES public.courses (id) ON DELETE CASCADE,
  semester text NOT NULL,
  grade text NOT NULL,
  grade_points numeric(4, 1) NOT NULL CHECK (grade_points >= 0 AND grade_points <= 16),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, course_id, semester)
);

CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('fee', 'attendance', 'course', 'announcement')),
  title text NOT NULL,
  body text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_course_grades_student_id ON public.course_grades (student_id);
CREATE INDEX idx_notifications_user_id ON public.notifications (user_id);
CREATE INDEX idx_notifications_read ON public.notifications (user_id, read);

ALTER TABLE public.course_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students read own grades"
ON public.course_grades FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.id = course_grades.student_id AND s.user_id = auth.uid()
  )
);

CREATE POLICY "Admins manage grades"
ON public.course_grades FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Users read own notifications"
ON public.notifications FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users update own notifications"
ON public.notifications FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins manage notifications"
ON public.notifications FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Teachers read students"
ON public.students FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role IN ('teacher', 'admin')
  )
);

CREATE POLICY "Teachers read enrollments"
ON public.enrollments FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role IN ('teacher', 'admin')
  )
);

CREATE POLICY "Teachers read attendance"
ON public.attendance_records FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role IN ('teacher', 'admin')
  )
);
