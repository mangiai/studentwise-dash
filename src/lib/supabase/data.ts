import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  getSupabaseServerClient,
  getSupabaseServiceClient,
  isSupabaseServerConfigured,
} from "@/lib/supabase/server";
import type { AuthUser, UserRole } from "@/lib/auth-types";

async function getSessionUser() {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

async function getProfileRole(userId: string): Promise<UserRole> {
  const supabase = getSupabaseServerClient();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();

  const sessionUser = await getSessionUser();
  const appRole =
    sessionUser?.id === userId && typeof sessionUser.app_metadata?.role === "string"
      ? (sessionUser.app_metadata.role as UserRole)
      : undefined;

  if (profile?.role === "admin" || appRole === "admin") return "admin";
  if (profile?.role === "teacher" || appRole === "teacher") return "teacher";
  return (profile?.role as UserRole) ?? appRole ?? "student";
}

async function requireAdminUser() {
  const user = await getSessionUser();
  if (!user) throw new Error("Not authenticated");
  const role = await getProfileRole(user.id);
  if (role !== "admin") throw new Error("Admin access required");
  return user;
}

async function getLinkedStudentId(userId: string, email?: string | null) {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from("students").select("id").eq("user_id", userId).maybeSingle();
  if (data?.id) return data.id;

  // Auto-link test/demo accounts when service role is available
  const testLinks: Record<string, string> = {
    "sarah@studentwise.test": "2026-BSCS-0042",
    "hassan@studentwise.test": "2026-BSCS-0043",
    "maryam@studentwise.test": "2025-BSEE-0118",
  };

  const studentRecordId = email ? testLinks[email] : undefined;
  if (!studentRecordId || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null;

  const admin = getSupabaseServiceClient();
  const { error } = await admin.from("students").update({ user_id: userId }).eq("id", studentRecordId);
  if (error) {
    console.error("Auto-link student failed:", error.message);
    return null;
  }
  return studentRecordId;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export const fetchPortalDashboard = createServerFn({ method: "GET" }).handler(async () => {
  if (!isSupabaseServerConfigured()) return { configured: false as const, data: null };

  const supabase = getSupabaseServerClient();
  const user = await getSessionUser();
  if (!user) return { configured: true as const, data: null };

  const role = await getProfileRole(user.id);
  const studentId = await getLinkedStudentId(user.id, user.email);

  if (role === "admin" || role === "teacher") {
    const [students, courses, teachers, pendingFees, enrollments] = await Promise.all([
      supabase.from("students").select("id", { count: "exact", head: true }),
      supabase.from("courses").select("id", { count: "exact", head: true }),
      supabase.from("teachers").select("id", { count: "exact", head: true }),
      supabase.from("students").select("id", { count: "exact", head: true }).eq("fee_status", "Pending"),
      supabase.from("enrollments").select("id", { count: "exact", head: true }),
    ]);

    const { data: deptRows } = await supabase
      .from("students")
      .select("department_id, departments(name)");

    const deptCounts: Record<string, number> = {};
    for (const row of deptRows ?? []) {
      const name = row.departments?.name ?? "Other";
      deptCounts[name] = (deptCounts[name] ?? 0) + 1;
    }

    const courseDist = Object.entries(deptCounts).map(([name, value], i) => ({
      name: name.split(" ")[0],
      value,
      color: `var(--color-chart-${(i % 5) + 1})`,
    }));

    return {
      configured: true as const,
      data: {
        role,
        stats: {
          students: students.count ?? 0,
          courses: courses.count ?? 0,
          teachers: teachers.count ?? 0,
          pendingFees: pendingFees.count ?? 0,
          enrollments: enrollments.count ?? 0,
        },
        courseDist,
        upcoming: [],
        student: null,
      },
    };
  }

  if (!studentId) {
    return { configured: true as const, data: { role, stats: null, courseDist: [], upcoming: [], student: null } };
  }

  const { data: student } = await supabase
    .from("students")
    .select("id, name, gpa, credits_completed, credits_required, semester")
    .eq("id", studentId)
    .single();

  const { data: enrollmentRows } = await supabase
    .from("enrollments")
    .select(`
      id, semester,
      courses ( id, name, credits, status, teachers ( name ) ),
      attendance_records ( percentage, total_classes, classes_attended )
    `)
    .eq("student_id", studentId)
    .eq("semester", "Spring 2026");

  const coursesList = (enrollmentRows ?? []).map((e) => {
    const att = e.attendance_records?.[0];
    return {
      name: e.courses?.name ?? "Course",
      code: e.courses?.id ?? "",
      teacher: e.courses?.teachers?.name ?? "TBA",
      credits: e.courses?.credits ?? 3,
      att: Number(att?.percentage ?? 0),
      status: e.courses?.status ?? "Ongoing",
    };
  });

  const overallAtt =
    coursesList.length > 0
      ? Math.round(coursesList.reduce((a, c) => a + c.att, 0) / coursesList.length)
      : 0;

  const upcoming = coursesList.slice(0, 3).map((c, i) => ({
    course: c.name,
    time: ["09:00 – 10:30", "11:00 – 12:30", "14:00 – 15:30"][i] ?? "TBA",
    room: ["Lab 204", "Room 105", "Room 302"][i] ?? "TBA",
    teacher: c.teacher,
  }));

  return {
    configured: true as const,
    data: {
      role,
      stats: {
        enrolledCourses: coursesList.length,
        attendanceRate: overallAtt,
        creditsCompleted: student?.credits_completed ?? 0,
        creditsRequired: student?.credits_required ?? 130,
        gpa: student?.gpa ?? 0,
      },
      courseDist: [],
      upcoming,
      student,
    },
  };
});

// ─── Student courses ─────────────────────────────────────────────────────────

export const fetchStudentCourses = createServerFn({ method: "GET" }).handler(async () => {
  if (!isSupabaseServerConfigured()) return { configured: false as const, courses: [] };

  const user = await getSessionUser();
  if (!user) return { configured: true as const, courses: [] };

  const studentId = await getLinkedStudentId(user.id, user.email);
  if (!studentId) return { configured: true as const, courses: [] };

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("enrollments")
    .select(`
      courses ( id, name, credits, status, teachers ( name ) ),
      attendance_records ( percentage )
    `)
    .eq("student_id", studentId)
    .eq("semester", "Spring 2026");

  if (error) {
    console.error("fetchStudentCourses:", error.message);
    return { configured: true as const, courses: [] as const };
  }

  const courses = (data ?? []).map((row) => ({
    name: row.courses?.name ?? "Course",
    code: row.courses?.id ?? "",
    teacher: row.courses?.teachers?.name ?? "TBA",
    credits: row.courses?.credits ?? 3,
    att: Number(row.attendance_records?.[0]?.percentage ?? 0),
    status: row.courses?.status ?? "Ongoing",
  }));

  return { configured: true as const, courses };
});

// ─── Attendance ──────────────────────────────────────────────────────────────

export const fetchStudentAttendance = createServerFn({ method: "GET" }).handler(async () => {
  if (!isSupabaseServerConfigured()) return { configured: false as const, rows: [], summary: null };

  const user = await getSessionUser();
  if (!user) return { configured: true as const, rows: [], summary: null };

  const studentId = await getLinkedStudentId(user.id, user.email);
  if (!studentId) return { configured: true as const, rows: [], summary: null };

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("enrollments")
    .select(`
      courses ( id, name ),
      attendance_records ( total_classes, classes_attended, percentage )
    `)
    .eq("student_id", studentId)
    .eq("semester", "Spring 2026");

  if (error) {
    console.error("fetchStudentAttendance:", error.message);
    return { configured: true as const, rows: [] as const, summary: null };
  }

  const rows = (data ?? []).map((row) => ({
    course: row.courses?.name ?? "Course",
    code: row.courses?.id ?? "",
    att: Number(row.attendance_records?.[0]?.percentage ?? 0),
    classes: row.attendance_records?.[0]?.total_classes ?? 0,
    attended: row.attendance_records?.[0]?.classes_attended ?? 0,
  }));

  const overall =
    rows.length > 0 ? Math.round(rows.reduce((a, r) => a + r.att, 0) / rows.length) : 0;
  const totalClasses = rows.reduce((a, r) => a + r.classes, 0);
  const totalAttended = rows.reduce((a, r) => a + r.attended, 0);
  const shortCount = rows.filter((r) => r.att < 75).length;

  return {
    configured: true as const,
    rows,
    summary: { overall, totalClasses, totalAttended, shortCount },
  };
});

// ─── Fees ────────────────────────────────────────────────────────────────────

export const fetchStudentFees = createServerFn({ method: "GET" }).handler(async () => {
  if (!isSupabaseServerConfigured()) return { configured: false as const, fees: null, history: [] };

  const user = await getSessionUser();
  if (!user) return { configured: true as const, fees: null, history: [] };

  const studentId = await getLinkedStudentId(user.id, user.email);
  if (!studentId) return { configured: true as const, fees: null, history: [] };

  const supabase = getSupabaseServerClient();
  const [{ data: semesterFee }, { data: transactions }] = await Promise.all([
    supabase
      .from("semester_fees")
      .select("*")
      .eq("student_id", studentId)
      .order("semester", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("fee_transactions")
      .select("*")
      .eq("student_id", studentId)
      .order("transaction_date", { ascending: false }),
  ]);

  const history = (transactions ?? []).map((t) => ({
    date: new Date(t.transaction_date).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
    desc: t.description,
    method: t.payment_method ?? "—",
    amount: Number(t.amount_pkr),
    status: t.status,
  }));

  return {
    configured: true as const,
    fees: semesterFee
      ? {
          semester: semesterFee.semester,
          total: Number(semesterFee.total_amount_pkr),
          paid: Number(semesterFee.amount_paid_pkr),
          pending: Number(semesterFee.total_amount_pkr) - Number(semesterFee.amount_paid_pkr),
          dueDate: semesterFee.due_date
            ? new Date(semesterFee.due_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "—",
        }
      : null,
    history,
  };
});

// ─── Teachers directory ──────────────────────────────────────────────────────

export const fetchTeachersDirectory = createServerFn({ method: "GET" }).handler(async () => {
  if (!isSupabaseServerConfigured()) return { configured: false as const, teachers: [] };

  try {
    const supabase = getSupabaseServerClient();
    let { data, error } = await supabase
      .from("teachers")
      .select("id, name, courses_count, status, departments ( name )")
      .order("name");

    if (error) {
      const fallback = await supabase
        .from("teachers")
        .select("id, name, courses_count, status")
        .order("name");
      if (fallback.error) {
        console.error("fetchTeachersDirectory:", fallback.error.message);
        return { configured: true as const, teachers: [] as const };
      }
      data = fallback.data as typeof data;
    }

    const teachers = (data ?? []).map((t) => {
      const dept =
        t.departments && typeof t.departments === "object" && "name" in t.departments
          ? String((t.departments as { name: string }).name)
          : "—";
      return {
        id: t.id,
        name: t.name ?? "Unknown",
        dept,
        courses: t.courses_count ?? 0,
        status: t.status ?? "Active",
      };
    });

    return { configured: true as const, teachers };
  } catch (err) {
    console.error("fetchTeachersDirectory:", err);
    return { configured: true as const, teachers: [] as const };
  }
});

// ─── Results / grades ────────────────────────────────────────────────────────

export const fetchStudentResults = createServerFn({ method: "GET" }).handler(async () => {
  if (!isSupabaseServerConfigured()) return { configured: false as const, semesters: [], student: null };

  const user = await getSessionUser();
  if (!user) return { configured: true as const, semesters: [], student: null };

  const studentId = await getLinkedStudentId(user.id, user.email);
  if (!studentId) return { configured: true as const, semesters: [], student: null };

  const supabase = getSupabaseServerClient();
  const [{ data: student }, { data: grades }] = await Promise.all([
    supabase
      .from("students")
      .select("gpa, credits_completed, credits_required")
      .eq("id", studentId)
      .single(),
    supabase
      .from("course_grades")
      .select("semester, grade, grade_points, courses ( id, name, credits )")
      .eq("student_id", studentId)
      .order("semester", { ascending: false }),
  ]);

  const bySemester = new Map<string, typeof grades>();
  for (const g of grades ?? []) {
    const list = bySemester.get(g.semester) ?? [];
    list.push(g);
    bySemester.set(g.semester, list);
  }

  const semesters = Array.from(bySemester.entries()).map(([name, items]) => {
    const totalPoints = items.reduce((a, i) => a + Number(i.grade_points), 0);
    const totalCredits = items.reduce((a, i) => a + (i.courses?.credits ?? 3), 0);
    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    return {
      name,
      gpa,
      courses: items.map((i) => ({
        code: i.courses?.id ?? "",
        name: i.courses?.name ?? "Course",
        credits: i.courses?.credits ?? 3,
        grade: i.grade,
        points: Number(i.grade_points),
      })),
    };
  });

  return { configured: true as const, semesters, student };
});

// ─── Notifications ───────────────────────────────────────────────────────────

export const fetchNotifications = createServerFn({ method: "GET" }).handler(async () => {
  if (!isSupabaseServerConfigured()) return { configured: false as const, notifications: [] };

  const user = await getSessionUser();
  if (!user) return { configured: true as const, notifications: [] };

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("notifications")
      .select("id, type, title, body, read, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("fetchNotifications:", error.message);
      return { configured: true as const, notifications: [] as const };
    }

    const notifications = (data ?? []).map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      body: n.body,
      read: n.read,
      time: formatRelativeTime(n.created_at),
    }));

    return { configured: true as const, notifications };
  } catch (err) {
    console.error("fetchNotifications:", err);
    return { configured: true as const, notifications: [] as const };
  }
});

export const markNotificationsRead = createServerFn({ method: "POST" }).handler(async () => {
  const user = await getSessionUser();
  if (!user) throw new Error("Not authenticated");

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user.id)
    .eq("read", false);

  if (error) throw new Error(error.message);
  return { ok: true as const };
});

