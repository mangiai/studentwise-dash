/** Demo university data — idempotent upserts via service role. */

const DEPT_CS = "11111111-1111-1111-1111-111111111101";
const DEPT_EE = "11111111-1111-1111-1111-111111111102";
const DEPT_BBA = "11111111-1111-1111-1111-111111111103";
const DEPT_MATH = "11111111-1111-1111-1111-111111111104";

export async function seedDemoData(supabase) {
  console.log("Seeding demo departments, students, courses, enrollments...\n");

  await supabase.from("departments").upsert(
    [
      { id: DEPT_CS, name: "Computer Science", code: "CS" },
      { id: DEPT_EE, name: "Electrical Engineering", code: "EE" },
      { id: DEPT_BBA, name: "Business Administration", code: "BBA" },
      { id: DEPT_MATH, name: "Mathematics", code: "MATH" },
    ],
    { onConflict: "code" },
  );

  await supabase.from("teachers").upsert(
    [
      { id: "FAC-2018-014", name: "Dr. Aamir Khan", department_id: DEPT_CS, courses_count: 3, status: "Active" },
      { id: "FAC-2015-008", name: "Prof. Sana Ali", department_id: DEPT_CS, courses_count: 2, status: "Active" },
      { id: "FAC-2020-031", name: "Dr. Hamza Saeed", department_id: DEPT_CS, courses_count: 4, status: "Active" },
      { id: "FAC-2017-022", name: "Dr. Maria Iqbal", department_id: DEPT_CS, courses_count: 2, status: "On Leave" },
    ],
    { onConflict: "id" },
  );

  await supabase.from("students").upsert(
    [
      { id: "2026-BSCS-0042", name: "Sarah Ahmed", department_id: DEPT_CS, semester: 7, fee_status: "Paid", status: "Active", gpa: 3.7, credits_completed: 96 },
      { id: "2026-BSCS-0043", name: "Hassan Raza", department_id: DEPT_CS, semester: 7, fee_status: "Pending", status: "Active", gpa: 3.2, credits_completed: 88 },
      { id: "2025-BSEE-0118", name: "Maryam Khan", department_id: DEPT_EE, semester: 5, fee_status: "Paid", status: "Active", gpa: 3.55, credits_completed: 72 },
      { id: "2024-BBA-0204", name: "Usman Tariq", department_id: DEPT_BBA, semester: 3, fee_status: "Overdue", status: "Hold", gpa: 2.8, credits_completed: 36 },
      { id: "2026-MATH-0019", name: "Ayesha Malik", department_id: DEPT_MATH, semester: 1, fee_status: "Paid", status: "Active", gpa: 3.9, credits_completed: 12 },
      { id: "2025-BSCS-0091", name: "Bilal Yousaf", department_id: DEPT_CS, semester: 3, fee_status: "Paid", status: "Active", gpa: 3.4, credits_completed: 42 },
    ],
    { onConflict: "id" },
  );

  await supabase.from("courses").upsert(
    [
      { id: "CS-304", name: "Database Systems", credits: 3, instructor_id: "FAC-2018-014", department_id: DEPT_CS, status: "Ongoing" },
      { id: "CS-307", name: "Operating Systems", credits: 3, instructor_id: "FAC-2015-008", department_id: DEPT_CS, status: "Ongoing" },
      { id: "CS-401", name: "Software Engineering", credits: 4, instructor_id: "FAC-2020-031", department_id: DEPT_CS, status: "Ongoing" },
      { id: "CS-403", name: "Computer Networks", credits: 3, instructor_id: "FAC-2017-022", department_id: DEPT_CS, status: "Ongoing" },
      { id: "CS-411", name: "Artificial Intelligence", credits: 3, instructor_id: "FAC-2020-031", department_id: DEPT_CS, status: "Ongoing" },
      { id: "MATH-204", name: "Discrete Mathematics", credits: 3, instructor_id: null, department_id: DEPT_MATH, status: "Ongoing" },
      { id: "CS-301", name: "Database Systems (Admin)", credits: 3, instructor_id: "FAC-2018-014", department_id: DEPT_CS, status: "Ongoing" },
      { id: "CS-302", name: "Operating Systems (Admin)", credits: 3, instructor_id: "FAC-2015-008", department_id: DEPT_CS, status: "Ongoing" },
      { id: "CS-402", name: "Computer Networks (Admin)", credits: 3, instructor_id: "FAC-2017-022", department_id: DEPT_CS, status: "Ongoing" },
    ],
    { onConflict: "id" },
  );

  const enrollments = [
    { id: "22222222-2222-2222-2222-222222222201", student_id: "2026-BSCS-0042", course_id: "CS-304", semester: "Spring 2026" },
    { id: "22222222-2222-2222-2222-222222222202", student_id: "2026-BSCS-0042", course_id: "CS-307", semester: "Spring 2026" },
    { id: "22222222-2222-2222-2222-222222222203", student_id: "2026-BSCS-0042", course_id: "CS-401", semester: "Spring 2026" },
    { id: "22222222-2222-2222-2222-222222222204", student_id: "2026-BSCS-0042", course_id: "CS-403", semester: "Spring 2026" },
    { id: "22222222-2222-2222-2222-222222222205", student_id: "2026-BSCS-0042", course_id: "CS-411", semester: "Spring 2026" },
    { id: "22222222-2222-2222-2222-222222222206", student_id: "2026-BSCS-0042", course_id: "MATH-204", semester: "Spring 2026" },
    { id: "22222222-2222-2222-2222-222222222301", student_id: "2026-BSCS-0043", course_id: "CS-304", semester: "Spring 2026" },
    { id: "22222222-2222-2222-2222-222222222302", student_id: "2026-BSCS-0043", course_id: "CS-307", semester: "Spring 2026" },
    { id: "22222222-2222-2222-2222-222222222303", student_id: "2026-BSCS-0043", course_id: "CS-401", semester: "Spring 2026" },
    { id: "22222222-2222-2222-2222-222222222401", student_id: "2025-BSEE-0118", course_id: "CS-401", semester: "Spring 2026" },
    { id: "22222222-2222-2222-2222-222222222402", student_id: "2025-BSEE-0118", course_id: "CS-403", semester: "Spring 2026" },
  ];
  await supabase.from("enrollments").upsert(enrollments, { onConflict: "student_id,course_id,semester" });

  const attendance = [
    { enrollment_id: "22222222-2222-2222-2222-222222222201", total_classes: 28, classes_attended: 23 },
    { enrollment_id: "22222222-2222-2222-2222-222222222202", total_classes: 25, classes_attended: 17 },
    { enrollment_id: "22222222-2222-2222-2222-222222222203", total_classes: 22, classes_attended: 20 },
    { enrollment_id: "22222222-2222-2222-2222-222222222204", total_classes: 26, classes_attended: 19 },
    { enrollment_id: "22222222-2222-2222-2222-222222222205", total_classes: 24, classes_attended: 21 },
    { enrollment_id: "22222222-2222-2222-2222-222222222206", total_classes: 24, classes_attended: 16 },
    { enrollment_id: "22222222-2222-2222-2222-222222222301", total_classes: 28, classes_attended: 24 },
    { enrollment_id: "22222222-2222-2222-2222-222222222302", total_classes: 25, classes_attended: 16 },
    { enrollment_id: "22222222-2222-2222-2222-222222222303", total_classes: 22, classes_attended: 19 },
    { enrollment_id: "22222222-2222-2222-2222-222222222401", total_classes: 22, classes_attended: 20 },
    { enrollment_id: "22222222-2222-2222-2222-222222222402", total_classes: 26, classes_attended: 22 },
  ];
  await supabase.from("attendance_records").upsert(attendance, { onConflict: "enrollment_id" });

  await supabase.from("semester_fees").upsert(
    [
      { student_id: "2026-BSCS-0042", semester: "Fall 2026", total_amount_pkr: 98000, amount_paid_pkr: 49000, due_date: "2026-09-15" },
      { student_id: "2026-BSCS-0043", semester: "Fall 2026", total_amount_pkr: 98000, amount_paid_pkr: 49000, due_date: "2026-09-15" },
      { student_id: "2025-BSEE-0118", semester: "Fall 2026", total_amount_pkr: 98000, amount_paid_pkr: 98000, due_date: "2026-09-15" },
    ],
    { onConflict: "student_id,semester" },
  );

  await supabase.from("course_grades").upsert(
    [
      { student_id: "2026-BSCS-0042", course_id: "CS-304", semester: "Fall 2025", grade: "A", grade_points: 12.0 },
      { student_id: "2026-BSCS-0042", course_id: "CS-307", semester: "Fall 2025", grade: "A-", grade_points: 11.1 },
      { student_id: "2026-BSCS-0042", course_id: "CS-401", semester: "Fall 2025", grade: "B+", grade_points: 13.2 },
      { student_id: "2026-BSCS-0042", course_id: "MATH-204", semester: "Fall 2025", grade: "B", grade_points: 9.0 },
      { student_id: "2026-BSCS-0042", course_id: "CS-403", semester: "Spring 2025", grade: "A-", grade_points: 11.1 },
      { student_id: "2026-BSCS-0042", course_id: "CS-411", semester: "Spring 2025", grade: "A", grade_points: 12.0 },
      { student_id: "2026-BSCS-0042", course_id: "CS-304", semester: "Spring 2025", grade: "A", grade_points: 12.0 },
    ],
    { onConflict: "student_id,course_id,semester" },
  );

  console.log("✓ Demo data seeded");
}

export async function seedNotificationsForUser(supabase, userId, items) {
  for (const item of items) {
    const { data: existing } = await supabase
      .from("notifications")
      .select("id")
      .eq("user_id", userId)
      .eq("title", item.title)
      .maybeSingle();

    if (!existing) {
      await supabase.from("notifications").insert({ user_id: userId, ...item });
    }
  }
}
