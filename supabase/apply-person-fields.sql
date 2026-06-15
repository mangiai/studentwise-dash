-- Run once in Supabase → SQL Editor if Add Student fails with
-- "Could not find the 'cnic' column of 'students' in the schema cache"
--
-- Adds: cnic, email, date_of_birth, phone on students & teachers

ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS cnic text,
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS phone text;

ALTER TABLE public.teachers
  ADD COLUMN IF NOT EXISTS cnic text,
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS phone text;

CREATE UNIQUE INDEX IF NOT EXISTS students_cnic_unique
  ON public.students (cnic) WHERE cnic IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS teachers_cnic_unique
  ON public.teachers (cnic) WHERE cnic IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS students_email_unique
  ON public.students (email) WHERE email IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS teachers_email_unique
  ON public.teachers (email) WHERE email IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS students_phone_unique
  ON public.students (phone) WHERE phone IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS teachers_phone_unique
  ON public.teachers (phone) WHERE phone IS NOT NULL;

-- Refresh PostgREST schema cache (Supabase API)
NOTIFY pgrst, 'reload schema';
