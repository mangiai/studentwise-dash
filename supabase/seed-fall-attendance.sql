-- Fall 2026 attendance: weekday class sessions (Jan 1 – Jun 5, 2026)
-- and per-student session marks (20–100%, never 0%).
-- Run AFTER migration 20250610400000_class_sessions_attendance.sql
-- Paste in Supabase SQL Editor or: npx supabase db query --linked --file supabase/seed-fall-attendance.sql

BEGIN;

DELETE FROM public.session_attendance sa
USING public.class_sessions cs
WHERE sa.session_id = cs.id AND cs.term = 'Fall 2026';

DELETE FROM public.class_sessions WHERE term = 'Fall 2026';

INSERT INTO public.class_sessions (course_id, session_date, start_time, end_time, room, term)
SELECT
  c.id,
  d.dt::date,
  (ARRAY['09:00', '11:00', '14:00'])[1 + (abs(hashtext(c.id || d.dt::text)) % 3)]::time AS start_time,
  (ARRAY['10:30', '12:30', '15:30'])[1 + (abs(hashtext(c.id || d.dt::text)) % 3)]::time AS end_time,
  (ARRAY['Room 105', 'Lab 204', 'Room 302'])[1 + (abs(hashtext(c.id || d.dt::text)) % 3)] AS room,
  'Fall 2026'
FROM public.courses c
CROSS JOIN generate_series('2026-01-01'::date, '2026-06-05'::date, '1 day') AS d(dt)
WHERE EXTRACT(ISODOW FROM d.dt) <= 5
  AND (abs(hashtext(c.id || d.dt::text)) % 100) < 42
ON CONFLICT (course_id, session_date, start_time) DO NOTHING;

WITH enrollment_targets AS (
  SELECT
    e.id AS enrollment_id,
    e.course_id,
    20 + (abs(hashtext(e.student_id || e.course_id)) % 81) AS target_pct
  FROM public.enrollments e
  WHERE e.semester = 'Spring 2026'
),
ranked AS (
  SELECT
    et.enrollment_id,
    et.target_pct,
    cs.id AS session_id,
    row_number() OVER (
      PARTITION BY et.enrollment_id
      ORDER BY abs(hashtext(et.enrollment_id::text || cs.id::text))
    ) AS rn,
    count(*) OVER (PARTITION BY et.enrollment_id) AS total
  FROM enrollment_targets et
  JOIN public.class_sessions cs
    ON cs.course_id = et.course_id AND cs.term = 'Fall 2026'
)
INSERT INTO public.session_attendance (enrollment_id, session_id, present)
SELECT
  enrollment_id,
  session_id,
  rn <= GREATEST(1, LEAST(total, ROUND(total * target_pct / 100.0)::integer))
FROM ranked
ON CONFLICT (enrollment_id, session_id) DO UPDATE SET
  present = EXCLUDED.present,
  marked_at = now();

COMMIT;

-- Verify (Hassan should have 3 courses with attendance > 0)
SELECT
  s.name,
  c.id AS course,
  ar.total_classes,
  ar.classes_attended,
  ar.percentage
FROM public.students s
JOIN public.enrollments e ON e.student_id = s.id AND e.semester = 'Spring 2026'
JOIN public.courses c ON c.id = e.course_id
LEFT JOIN public.attendance_records ar ON ar.enrollment_id = e.id
WHERE s.id = '2026-BSCS-0043'
ORDER BY c.id;