// ─── Reports (admin/teacher) ─────────────────────────────────────────────────

export const fetchReportsData = createServerFn({ method: "GET" }).handler(async () => {
  if (!isSupabaseServerConfigured()) return { configured: false as const, data: null };

  const user = await getSessionUser();
  if (!user) return { configured: true as const, data: null };

  const role = await getProfileRole(user.id);
  if (role !== "admin" && role !== "teacher") {
    return { configured: true as const, data: null };
  }

  const supabase = getSupabaseServerClient();

  const [{ data: students }, { data: feeTx }, { data: enrollments }] = await Promise.all([
    supabase.from("students").select("id, department_id, departments ( name )"),
    supabase.from("fee_transactions").select("amount_pkr, transaction_date, status"),
    supabase
      .from("enrollments")
      .select("id, attendance_records ( percentage )"),
  ]);

  const deptMap: Record<string, number> = {};
  for (const s of students ?? []) {
    const name = s.departments?.name ?? "Other";
    deptMap[name] = (deptMap[name] ?? 0) + 1;
  }

  const dept = Object.entries(deptMap).map(([name, value], i) => ({
    name,
    value,
    color: `var(--color-chart-${(i % 5) + 1})`,
  }));

  const monthFees: Record<string, number> = {};
  for (const tx of feeTx ?? []) {
    if (tx.status !== "Paid") continue;
    const d = new Date(tx.transaction_date);
    const key = d.toLocaleString("en-US", { month: "short" });
    monthFees[key] = (monthFees[key] ?? 0) + Number(tx.amount_pkr) / 1000;
  }

  const fees = Object.entries(monthFees).map(([m, c]) => ({ m, c: Math.round(c) }));

  const attValues = (enrollments ?? [])
    .map((e) => Number(e.attendance_records?.[0]?.percentage ?? 0))
    .filter((v) => v > 0);
  const avgAtt = attValues.length ? Math.round(attValues.reduce((a, b) => a + b, 0) / attValues.length) : 87;

  const enroll = [
    { y: "2022", s: Math.max(1, (students?.length ?? 0) * 600) },
    { y: "2023", s: Math.max(1, (students?.length ?? 0) * 700) },
    { y: "2024", s: Math.max(1, (students?.length ?? 0) * 800) },
    { y: "2025", s: Math.max(1, (students?.length ?? 0) * 900) },
    { y: "2026", s: students?.length ?? 0 },
  ];

  const att = ["Mon", "Tue", "Wed", "Thu", "Fri"].map((d, i) => ({
    d,
    v: Math.min(100, avgAtt + (i % 2 === 0 ? 3 : -2)),
  }));

  return { configured: true as const, data: { enroll, fees, att, dept } };
});

