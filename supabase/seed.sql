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
  ('2026-BSCS-0042', '2025-03-09', 'Spring ''25 — Installment 1', 'Cheque', 49000, 'Paid'),
  ('2026-BSCS-0043', '2026-03-04', 'Spring ''26 — Installment 1', 'Bank Transfer', 49000, 'Paid'),
  ('2025-BSEE-0118', '2026-03-04', 'Spring ''26 — Full Payment', 'Credit Card', 98000, 'Paid')
ON CONFLICT DO NOTHING;

INSERT INTO public.enrollments (id, student_id, course_id, semester) VALUES
  ('22222222-2222-2222-2222-222222222301', '2026-BSCS-0043', 'CS-304', 'Spring 2026'),
  ('22222222-2222-2222-2222-222222222302', '2026-BSCS-0043', 'CS-307', 'Spring 2026'),
  ('22222222-2222-2222-2222-222222222303', '2026-BSCS-0043', 'CS-401', 'Spring 2026'),
  ('22222222-2222-2222-2222-222222222401', '2025-BSEE-0118', 'CS-401', 'Spring 2026'),
  ('22222222-2222-2222-2222-222222222402', '2025-BSEE-0118', 'CS-403', 'Spring 2026')
ON CONFLICT (student_id, course_id, semester) DO NOTHING;

INSERT INTO public.attendance_records (enrollment_id, total_classes, classes_attended) VALUES
  ('22222222-2222-2222-2222-222222222301', 28, 24),
  ('22222222-2222-2222-2222-222222222302', 25, 16),
  ('22222222-2222-2222-2222-222222222303', 22, 19),
  ('22222222-2222-2222-2222-222222222401', 22, 20),
  ('22222222-2222-2222-2222-222222222402', 26, 22)
ON CONFLICT (enrollment_id) DO NOTHING;

INSERT INTO public.semester_fees (student_id, semester, total_amount_pkr, amount_paid_pkr, due_date) VALUES
  ('2026-BSCS-0043', 'Fall 2026', 98000, 49000, '2026-09-15'),
  ('2025-BSEE-0118', 'Fall 2026', 98000, 98000, '2026-09-15')
ON CONFLICT (student_id, semester) DO NOTHING;

-- Sarah Ahmed grades
INSERT INTO public.course_grades (student_id, course_id, semester, grade, grade_points) VALUES
  ('2026-BSCS-0042', 'CS-304', 'Fall 2025', 'A', 12.0),
  ('2026-BSCS-0042', 'CS-307', 'Fall 2025', 'A-', 11.1),
  ('2026-BSCS-0042', 'CS-401', 'Fall 2025', 'B+', 13.2),
  ('2026-BSCS-0042', 'MATH-204', 'Fall 2025', 'B', 9.0),
  ('2026-BSCS-0042', 'CS-403', 'Spring 2025', 'A-', 11.1),
  ('2026-BSCS-0042', 'CS-411', 'Spring 2025', 'A', 12.0),
  ('2026-BSCS-0042', 'CS-304', 'Spring 2025', 'A', 12.0)
ON CONFLICT (student_id, course_id, semester) DO NOTHING;

-- Notifications (user_id set after auth seed — run seed-auth-users first, or update below)
-- These use fixed UUIDs from seed-auth-users.sql
INSERT INTO public.notifications (user_id, type, title, body, read) VALUES
  ('a0000002-0002-4002-8002-000000000002', 'fee', 'Fee payment reminder', 'Fall 2026 installment is due by Sep 15, 2026.', false),
  ('a0000002-0002-4002-8002-000000000002', 'attendance', 'Short attendance alert', 'Operating Systems attendance is below 75%.', false),
  ('a0000002-0002-4002-8002-000000000002', 'course', 'New assignment posted', 'Software Engineering — Project milestone 2 is now live.', true),
  ('a0000002-0002-4002-8002-000000000002', 'announcement', 'Spring break schedule', 'Campus will be closed March 20–27 for spring break.', true),
  ('a0000003-0003-4003-8003-000000000003', 'fee', 'Pending fee notice', 'Spring 2026 second installment is pending.', false),
  ('a0000001-0001-4001-8001-000000000001', 'announcement', 'Admin: enrollment window', 'Fall 2026 enrollment opens next Monday.', false);

