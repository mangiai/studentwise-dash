-- Seed data matching the dashboard mock content

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
  ('MATH-204', 'Discrete Mathematics', 3, NULL, '11111111-1111-1111-1111-111111111104', 'Ongoing'),
  ('CS-301', 'Database Systems (Admin)', 3, 'FAC-2018-014', '11111111-1111-1111-1111-111111111101', 'Ongoing'),
  ('CS-302', 'Operating Systems (Admin)', 3, 'FAC-2015-008', '11111111-1111-1111-1111-111111111101', 'Ongoing'),
  ('CS-402', 'Computer Networks (Admin)', 3, 'FAC-2017-022', '11111111-1111-1111-1111-111111111101', 'Ongoing')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.enrollments (id, student_id, course_id, semester) VALUES
  ('22222222-2222-2222-2222-222222222201', '2026-BSCS-0042', 'CS-304', 'Spring 2026'),
  ('22222222-2222-2222-2222-222222222202', '2026-BSCS-0042', 'CS-307', 'Spring 2026'),
  ('22222222-2222-2222-2222-222222222203', '2026-BSCS-0042', 'CS-401', 'Spring 2026'),
  ('22222222-2222-2222-2222-222222222204', '2026-BSCS-0042', 'CS-403', 'Spring 2026'),
  ('22222222-2222-2222-2222-222222222205', '2026-BSCS-0042', 'CS-411', 'Spring 2026'),
  ('22222222-2222-2222-2222-222222222206', '2026-BSCS-0042', 'MATH-204', 'Spring 2026')
ON CONFLICT (student_id, course_id, semester) DO NOTHING;

INSERT INTO public.attendance_records (enrollment_id, total_classes, classes_attended) VALUES
  ('22222222-2222-2222-2222-222222222201', 28, 23),
  ('22222222-2222-2222-2222-222222222202', 25, 17),
  ('22222222-2222-2222-2222-222222222203', 22, 20),
  ('22222222-2222-2222-2222-222222222204', 26, 19),
  ('22222222-2222-2222-2222-222222222205', 24, 21),
  ('22222222-2222-2222-2222-222222222206', 24, 16)
ON CONFLICT (enrollment_id) DO NOTHING;

INSERT INTO public.semester_fees (student_id, semester, total_amount_pkr, amount_paid_pkr, due_date) VALUES
  ('2026-BSCS-0042', 'Fall 2026', 98000, 49000, '2026-09-15')
ON CONFLICT (student_id, semester) DO NOTHING;

INSERT INTO public.fee_transactions (student_id, transaction_date, description, payment_method, amount_pkr, status) VALUES
  ('2026-BSCS-0042', '2026-08-12', 'Spring ''26 — Installment 2', 'Bank Transfer', 49000, 'Paid'),
  ('2026-BSCS-0042', '2026-03-04', 'Spring ''26 — Installment 1', 'Credit Card', 49000, 'Paid'),
  ('2026-BSCS-0042', '2025-10-18', 'Fall ''25 — Full Payment', 'Bank Transfer', 98000, 'Paid'),
  ('2026-BSCS-0042', '2025-03-09', 'Spring ''25 — Installment 1', 'Cheque', 49000, 'Paid');
