-- StudentWise university portal schema

CREATE TYPE public.fee_status AS ENUM ('Paid', 'Pending', 'Overdue');
CREATE TYPE public.person_status AS ENUM ('Active', 'Hold', 'On Leave');

CREATE TABLE public.departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  code text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  full_name text,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.teachers (
  id text PRIMARY KEY,
  user_id uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  name text NOT NULL,
  department_id uuid REFERENCES public.departments (id) ON DELETE SET NULL,
  courses_count integer NOT NULL DEFAULT 0,
  status public.person_status NOT NULL DEFAULT 'Active',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.students (
  id text PRIMARY KEY,
  user_id uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  name text NOT NULL,
  department_id uuid REFERENCES public.departments (id) ON DELETE SET NULL,
  semester integer NOT NULL DEFAULT 1 CHECK (semester >= 1 AND semester <= 12),
  fee_status public.fee_status NOT NULL DEFAULT 'Pending',
  status public.person_status NOT NULL DEFAULT 'Active',
  gpa numeric(3, 2) CHECK (gpa IS NULL OR (gpa >= 0 AND gpa <= 4)),
  credits_completed integer NOT NULL DEFAULT 0,
  credits_required integer NOT NULL DEFAULT 130,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.courses (
  id text PRIMARY KEY,
  name text NOT NULL,
  credits integer NOT NULL DEFAULT 3 CHECK (credits >= 1 AND credits <= 6),
  instructor_id text REFERENCES public.teachers (id) ON DELETE SET NULL,
  department_id uuid REFERENCES public.departments (id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'Ongoing',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text NOT NULL REFERENCES public.students (id) ON DELETE CASCADE,
  course_id text NOT NULL REFERENCES public.courses (id) ON DELETE CASCADE,
  semester text NOT NULL DEFAULT 'Spring 2026',
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, course_id, semester)
);

CREATE TABLE public.attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid NOT NULL REFERENCES public.enrollments (id) ON DELETE CASCADE,
  total_classes integer NOT NULL DEFAULT 0 CHECK (total_classes >= 0),
  classes_attended integer NOT NULL DEFAULT 0 CHECK (classes_attended >= 0),
  percentage numeric(5, 2) GENERATED ALWAYS AS (
    CASE
      WHEN total_classes > 0 THEN round((classes_attended::numeric / total_classes) * 100, 2)
      ELSE 0
    END
  ) STORED,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (enrollment_id),
  CHECK (classes_attended <= total_classes)
);

CREATE TABLE public.fee_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text NOT NULL REFERENCES public.students (id) ON DELETE CASCADE,
  transaction_date date NOT NULL,
  description text NOT NULL,
  payment_method text,
  amount_pkr numeric(12, 2) NOT NULL CHECK (amount_pkr >= 0),
  status public.fee_status NOT NULL DEFAULT 'Paid',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.semester_fees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text NOT NULL REFERENCES public.students (id) ON DELETE CASCADE,
  semester text NOT NULL,
  total_amount_pkr numeric(12, 2) NOT NULL CHECK (total_amount_pkr >= 0),
  amount_paid_pkr numeric(12, 2) NOT NULL DEFAULT 0 CHECK (amount_paid_pkr >= 0),
  due_date date,
  UNIQUE (student_id, semester)
);

CREATE INDEX idx_students_department_id ON public.students (department_id);
CREATE INDEX idx_students_user_id ON public.students (user_id);
CREATE INDEX idx_teachers_department_id ON public.teachers (department_id);
CREATE INDEX idx_courses_instructor_id ON public.courses (instructor_id);
CREATE INDEX idx_enrollments_student_id ON public.enrollments (student_id);
CREATE INDEX idx_enrollments_course_id ON public.enrollments (course_id);
CREATE INDEX idx_fee_transactions_student_id ON public.fee_transactions (student_id);

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    COALESCE(NEW.raw_app_meta_data ->> 'role', 'student')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.semester_fees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are readable by owner"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Profiles are updatable by owner"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins manage profiles"
ON public.profiles FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Authenticated users read departments"
ON public.departments FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Admins manage departments"
ON public.departments FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Students read own record"
ON public.students FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins manage students"
ON public.students FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Authenticated users read teachers"
ON public.teachers FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Admins manage teachers"
ON public.teachers FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Authenticated users read courses"
ON public.courses FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Admins manage courses"
ON public.courses FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Students read own enrollments"
ON public.enrollments FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.id = enrollments.student_id AND s.user_id = auth.uid()
  )
);

CREATE POLICY "Admins manage enrollments"
ON public.enrollments FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Students read own attendance"
ON public.attendance_records FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.enrollments e
    JOIN public.students s ON s.id = e.student_id
    WHERE e.id = attendance_records.enrollment_id AND s.user_id = auth.uid()
  )
);

CREATE POLICY "Admins manage attendance"
ON public.attendance_records FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Students read own fee transactions"
ON public.fee_transactions FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.id = fee_transactions.student_id AND s.user_id = auth.uid()
  )
);

CREATE POLICY "Admins manage fee transactions"
ON public.fee_transactions FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Students read own semester fees"
ON public.semester_fees FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.id = semester_fees.student_id AND s.user_id = auth.uid()
  )
);

CREATE POLICY "Admins manage semester fees"
ON public.semester_fees FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));