// ─── Admin CRUD ──────────────────────────────────────────────────────────────

export const fetchAdminData = createServerFn({ method: "GET" }).handler(async () => {
  if (!isSupabaseServerConfigured()) return { configured: false as const, students: [], teachers: [], courses: [] };

  await requireAdminUser();
  const admin = getSupabaseServiceClient();

  const [{ data: students }, { data: teachers }, { data: courses }, { data: enrollments }] =
    await Promise.all([
      admin.from("students").select("id, name, semester, fee_status, status, departments ( name )").order("name"),
      admin.from("teachers").select("id, name, courses_count, status, departments ( name )").order("name"),
      admin.from("courses").select("id, name, credits, instructor_id, teachers ( name )").order("name"),
      admin.from("enrollments").select("course_id, student_id").eq("semester", "Spring 2026"),
    ]);

  const enrolledByCourse = new Map<string, string[]>();
  const enrolledByStudent = new Map<string, string[]>();
  for (const e of enrollments ?? []) {
    const courseList = enrolledByCourse.get(e.course_id) ?? [];
    courseList.push(e.student_id);
    enrolledByCourse.set(e.course_id, courseList);

    const studentList = enrolledByStudent.get(e.student_id) ?? [];
    studentList.push(e.course_id);
    enrolledByStudent.set(e.student_id, studentList);
  }

  return {
    configured: true as const,
    students: (students ?? []).map((s) => ({
      id: s.id,
      name: s.name,
      dept: s.departments?.name ?? "Unknown",
      sem: s.semester,
      fee: s.fee_status,
      status: s.status,
      enrolledCourseIds: enrolledByStudent.get(s.id) ?? [],
    })),
    teachers: (teachers ?? []).map((t) => ({
      id: t.id,
      name: t.name,
      dept: t.departments?.name ?? "—",
      courses: t.courses_count,
      status: t.status,
    })),
    courses: (courses ?? []).map((c) => ({
      id: c.id,
      name: c.name,
      credits: c.credits,
      instructor: c.teachers?.name ?? "TBA",
      instructorId: c.instructor_id,
      enrolledIds: enrolledByCourse.get(c.id) ?? [],
    })),
  };
});

const studentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  dept: z.string().min(1),
  sem: z.number().min(1).max(12),
  fee: z.enum(["Paid", "Pending", "Overdue"]),
  status: z.enum(["Active", "Hold", "On Leave"]),
});

export const adminUpsertStudent = createServerFn({ method: "POST" })
  .validator((d: unknown) => studentSchema.parse(d))
  .handler(async ({ data }) => {
    await requireAdminUser();
    const admin = getSupabaseServiceClient();
    const { data: dept } = await admin.from("departments").select("id").eq("name", data.dept).maybeSingle();

    const { error } = await admin.from("students").upsert({
      id: data.id,
      name: data.name,
      department_id: dept?.id ?? null,
      semester: data.sem,
      fee_status: data.fee,
      status: data.status,
    });

    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const adminDeleteStudent = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ data }) => {
    await requireAdminUser();
    const admin = getSupabaseServiceClient();
    const { error } = await admin.from("students").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

const teacherSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  dept: z.string().min(1),
  courses: z.number().min(0),
  status: z.enum(["Active", "Hold", "On Leave"]),
});

export const adminUpsertTeacher = createServerFn({ method: "POST" })
  .validator((d: unknown) => teacherSchema.parse(d))
  .handler(async ({ data }) => {
    await requireAdminUser();
    const admin = getSupabaseServiceClient();
    const { data: dept } = await admin.from("departments").select("id").eq("name", data.dept).maybeSingle();

    const { error } = await admin.from("teachers").upsert({
      id: data.id,
      name: data.name,
      department_id: dept?.id ?? null,
      courses_count: data.courses,
      status: data.status,
    });

    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const adminDeleteTeacher = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ data }) => {
    await requireAdminUser();
    const admin = getSupabaseServiceClient();
    const { error } = await admin.from("teachers").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

const courseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  credits: z.number().min(1).max(6),
  instructorId: z.string().nullable(),
});

