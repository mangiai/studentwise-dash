-- CNIC, date of birth, and portal email on student / teacher records

ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS cnic text,
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS email text;

ALTER TABLE public.teachers
  ADD COLUMN IF NOT EXISTS cnic text,
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS email text;

CREATE UNIQUE INDEX IF NOT EXISTS students_cnic_unique
  ON public.students (cnic) WHERE cnic IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS teachers_cnic_unique
  ON public.teachers (cnic) WHERE cnic IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS students_email_unique
  ON public.students (email) WHERE email IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS teachers_email_unique
  ON public.teachers (email) WHERE email IS NOT NULL;
