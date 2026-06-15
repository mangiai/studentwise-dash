-- Phone number on student / teacher records

ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS phone text;

ALTER TABLE public.teachers
  ADD COLUMN IF NOT EXISTS phone text;

CREATE UNIQUE INDEX IF NOT EXISTS students_phone_unique
  ON public.students (phone) WHERE phone IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS teachers_phone_unique
  ON public.teachers (phone) WHERE phone IS NOT NULL;