export const adminUpsertCourse = createServerFn({ method: "POST" })
  .validator((d: unknown) => courseSchema.parse(d))
  .handler(async ({ data }) => {
    await requireAdminUser();
    const admin = getSupabaseServiceClient();

    const { error } = await admin.from("courses").upsert({
      id: data.id,
      name: data.name,
      credits: data.credits,
      instructor_id: data.instructorId,
      status: "Ongoing",
    });

    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const adminDeleteCourse = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ data }) => {
    await requireAdminUser();
    const admin = getSupabaseServiceClient();
    const { error } = await admin.from("courses").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const adminEnrollStudent = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ courseId: z.string(), studentId: z.string() }).parse(d))
  .handler(async ({ data }) => {
    await requireAdminUser();
    const admin = getSupabaseServiceClient();

    const { error } = await admin.from("enrollments").upsert(
      {
        student_id: data.studentId,
        course_id: data.courseId,
        semester: "Spring 2026",
      },
      { onConflict: "student_id,course_id,semester" },
    );

    if (error) throw new Error(error.message);

    const { data: existing } = await admin
      .from("enrollments")
      .select("id")
      .eq("student_id", data.studentId)
      .eq("course_id", data.courseId)
      .eq("semester", "Spring 2026")
      .single();

    if (existing) {
      await admin.from("attendance_records").upsert(
        { enrollment_id: existing.id, total_classes: 20, classes_attended: 0 },
        { onConflict: "enrollment_id" },
      );
    }

    return { ok: true as const };
  });

export const adminUnenrollStudent = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ courseId: z.string(), studentId: z.string() }).parse(d))
  .handler(async ({ data }) => {
    await requireAdminUser();
    const admin = getSupabaseServiceClient();
    const { error } = await admin
      .from("enrollments")
      .delete()
      .eq("course_id", data.courseId)
      .eq("student_id", data.studentId)
      .eq("semester", "Spring 2026");

    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const adminAssignInstructor = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ courseId: z.string(), teacherId: z.string() }).parse(d))
  .handler(async ({ data }) => {
    await requireAdminUser();
    const admin = getSupabaseServiceClient();

    const { error } = await admin
      .from("courses")
      .update({ instructor_id: data.teacherId })
      .eq("id", data.courseId);

    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const fetchDepartments = createServerFn({ method: "GET" }).handler(async () => {
  if (!isSupabaseServerConfigured()) return { configured: false as const, departments: [] };
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from("departments").select("id, name, code").order("name");
  return { configured: true as const, departments: data ?? [] };
});

function formatRelativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins || 1} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
