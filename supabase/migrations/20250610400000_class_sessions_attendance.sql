-- Per-session attendance for Fall 2026 term (Jan 1 - Jun 5, 2026)

CREATE TABLE public.class_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id text NOT NULL REFERENCES public.courses (id) ON DELETE CASCADE,
  session_date date NOT NULL,
  start_time time NOT NULL DEFAULT '09:00',
  end_time time NOT NULL DEFAULT '10:30',
  room text,
  term text NOT NULL DEFAULT 'Fall 2026',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (course_id, session_date, start_time)
);

CREATE TABLE public.session_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid NOT NULL REFERENCES public.enrollments (id) ON DELETE CASCADE,
  session_id uuid NOT NULL REFERENCES public.class_sessions (id) ON DELETE CASCADE,
  present boolean NOT NULL DEFAULT false,
  marked_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (enrollment_id, session_id)
);

CREATE INDEX idx_class_sessions_course_date ON public.class_sessions (course_id, session_date);
CREATE INDEX idx_class_sessions_term ON public.class_sessions (term);
CREATE INDEX idx_session_attendance_enrollment ON public.session_attendance (enrollment_id);
CREATE INDEX idx_session_attendance_session ON public.session_attendance (session_id);

ALTER TABLE public.class_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users read class sessions"
ON public.class_sessions FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Staff manage class sessions"
ON public.class_sessions FOR ALL TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());

CREATE POLICY "Students read own session attendance"
ON public.session_attendance FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.enrollments e
    JOIN public.students s ON s.id = e.student_id
    WHERE e.id = session_attendance.enrollment_id AND s.user_id = auth.uid()
  )
);

CREATE POLICY "Staff manage session attendance"
ON public.session_attendance FOR ALL TO authenticated
USING (public.is_staff())
WITH CHECK (public.is_staff());

CREATE OR REPLACE FUNCTION public.sync_enrollment_attendance_summary()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  eid uuid;
  total integer;
  attended integer;
BEGIN
  eid := COALESCE(NEW.enrollment_id, OLD.enrollment_id);

  SELECT COUNT(*)::int, COUNT(*) FILTER (WHERE present)::int
  INTO total, attended
  FROM public.session_attendance
  WHERE enrollment_id = eid;

  IF total = 0 THEN
    DELETE FROM public.attendance_records WHERE enrollment_id = eid;
    RETURN COALESCE(NEW, OLD);
  END IF;

  INSERT INTO public.attendance_records (enrollment_id, total_classes, classes_attended)
  VALUES (eid, total, attended)
  ON CONFLICT (enrollment_id) DO UPDATE SET
    total_classes = EXCLUDED.total_classes,
    classes_attended = EXCLUDED.classes_attended,
    updated_at = now();

  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER session_attendance_sync_summary
AFTER INSERT OR UPDATE OR DELETE ON public.session_attendance
FOR EACH ROW
EXECUTE FUNCTION public.sync_enrollment_attendance_summary();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'class_sessions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.class_sessions;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'session_attendance'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.session_attendance;
  END IF;
END $$;
