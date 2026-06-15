import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  getSupabaseServerClient,
  getSupabaseServiceClient,
  isSupabaseServerConfigured,
} from "@/lib/supabase/server";
import type { AuthUser, UserRole } from "@/lib/auth-types";
import { isStaffRole } from "@/lib/auth-types";
import { CURRENT_SEMESTER, ATTENDANCE_TERM } from "@/lib/constants";
import {
  cnicSchema,
  dateOfBirthSchema,
  normalizeCnic,
  normalizePakistanPhone,
  passwordSchema,
  phoneSchema,
  portalEmailSchema,
} from "@/lib/validation/person-fields";

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
  if (profile?.role === "moderator" || appRole === "moderator") return "moderator";
  if (profile?.role === "teacher" || appRole === "teacher") return "teacher";
  return (profile?.role as UserRole) ?? appRole ?? "student";
}

async function requireStaffUser() {
  const user = await getSessionUser();
  if (!user) throw new Error("Not authenticated");
  const role = await getProfileRole(user.id);
  if (!isStaffRole(role)) throw new Error("Staff access required");
  return user;
}

async function requireAdminUser() {
  const user = await getSessionUser();
  if (!user) throw new Error("Not authenticated");
  const role = await getProfileRole(user.id);
  if (role !== "admin") throw new Error("Admin access required");
  return user;
}

async function notifyStudentUser(
  admin: ReturnType<typeof getSupabaseServiceClient>,
  studentId: string,
  payload: { type: "fee" | "attendance" | "course" | "announcement"; title: string; body: string },
) {
  const { data: student } = await admin.from("students").select("user_id, name").eq("id", studentId).maybeSingle();
  if (!student?.user_id) return;
  await admin.from("notifications").insert({
    user_id: student.user_id,
    type: payload.type,
    title: payload.title,
    body: payload.body,
    read: false,
  });
}

const TEST_STUDENT_LINKS: Record<string, string> = {
  "sarah@studentwise.test": "2026-BSCS-0042",
  "hassan@studentwise.test": "2026-BSCS-0043",
  "maryam@studentwise.test": "2025-BSEE-0118",
};

const TEST_TEACHER_LINKS: Record<string, string> = {
  "teacher@studentwise.test": "FAC-2018-014",
};

export type TeacherCourseRoster = {
  id: string;
  name: string;
  credits: number;
  status: string;
  enrolledCount: number;
  avgAttendance: number;
  students: {
    id: string;
    name: string;
    semester: number;
    attendance: number;
    classesAttended: number;
    totalClasses: number;
    atRisk: boolean;
  }[];
};

async function getLinkedTeacherId(userId: string, email?: string | null) {
  const normalizedEmail = email?.trim().toLowerCase();

  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const admin = getSupabaseServiceClient();

    const { data: linked } = await admin
      .from("teachers")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();
    if (linked?.id) return linked.id;

    const teacherRecordId = normalizedEmail ? TEST_TEACHER_LINKS[normalizedEmail] : undefined;
    if (!teacherRecordId) return null;

    await admin.from("profiles").upsert({
      id: userId,
      full_name: normalizedEmail,
      role: "teacher",
    });

    const { error } = await admin.from("teachers").update({ user_id: userId }).eq("id", teacherRecordId);
    if (error) {
      console.error("Auto-link teacher failed:", error.message);
    }
    return teacherRecordId;
  }

  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from("teachers").select("id").eq("user_id", userId).maybeSingle();
  if (data?.id) return data.id;

  return normalizedEmail ? (TEST_TEACHER_LINKS[normalizedEmail] ?? null) : null;
}

async function fetchTeacherClassRoster(teacherId: string) {
  const admin = getSupabaseServiceClient();

  const { data: courses, error: coursesError } = await admin
    .from("courses")
    .select("id, name, credits, status")
    .eq("instructor_id", teacherId)
    .order("name");

  if (coursesError) {
    console.error("fetchTeacherClassRoster courses:", coursesError.message);
    return { courses: [] as TeacherCourseRoster[], uniqueStudents: 0, avgAttendance: 0, atRiskCount: 0 };
  }

  if (!courses?.length) {
    return { courses: [] as TeacherCourseRoster[], uniqueStudents: 0, avgAttendance: 0, atRiskCount: 0 };
  }

  const courseIds = courses.map((c) => c.id);
  const { data: enrollments, error: enrollError } = await admin
    .from("enrollments")
    .select(`
      id, course_id,
      students ( id, name, semester ),
      attendance_records ( total_classes, classes_attended, percentage )
    `)
    .in("course_id", courseIds)
    .eq("semester", CURRENT_SEMESTER);

  if (enrollError) {
    console.error("fetchTeacherClassRoster enrollments:", enrollError.message);
  }

  const enrollmentIds = (enrollments ?? []).map((e) => e.id);
  const attByEnrollment = new Map<string, { total: number; attended: number }>();

  if (enrollmentIds.length > 0) {
    const { data: marks, error: marksError } = await admin
      .from("session_attendance")
      .select("enrollment_id, present")
      .in("enrollment_id", enrollmentIds);

    if (marksError) {
      console.error("fetchTeacherClassRoster session_attendance:", marksError.message);
    }

    for (const id of enrollmentIds) {
      attByEnrollment.set(id, { total: 0, attended: 0 });
    }
    for (const mark of marks ?? []) {
      const bucket = attByEnrollment.get(mark.enrollment_id);
      if (!bucket) continue;
      bucket.total += 1;
      if (mark.present) bucket.attended += 1;
    }
  }

  const enrollmentsByCourse = new Map<string, typeof enrollments>();
  for (const enrollment of enrollments ?? []) {
    const list = enrollmentsByCourse.get(enrollment.course_id) ?? [];
    list.push(enrollment);
    enrollmentsByCourse.set(enrollment.course_id, list);
  }

  const uniqueStudentIds = new Set<string>();
  let attendanceSum = 0;
  let attendanceCount = 0;
  let atRiskCount = 0;

  const rosterCourses: TeacherCourseRoster[] = courses.map((course) => {
    const courseEnrollments = enrollmentsByCourse.get(course.id) ?? [];
    const students = courseEnrollments.map((enrollment) => {
      const sessionStats = attByEnrollment.get(enrollment.id);
      const record = enrollment.attendance_records?.[0];
      const totalClasses = sessionStats?.total
        ? sessionStats.total
        : (record?.total_classes ?? 0);
      const classesAttended = sessionStats?.total
        ? sessionStats.attended
        : (record?.classes_attended ?? 0);
      const attendance =
        sessionStats && sessionStats.total > 0
          ? Math.round((sessionStats.attended / sessionStats.total) * 100)
          : Number(record?.percentage ?? 0);
      const atRisk = totalClasses > 0 && attendance < 75;

      uniqueStudentIds.add(enrollment.students?.id ?? "");
      if (totalClasses > 0) {
        attendanceSum += attendance;
        attendanceCount += 1;
        if (atRisk) atRiskCount += 1;
      }

      return {
        id: enrollment.students?.id ?? "",
        name: enrollment.students?.name ?? "Student",
        semester: enrollment.students?.semester ?? 0,
        attendance,
        classesAttended,
        totalClasses,
        atRisk,
      };
    });

    const courseAttValues = students.filter((s) => s.totalClasses > 0).map((s) => s.attendance);
    const avgAttendance =
      courseAttValues.length > 0
        ? Math.round(courseAttValues.reduce((sum, value) => sum + value, 0) / courseAttValues.length)
        : 0;

    return {
      id: course.id,
      name: course.name,
      credits: course.credits,
      status: course.status,
      enrolledCount: students.length,
      avgAttendance,
      students: students.sort((a, b) => a.name.localeCompare(b.name)),
    };
  });

  return {
    courses: rosterCourses,
    uniqueStudents: uniqueStudentIds.size,
    avgAttendance: attendanceCount > 0 ? Math.round(attendanceSum / attendanceCount) : 0,
    atRiskCount,
  };
}

function getStudentDataClient() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return getSupabaseServiceClient();
  }
  return getSupabaseServerClient();
}

async function getLinkedStudentId(userId: string, email?: string | null) {
  const normalizedEmail = email?.trim().toLowerCase();

  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const admin = getSupabaseServiceClient();

    const { data: linked } = await admin
      .from("students")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();
    if (linked?.id) return linked.id;

    const studentRecordId = normalizedEmail ? TEST_STUDENT_LINKS[normalizedEmail] : undefined;
    if (!studentRecordId) return null;

    await admin.from("profiles").upsert({
      id: userId,
      full_name: normalizedEmail,
      role: "student",
    });

    const { error } = await admin.from("students").update({ user_id: userId }).eq("id", studentRecordId);
    if (error) {
      console.error("Auto-link student failed:", error.message);
    }
    return studentRecordId;
  }

  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from("students").select("id").eq("user_id", userId).maybeSingle();
  if (data?.id) return data.id;

  return normalizedEmail ? (TEST_STUDENT_LINKS[normalizedEmail] ?? null) : null;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export const fetchPortalDashboard = createServerFn({ method: "GET" }).handler(async () => {
  if (!isSupabaseServerConfigured()) return { configured: false as const, data: null };

  const supabase = getSupabaseServerClient();
  const user = await getSessionUser();
  if (!user) return { configured: true as const, data: null };

  const role = await getProfileRole(user.id);
  const studentId = await getLinkedStudentId(user.id, user.email);

  if (role === "teacher") {
    const teacherId = await getLinkedTeacherId(user.id, user.email);
    if (!teacherId) {
      return {
        configured: true as const,
        data: {
          role,
          stats: null,
          courseDist: [],
          upcoming: [],
          student: null,
          teacherCourses: [] as TeacherCourseRoster[],
        },
      };
    }

    const roster = await fetchTeacherClassRoster(teacherId);

    return {
      configured: true as const,
      data: {
        role,
        stats: {
          courses: roster.courses.length,
          enrolledStudents: roster.uniqueStudents,
          avgAttendance: roster.avgAttendance,
          atRiskCount: roster.atRiskCount,
        },
        courseDist: [],
        upcoming: [],
        student: null,
        teacherCourses: roster.courses,
      },
    };
  }

  if (role === "admin") {
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
        teacherCourses: [] as TeacherCourseRoster[],
      },
    };
  }

  if (!studentId) {
    return { configured: true as const, data: { role, stats: null, courseDist: [], upcoming: [], student: null, teacherCourses: [] as TeacherCourseRoster[] } };
  }

  const db = getStudentDataClient();
  const { data: student } = await db
    .from("students")
    .select("id, name, gpa, credits_completed, credits_required, semester")
    .eq("id", studentId)
    .single();

  const { data: enrollmentRows } = await db
    .from("enrollments")
    .select(`
      id, semester,
      courses ( id, name, credits, status, teachers ( name ) )
    `)
    .eq("student_id", studentId)
    .eq("semester", CURRENT_SEMESTER);

  const attendanceRows = await resolveStudentAttendanceCourseRows(studentId);
  const attByCode = new Map(attendanceRows.map((r) => [r.code, r.att]));
  const { overall: overallAtt } = summarizeStudentAttendance(attendanceRows);

  const coursesList = (enrollmentRows ?? []).map((e) => ({
    name: e.courses?.name ?? "Course",
    code: e.courses?.id ?? "",
    teacher: e.courses?.teachers?.name ?? "TBA",
    credits: e.courses?.credits ?? 3,
    att: attByCode.get(e.courses?.id ?? "") ?? 0,
    status: e.courses?.status ?? "Ongoing",
  }));

  const upcomingFromSessions = attendanceRows
    .flatMap((r) => r.sessions)
    .filter((s) => s.id && s.date)
    .sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`))
    .slice(0, 3)
    .map((s) => ({
      course: s.courseName,
      time: `${s.startTime} – ${s.endTime}`,
      room: s.room,
      teacher:
        coursesList.find((c) => c.code === s.courseCode)?.teacher ?? "TBA",
    }));

  const upcoming =
    upcomingFromSessions.length > 0
      ? upcomingFromSessions
      : coursesList.slice(0, 3).map((c, i) => ({
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
      teacherCourses: [] as TeacherCourseRoster[],
    },
  };
});

// ─── Student courses ─────────────────────────────────────────────────────────

export const fetchStudentCourses = createServerFn({ method: "GET" }).handler(async () => {
  if (!isSupabaseServerConfigured()) return { configured: false as const, courses: [], view: "student" as const };

  const user = await getSessionUser();
  if (!user) return { configured: true as const, courses: [], view: "student" as const };

  const role = await getProfileRole(user.id);
  if (role === "teacher") {
    const teacherId = await getLinkedTeacherId(user.id, user.email);
    if (!teacherId) return { configured: true as const, courses: [], view: "teacher" as const };

    const roster = await fetchTeacherClassRoster(teacherId);
    const courses = roster.courses.map((course) => ({
      name: course.name,
      code: course.id,
      teacher: "You",
      credits: course.credits,
      att: course.avgAttendance,
      status: course.status,
      enrolledCount: course.enrolledCount,
    }));

    return { configured: true as const, courses, view: "teacher" as const };
  }

  const studentId = await getLinkedStudentId(user.id, user.email);
  if (!studentId) return { configured: true as const, courses: [], view: "student" as const };

  const db = getStudentDataClient();
  const { data, error } = await db
    .from("enrollments")
    .select(`
      courses ( id, name, credits, status, teachers ( name ) )
    `)
    .eq("student_id", studentId)
    .eq("semester", CURRENT_SEMESTER);

  if (error) {
    console.error("fetchStudentCourses:", error.message, { studentId });
    return { configured: true as const, courses: [] as const, view: "student" as const };
  }

  const attendanceRows = await resolveStudentAttendanceCourseRows(studentId);
  const attByCode = new Map(attendanceRows.map((r) => [r.code, r.att]));

  const courses = (data ?? []).map((row) => ({
    name: row.courses?.name ?? "Course",
    code: row.courses?.id ?? "",
    teacher: row.courses?.teachers?.name ?? "TBA",
    credits: row.courses?.credits ?? 3,
    att: attByCode.get(row.courses?.id ?? "") ?? 0,
    status: row.courses?.status ?? "Ongoing",
  }));

  return { configured: true as const, courses, view: "student" as const };
});

// ─── Attendance ──────────────────────────────────────────────────────────────

async function fetchEnrollmentAttendanceRows(studentId: string) {
  const db = getStudentDataClient();
  const { data: enrollments, error: enrollError } = await db
    .from("enrollments")
    .select("id, course_id, courses ( id, name )")
    .eq("student_id", studentId)
    .eq("semester", CURRENT_SEMESTER);

  if (enrollError) {
    console.error("fetchEnrollmentAttendanceRows enrollments:", enrollError.message, { studentId });
    return [];
  }

  if (!enrollments?.length) return [];

  const enrollmentIds = enrollments.map((e) => e.id);
  const { data: marks, error: marksError } = await db
    .from("session_attendance")
    .select("enrollment_id, present, class_sessions ( id, session_date, start_time, end_time, room, course_id )")
    .in("enrollment_id", enrollmentIds);

  if (marksError) {
    console.error("fetchEnrollmentAttendanceRows session_attendance:", marksError.message);
  }

  const byEnrollment = new Map<string, { total: number; attended: number; sessions: typeof marks }>();
  for (const e of enrollments) {
    byEnrollment.set(e.id, { total: 0, attended: 0, sessions: [] });
  }
  for (const mark of marks ?? []) {
    const bucket = byEnrollment.get(mark.enrollment_id);
    if (!bucket) continue;
    bucket.total += 1;
    if (mark.present) bucket.attended += 1;
    bucket.sessions.push(mark);
  }

  return enrollments.map((e) => {
    const stats = byEnrollment.get(e.id) ?? { total: 0, attended: 0, sessions: [] };
    const att =
      stats.total > 0 ? Math.round((stats.attended / stats.total) * 100) : 0;
    return {
      enrollmentId: e.id,
      course: e.courses?.name ?? "Course",
      code: e.courses?.id ?? e.course_id,
      att,
      classes: stats.total,
      attended: stats.attended,
      sessions: (stats.sessions ?? []).map((m) => ({
        id: m.class_sessions?.id ?? "",
        date: m.class_sessions?.session_date ?? "",
        startTime: m.class_sessions?.start_time?.slice(0, 5) ?? "",
        endTime: m.class_sessions?.end_time?.slice(0, 5) ?? "",
        room: m.class_sessions?.room ?? "TBA",
        present: m.present,
        courseCode: e.courses?.id ?? "",
        courseName: e.courses?.name ?? "Course",
      })),
    };
  });
}

async function resolveStudentAttendanceCourseRows(studentId: string) {
  let courseRows = await fetchEnrollmentAttendanceRows(studentId);

  if (courseRows.every((r) => r.classes === 0)) {
    const db = getStudentDataClient();
    const { data, error } = await db
      .from("enrollments")
      .select(`
        id,
        courses ( id, name ),
        attendance_records ( total_classes, classes_attended, percentage )
      `)
      .eq("student_id", studentId)
      .eq("semester", CURRENT_SEMESTER);

    if (!error && data?.length) {
      courseRows = data.map((row) => ({
        enrollmentId: row.id,
        course: row.courses?.name ?? "Course",
        code: row.courses?.id ?? "",
        att: Number(row.attendance_records?.[0]?.percentage ?? 0),
        classes: row.attendance_records?.[0]?.total_classes ?? 0,
        attended: row.attendance_records?.[0]?.classes_attended ?? 0,
        sessions: [],
      }));
    }
  }

  return courseRows;
}

function summarizeStudentAttendance(
  courseRows: Awaited<ReturnType<typeof resolveStudentAttendanceCourseRows>>,
) {
  const active = courseRows.filter((r) => r.att > 0);
  const overall =
    active.length > 0 ? Math.round(active.reduce((a, r) => a + r.att, 0) / active.length) : 0;
  const totalClasses = active.reduce((a, r) => a + r.classes, 0);
  const totalAttended = active.reduce((a, r) => a + r.attended, 0);
  const shortCount = active.filter((r) => r.att < 75).length;

  return { overall, totalClasses, totalAttended, shortCount, active };
}

export const fetchAttendancePage = createServerFn({ method: "GET" }).handler(async () => {
  if (!isSupabaseServerConfigured()) {
    return {
      configured: false as const,
      view: "student" as const,
      rows: [],
      summary: null,
      sessions: [],
      teacherCourses: [] as TeacherCourseRoster[],
      term: ATTENDANCE_TERM,
    };
  }

  const user = await getSessionUser();
  if (!user) {
    return {
      configured: true as const,
      view: "student" as const,
      rows: [],
      summary: null,
      sessions: [],
      teacherCourses: [] as TeacherCourseRoster[],
      term: ATTENDANCE_TERM,
    };
  }

  const role = await getProfileRole(user.id);
  if (role === "teacher") {
    const teacherId = await getLinkedTeacherId(user.id, user.email);
    if (!teacherId) {
      return {
        configured: true as const,
        view: "teacher" as const,
        rows: [],
        summary: null,
        sessions: [],
        teacherCourses: [] as TeacherCourseRoster[],
        term: ATTENDANCE_TERM,
      };
    }

    const roster = await fetchTeacherClassRoster(teacherId);
    return {
      configured: true as const,
      view: "teacher" as const,
      rows: [],
      summary: null,
      sessions: [],
      teacherCourses: roster.courses,
      term: ATTENDANCE_TERM,
    };
  }

  const studentId = await getLinkedStudentId(user.id, user.email);
  if (!studentId) {
    return {
      configured: true as const,
      view: "student" as const,
      rows: [],
      summary: null,
      sessions: [],
      teacherCourses: [] as TeacherCourseRoster[],
      term: ATTENDANCE_TERM,
    };
  }

  const courseRows = await resolveStudentAttendanceCourseRows(studentId);
  const rows = courseRows
    .filter((r) => r.att > 0)
    .map(({ enrollmentId: _e, sessions: _s, ...row }) => row);
  const allSessions = courseRows
    .flatMap((r) => r.sessions)
    .filter((s) => s.id && s.date)
    .sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`));
  const { overall, totalClasses, totalAttended, shortCount } = summarizeStudentAttendance(courseRows);

  return {
    configured: true as const,
    view: "student" as const,
    rows,
    sessions: allSessions,
    teacherCourses: [] as TeacherCourseRoster[],
    term: ATTENDANCE_TERM,
    summary: { overall, totalClasses, totalAttended, shortCount },
  };
});

export const fetchTeacherAttendance = createServerFn({ method: "GET" }).handler(async () => {
  if (!isSupabaseServerConfigured()) {
    return { configured: false as const, courses: [] as TeacherCourseRoster[], term: ATTENDANCE_TERM };
  }

  const user = await getSessionUser();
  if (!user) {
    return { configured: true as const, courses: [] as TeacherCourseRoster[], term: ATTENDANCE_TERM };
  }

  const role = await getProfileRole(user.id);
  if (role !== "teacher") {
    return { configured: true as const, courses: [] as TeacherCourseRoster[], term: ATTENDANCE_TERM };
  }

  const teacherId = await getLinkedTeacherId(user.id, user.email);
  if (!teacherId) {
    return { configured: true as const, courses: [] as TeacherCourseRoster[], term: ATTENDANCE_TERM };
  }

  const roster = await fetchTeacherClassRoster(teacherId);
  return { configured: true as const, courses: roster.courses, term: ATTENDANCE_TERM };
});

export const fetchStudentAttendance = createServerFn({ method: "GET" }).handler(async () => {
  if (!isSupabaseServerConfigured()) return { configured: false as const, rows: [], summary: null, sessions: [], term: ATTENDANCE_TERM };

  const user = await getSessionUser();
  if (!user) return { configured: true as const, rows: [], summary: null, sessions: [], term: ATTENDANCE_TERM };

  const studentId = await getLinkedStudentId(user.id, user.email);
  if (!studentId) return { configured: true as const, rows: [], summary: null, sessions: [], term: ATTENDANCE_TERM };

  let courseRows = await resolveStudentAttendanceCourseRows(studentId);

  const rows = courseRows
    .filter((r) => r.att > 0)
    .map(({ enrollmentId: _e, sessions: _s, ...row }) => row);

  const allSessions = courseRows
    .flatMap((r) => r.sessions)
    .filter((s) => s.id && s.date)
    .sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`));

  const { overall, totalClasses, totalAttended, shortCount } = summarizeStudentAttendance(courseRows);

  return {
    configured: true as const,
    rows,
    sessions: allSessions,
    term: ATTENDANCE_TERM,
    summary: { overall, totalClasses, totalAttended, shortCount },
  };
});

export const fetchAdminAttendance = createServerFn({ method: "GET" })
  .validator((d: unknown) =>
    z.object({ studentId: z.string().optional(), courseId: z.string().optional() }).parse(d ?? {}),
  )
  .handler(async ({ data }) => {
    await requireStaffUser();
    const admin = getSupabaseServiceClient();

    const [{ data: students }, { data: courses }] = await Promise.all([
      admin.from("students").select("id, name").order("name"),
      admin.from("courses").select("id, name").order("name"),
    ]);

    if (!data.studentId) {
      return {
        students: students ?? [],
        courses: courses ?? [],
        sessions: [],
        term: ATTENDANCE_TERM,
      };
    }

    const { data: enrollments } = await admin
      .from("enrollments")
      .select("id, course_id, courses ( id, name )")
      .eq("student_id", data.studentId)
      .eq("semester", CURRENT_SEMESTER);

    const filtered = data.courseId
      ? (enrollments ?? []).filter((e) => e.course_id === data.courseId)
      : (enrollments ?? []);

    if (filtered.length === 0) {
      return { students: students ?? [], courses: courses ?? [], sessions: [], term: ATTENDANCE_TERM };
    }

    const enrollmentIds = filtered.map((e) => e.id);
    const { data: marks } = await admin
      .from("session_attendance")
      .select(`
        id, enrollment_id, present,
        class_sessions ( id, session_date, start_time, end_time, room, course_id, courses ( name ) )
      `)
      .in("enrollment_id", enrollmentIds);

    const sessions = (marks ?? [])
      .map((m) => ({
        markId: m.id,
        enrollmentId: m.enrollment_id,
        present: m.present,
        sessionId: m.class_sessions?.id ?? "",
        date: m.class_sessions?.session_date ?? "",
        startTime: m.class_sessions?.start_time?.slice(0, 5) ?? "",
        endTime: m.class_sessions?.end_time?.slice(0, 5) ?? "",
        room: m.class_sessions?.room ?? "TBA",
        courseCode: m.class_sessions?.course_id ?? "",
        courseName: m.class_sessions?.courses?.name ?? "Course",
      }))
      .sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`));

    return { students: students ?? [], courses: courses ?? [], sessions, term: ATTENDANCE_TERM };
  });

export const adminUpdateSessionAttendance = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        markId: z.string().uuid(),
        present: z.boolean(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    await requireStaffUser();
    const admin = getSupabaseServiceClient();

    const { data: mark, error: fetchError } = await admin
      .from("session_attendance")
      .select("enrollment_id, class_sessions ( courses ( name ), session_date )")
      .eq("id", data.markId)
      .single();

    if (fetchError || !mark) throw new Error(fetchError?.message ?? "Attendance mark not found");

    const { error } = await admin
      .from("session_attendance")
      .update({ present: data.present, marked_at: new Date().toISOString() })
      .eq("id", data.markId);

    if (error) throw new Error(error.message);

    const { data: student } = await admin
      .from("enrollments")
      .select("student_id")
      .eq("id", mark.enrollment_id)
      .single();

    if (student?.student_id) {
      await notifyStudentUser(admin, student.student_id, {
        type: "attendance",
        title: "Attendance updated",
        body: `Your attendance for ${mark.class_sessions?.courses?.name ?? "a course"} on ${mark.class_sessions?.session_date ?? "a class"} was marked as ${data.present ? "Present" : "Absent"}.`,
      });
    }

    return { ok: true as const };
  });

// ─── Fees ────────────────────────────────────────────────────────────────────

export const fetchStudentFees = createServerFn({ method: "GET" }).handler(async () => {
  if (!isSupabaseServerConfigured()) return { configured: false as const, fees: null, history: [] };

  const user = await getSessionUser();
  if (!user) return { configured: true as const, fees: null, history: [] };

  const studentId = await getLinkedStudentId(user.id, user.email);
  if (!studentId) return { configured: true as const, fees: null, history: [] };

  const db = getStudentDataClient();
  let semesterFee = (
    await db
      .from("semester_fees")
      .select("*")
      .eq("student_id", studentId)
      .eq("semester", CURRENT_SEMESTER)
      .maybeSingle()
  ).data;

  if (!semesterFee) {
    semesterFee = (
      await db
        .from("semester_fees")
        .select("*")
        .eq("student_id", studentId)
        .order("semester", { ascending: false })
        .limit(1)
        .maybeSingle()
    ).data;
  }

  const { data: transactions } = await db
      .from("fee_transactions")
      .select("*")
      .eq("student_id", studentId)
      .order("transaction_date", { ascending: false });

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

  const db = getStudentDataClient();
  const [{ data: student }, { data: grades }] = await Promise.all([
    db
      .from("students")
      .select("gpa, credits_completed, credits_required")
      .eq("id", studentId)
      .single(),
    db
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

  await requireStaffUser();
  const admin = getSupabaseServiceClient();

  const [{ data: students }, { data: teachers }, { data: courses }, { data: enrollments }] =
    await Promise.all([
      admin.from("students").select("id, name, semester, fee_status, status, cnic, email, phone, date_of_birth, departments ( name )").order("name"),
      admin.from("teachers").select("id, name, courses_count, status, cnic, email, phone, date_of_birth, departments ( name )").order("name"),
      admin.from("courses").select("id, name, credits, instructor_id, teachers ( name )").order("name"),
      admin.from("enrollments").select("course_id, student_id").eq("semester", CURRENT_SEMESTER),
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
      cnic: s.cnic ?? "",
      email: s.email ?? "",
      phone: s.phone ?? "",
      dateOfBirth: s.date_of_birth ?? "",
      enrolledCourseIds: enrolledByStudent.get(s.id) ?? [],
    })),
    teachers: (teachers ?? []).map((t) => ({
      id: t.id,
      name: t.name,
      dept: t.departments?.name ?? "—",
      courses: t.courses_count,
      status: t.status,
      cnic: t.cnic ?? "",
      email: t.email ?? "",
      phone: t.phone ?? "",
      dateOfBirth: t.date_of_birth ?? "",
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
  email: portalEmailSchema,
  phone: phoneSchema,
  cnic: cnicSchema,
  dateOfBirth: dateOfBirthSchema,
  password: z.string().optional(),
  isNew: z.boolean().optional(),
});

const teacherSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  dept: z.string().min(1),
  courses: z.number().min(0),
  status: z.enum(["Active", "Hold", "On Leave"]),
  email: portalEmailSchema,
  phone: phoneSchema,
  cnic: cnicSchema,
  dateOfBirth: dateOfBirthSchema,
  password: z.string().optional(),
  isNew: z.boolean().optional(),
});

async function assertUniquePersonIdentity(
  admin: ReturnType<typeof getSupabaseServiceClient>,
  table: "students" | "teachers",
  params: { id: string; cnic: string; email: string; phone: string },
) {
  const cnic = normalizeCnic(params.cnic)!;
  const email = params.email.trim().toLowerCase();
  const phone = normalizePakistanPhone(params.phone)!;

  const { data: cnicRow } = await admin
    .from(table)
    .select("id")
    .eq("cnic", cnic)
    .neq("id", params.id)
    .maybeSingle();
  if (cnicRow) throw new Error("This CNIC is already registered.");

  const { data: emailRow } = await admin
    .from(table)
    .select("id")
    .eq("email", email)
    .neq("id", params.id)
    .maybeSingle();
  if (emailRow) throw new Error("This email is already used by another record.");

  const { data: phoneRow } = await admin
    .from(table)
    .select("id")
    .eq("phone", phone)
    .neq("id", params.id)
    .maybeSingle();
  if (phoneRow) throw new Error("This phone number is already registered.");
}

async function provisionPortalAccount(
  admin: ReturnType<typeof getSupabaseServiceClient>,
  params: {
    email: string;
    password: string;
    fullName: string;
    role: "student" | "teacher";
    existingUserId?: string | null;
  },
) {
  const email = params.email.trim().toLowerCase();

  if (params.existingUserId) {
    const { error } = await admin.auth.admin.updateUserById(params.existingUserId, {
      email,
      password: params.password,
      email_confirm: true,
      app_metadata: { role: params.role },
      user_metadata: { full_name: params.fullName },
    });
    if (error) throw new Error(error.message);

    await admin.from("profiles").upsert({
      id: params.existingUserId,
      full_name: params.fullName,
      role: params.role,
    });
    return params.existingUserId;
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: params.password,
    email_confirm: true,
    app_metadata: { role: params.role },
    user_metadata: { full_name: params.fullName },
  });
  if (error) throw new Error(error.message);

  await admin.from("profiles").upsert({
    id: data.user.id,
    full_name: params.fullName,
    role: params.role,
  });

  return data.user.id;
}

async function syncLinkedPortalAccount(
  admin: ReturnType<typeof getSupabaseServiceClient>,
  params: {
    table: "students" | "teachers";
    recordId: string;
    email: string;
    password?: string;
    fullName: string;
    role: "student" | "teacher";
    isNew: boolean;
  },
) {
  const email = params.email.trim().toLowerCase();

  const { data: record } = await admin
    .from(params.table)
    .select("user_id")
    .eq("id", params.recordId)
    .maybeSingle();

  if (params.isNew) {
    if (!params.password) throw new Error("Password is required when creating an account.");
    passwordSchema.parse(params.password);

    const userId = await provisionPortalAccount(admin, {
      email,
      password: params.password,
      fullName: params.fullName,
      role: params.role,
      existingUserId: record?.user_id,
    });
    return userId;
  }

  if (record?.user_id) {
    const updates: {
      email: string;
      email_confirm: boolean;
      password?: string;
      user_metadata: { full_name: string };
    } = {
      email,
      email_confirm: true,
      user_metadata: { full_name: params.fullName },
    };
    if (params.password) {
      passwordSchema.parse(params.password);
      updates.password = params.password;
    }
    const { error } = await admin.auth.admin.updateUserById(record.user_id, updates);
    if (error) throw new Error(error.message);

    await admin.from("profiles").upsert({
      id: record.user_id,
      full_name: params.fullName,
      role: params.role,
    });
    return record.user_id;
  }

  if (!params.password) return null;

  passwordSchema.parse(params.password);
  const userId = await provisionPortalAccount(admin, {
    email,
    password: params.password,
    fullName: params.fullName,
    role: params.role,
  });
  return userId;
}
export const adminUpsertStudent = createServerFn({ method: "POST" })
  .validator((d: unknown) => studentSchema.parse(d))
  .handler(async ({ data }) => {
    await requireStaffUser();
    const admin = getSupabaseServiceClient();
    const isNew = data.isNew ?? false;

    if (isNew && !data.password) {
      throw new Error("Password is required when creating a student account.");
    }

    const cnic = normalizeCnic(data.cnic)!;
    const email = data.email.trim().toLowerCase();
    const phone = normalizePakistanPhone(data.phone)!;

    await assertUniquePersonIdentity(admin, "students", {
      id: data.id,
      cnic,
      email,
      phone,
    });

    const { data: dept } = await admin.from("departments").select("id").eq("name", data.dept).maybeSingle();

    const userId = await syncLinkedPortalAccount(admin, {
      table: "students",
      recordId: data.id,
      email,
      password: data.password,
      fullName: data.name,
      role: "student",
      isNew,
    });

    const { error } = await admin.from("students").upsert({
      id: data.id,
      name: data.name,
      department_id: dept?.id ?? null,
      semester: data.sem,
      fee_status: data.fee,
      status: data.status,
      cnic,
      email,
      phone,
      date_of_birth: data.dateOfBirth,
      user_id: userId ?? undefined,
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


export const adminUpsertTeacher = createServerFn({ method: "POST" })
  .validator((d: unknown) => teacherSchema.parse(d))
  .handler(async ({ data }) => {
    await requireStaffUser();
    const admin = getSupabaseServiceClient();
    const isNew = data.isNew ?? false;

    if (isNew && !data.password) {
      throw new Error("Password is required when creating a teacher account.");
    }

    const cnic = normalizeCnic(data.cnic)!;
    const email = data.email.trim().toLowerCase();
    const phone = normalizePakistanPhone(data.phone)!;

    await assertUniquePersonIdentity(admin, "teachers", {
      id: data.id,
      cnic,
      email,
      phone,
    });

    const { data: dept } = await admin.from("departments").select("id").eq("name", data.dept).maybeSingle();

    const userId = await syncLinkedPortalAccount(admin, {
      table: "teachers",
      recordId: data.id,
      email,
      password: data.password,
      fullName: data.name,
      role: "teacher",
      isNew,
    });

    const { error } = await admin.from("teachers").upsert({
      id: data.id,
      name: data.name,
      department_id: dept?.id ?? null,
      courses_count: data.courses,
      status: data.status,
      cnic,
      email,
      phone,
      date_of_birth: data.dateOfBirth,
      user_id: userId ?? undefined,
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
    await requireStaffUser();
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
    await requireStaffUser();
    const admin = getSupabaseServiceClient();

    const { error } = await admin.from("enrollments").upsert(
      {
        student_id: data.studentId,
        course_id: data.courseId,
        semester: CURRENT_SEMESTER,
      },
      { onConflict: "student_id,course_id,semester" },
    );

    if (error) throw new Error(error.message);

    const [{ data: existing }, { data: course }] = await Promise.all([
      admin
        .from("enrollments")
        .select("id")
        .eq("student_id", data.studentId)
        .eq("course_id", data.courseId)
        .eq("semester", CURRENT_SEMESTER)
        .single(),
      admin.from("courses").select("name").eq("id", data.courseId).maybeSingle(),
    ]);

    if (existing) {
      await admin.from("attendance_records").upsert(
        { enrollment_id: existing.id, total_classes: 20, classes_attended: 0 },
        { onConflict: "enrollment_id" },
      );
    }

    await notifyStudentUser(admin, data.studentId, {
      type: "course",
      title: "Course enrollment updated",
      body: `You have been enrolled in ${course?.name ?? data.courseId} for ${CURRENT_SEMESTER}.`,
    });

    return { ok: true as const };
  });

export const adminUnenrollStudent = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ courseId: z.string(), studentId: z.string() }).parse(d))
  .handler(async ({ data }) => {
    await requireStaffUser();
    const admin = getSupabaseServiceClient();
    const { error } = await admin
      .from("enrollments")
      .delete()
      .eq("course_id", data.courseId)
      .eq("student_id", data.studentId)
      .eq("semester", CURRENT_SEMESTER);

    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const adminAssignInstructor = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ courseId: z.string(), teacherId: z.string() }).parse(d))
  .handler(async ({ data }) => {
    await requireStaffUser();
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

export const fetchAdminEnrollments = createServerFn({ method: "GET" }).handler(async () => {
  if (!isSupabaseServerConfigured()) return { configured: false as const, enrollments: [] };

  await requireStaffUser();
  const admin = getSupabaseServiceClient();

  const { data } = await admin
    .from("enrollments")
    .select(`
      student_id, course_id, semester,
      students ( name ),
      courses ( name )
    `)
    .eq("semester", CURRENT_SEMESTER)
    .order("student_id");

  const enrollments = (data ?? []).map((row) => ({
    studentId: row.student_id,
    studentName: row.students?.name ?? row.student_id,
    courseId: row.course_id,
    courseName: row.courses?.name ?? row.course_id,
    semester: row.semester,
  }));

  return { configured: true as const, enrollments };
});

export const fetchUnreadNotificationCount = createServerFn({ method: "GET" }).handler(async () => {
  if (!isSupabaseServerConfigured()) return { count: 0 };

  const user = await getSessionUser();
  if (!user) return { count: 0 };

  const db = getStudentDataClient();
  const { count } = await db
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("read", false);

  return { count: count ?? 0 };
});

export const markNotificationRead = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const user = await getSessionUser();
    if (!user) throw new Error("Not authenticated");

    const supabase = getSupabaseServerClient();
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", data.id)
      .eq("user_id", user.id);

    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const adminCreateNotification = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        target: z.enum(["student", "all_students", "role"]),
        studentId: z.string().optional(),
        role: z.enum(["student", "teacher", "admin", "moderator"]).optional(),
        type: z.enum(["fee", "attendance", "course", "announcement"]),
        title: z.string().min(1),
        body: z.string().min(1),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    await requireStaffUser();
    const admin = getSupabaseServiceClient();

    let userIds: string[] = [];

    if (data.target === "student" && data.studentId) {
      const { data: student } = await admin
        .from("students")
        .select("user_id")
        .eq("id", data.studentId)
        .maybeSingle();
      if (student?.user_id) userIds = [student.user_id];
    } else if (data.target === "all_students") {
      const { data: rows } = await admin.from("students").select("user_id").not("user_id", "is", null);
      userIds = (rows ?? []).map((r) => r.user_id).filter(Boolean) as string[];
    } else if (data.target === "role" && data.role) {
      const { data: rows } = await admin.from("profiles").select("id").eq("role", data.role);
      userIds = (rows ?? []).map((r) => r.id);
    }

    if (userIds.length === 0) throw new Error("No recipients found for this notification.");

    const { error } = await admin.from("notifications").insert(
      userIds.map((userId) => ({
        user_id: userId,
        type: data.type,
        title: data.title,
        body: data.body,
        read: false,
      })),
    );

    if (error) throw new Error(error.message);
    return { ok: true as const, sent: userIds.length };
  });

export const fetchUserSettings = createServerFn({ method: "GET" }).handler(async () => {
  if (!isSupabaseServerConfigured()) return { configured: false as const, settings: null };

  const user = await getSessionUser();
  if (!user) return { configured: true as const, settings: null };

  const db = getStudentDataClient();
  const { data } = await db
    .from("profiles")
    .select("full_name, role, notify_email, notify_push, notify_fee_reminders")
    .eq("id", user.id)
    .maybeSingle();

  return {
    configured: true as const,
    settings: {
      fullName: data?.full_name ?? user.email ?? "",
      email: user.email ?? "",
      role: data?.role ?? "student",
      notifyEmail: data?.notify_email ?? true,
      notifyPush: data?.notify_push ?? true,
      notifyFeeReminders: data?.notify_fee_reminders ?? true,
    },
  };
});

export const updateUserProfile = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ fullName: z.string().min(2) }).parse(d))
  .handler(async ({ data }) => {
    const user = await getSessionUser();
    if (!user) throw new Error("Not authenticated");

    const db = getStudentDataClient();
    const { error } = await db.from("profiles").update({ full_name: data.fullName }).eq("id", user.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const updateNotificationPreferences = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        notifyEmail: z.boolean(),
        notifyPush: z.boolean(),
        notifyFeeReminders: z.boolean(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const user = await getSessionUser();
    if (!user) throw new Error("Not authenticated");

    const db = getStudentDataClient();
    const { error } = await db
      .from("profiles")
      .update({
        notify_email: data.notifyEmail,
        notify_push: data.notifyPush,
        notify_fee_reminders: data.notifyFeeReminders,
      })
      .eq("id", user.id);

    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const changeUserPassword = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({ currentPassword: z.string().min(6), newPassword: z.string().min(8) }).parse(d),
  )
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) throw new Error("Not authenticated");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: data.currentPassword,
    });
    if (signInError) throw new Error("Current password is incorrect");

    const { error } = await supabase.auth.updateUser({ password: data.newPassword });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const generateFeeInvoice = createServerFn({ method: "GET" }).handler(async () => {
  if (!isSupabaseServerConfigured()) return { configured: false as const, invoice: null };

  const user = await getSessionUser();
  if (!user) return { configured: true as const, invoice: null };

  const studentId = await getLinkedStudentId(user.id, user.email);
  if (!studentId) return { configured: true as const, invoice: null };

  const db = getStudentDataClient();
  const [{ data: student }, { data: semesterFee }] = await Promise.all([
    db.from("students").select("id, name").eq("id", studentId).single(),
    db
      .from("semester_fees")
      .select("*")
      .eq("student_id", studentId)
      .eq("semester", CURRENT_SEMESTER)
      .maybeSingle(),
  ]);

  const total = Number(semesterFee?.total_amount_pkr ?? 98000);
  const paid = Number(semesterFee?.amount_paid_pkr ?? 0);
  const pending = total - paid;
  const challanNo = `SW-${studentId.replace(/-/g, "")}-${CURRENT_SEMESTER.replace(/\s/g, "")}`;

  return {
    configured: true as const,
    invoice: {
      challanNo,
      semester: CURRENT_SEMESTER,
      studentId: student?.id ?? studentId,
      studentName: student?.name ?? "Student",
      issuedAt: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      dueDate: semesterFee?.due_date
        ? new Date(semesterFee.due_date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : "—",
      lineItems: [
        { label: "Tuition Fee", amount: Math.round(total * 0.75) },
        { label: "Lab & Facilities", amount: Math.round(total * 0.15) },
        { label: "Student Services", amount: total - Math.round(total * 0.75) - Math.round(total * 0.15) },
      ],
      total,
      paid,
      pending,
    },
  };
});

export const adminRegenerateChallan = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({ studentId: z.string(), totalAmount: z.number().min(0).optional() }).parse(d),
  )
  .handler(async ({ data }) => {
    await requireStaffUser();
    const admin = getSupabaseServiceClient();
    const total = data.totalAmount ?? 98000;

    const { error } = await admin.from("semester_fees").upsert(
      {
        student_id: data.studentId,
        semester: CURRENT_SEMESTER,
        total_amount_pkr: total,
        amount_paid_pkr: 0,
        due_date: "2026-09-15",
      },
      { onConflict: "student_id,semester" },
    );

    if (error) throw new Error(error.message);

    await admin.from("students").update({ fee_status: "Pending" }).eq("id", data.studentId);

    await notifyStudentUser(admin, data.studentId, {
      type: "fee",
      title: "Semester challan regenerated",
      body: `Your ${CURRENT_SEMESTER} fee challan (PKR ${total.toLocaleString()}) is ready. View it under Fee Management.`,
    });

    return { ok: true as const };
  });

export const adminUpdateChallanStatus = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        studentId: z.string(),
        status: z.enum(["Paid", "Pending", "Overdue"]),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    await requireStaffUser();
    const admin = getSupabaseServiceClient();

    const { error: studentError } = await admin
      .from("students")
      .update({ fee_status: data.status })
      .eq("id", data.studentId);

    if (studentError) throw new Error(studentError.message);

    const { data: semesterFee } = await admin
      .from("semester_fees")
      .select("total_amount_pkr, amount_paid_pkr")
      .eq("student_id", data.studentId)
      .eq("semester", CURRENT_SEMESTER)
      .maybeSingle();

    if (semesterFee) {
      const total = Number(semesterFee.total_amount_pkr);
      const paid = data.status === "Paid" ? total : Number(semesterFee.amount_paid_pkr);

      const { error: feeError } = await admin
        .from("semester_fees")
        .update({ amount_paid_pkr: paid })
        .eq("student_id", data.studentId)
        .eq("semester", CURRENT_SEMESTER);

      if (feeError) throw new Error(feeError.message);
    }

    await notifyStudentUser(admin, data.studentId, {
      type: "fee",
      title: "Challan status updated",
      body: `Your ${CURRENT_SEMESTER} fee challan status is now ${data.status}.`,
    });

    return { ok: true as const };
  });

const gradeSchema = z.object({
  studentId: z.string(),
  courseId: z.string(),
  semester: z.string(),
  grade: z.string(),
  gradePoints: z.number().min(0).max(16),
});

export const adminUpsertGrade = createServerFn({ method: "POST" })
  .validator((d: unknown) => gradeSchema.parse(d))
  .handler(async ({ data }) => {
    await requireStaffUser();
    const admin = getSupabaseServiceClient();

    const { error } = await admin.from("course_grades").upsert(
      {
        student_id: data.studentId,
        course_id: data.courseId,
        semester: data.semester,
        grade: data.grade,
        grade_points: data.gradePoints,
      },
      { onConflict: "student_id,course_id,semester" },
    );

    if (error) throw new Error(error.message);

    await notifyStudentUser(admin, data.studentId, {
      type: "announcement",
      title: "Grade posted",
      body: `Your grade for ${data.courseId} (${data.semester}) has been updated: ${data.grade}.`,
    });

    return { ok: true as const };
  });

export const fetchAdminStudentGrades = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ studentId: z.string() }).parse(d))
  .handler(async ({ data }) => {
    await requireStaffUser();
    const admin = getSupabaseServiceClient();
    const { data: grades } = await admin
      .from("course_grades")
      .select("course_id, semester, grade, grade_points, courses ( name )")
      .eq("student_id", data.studentId)
      .order("semester", { ascending: false });

    return {
      grades: (grades ?? []).map((g) => ({
        courseId: g.course_id,
        courseName: g.courses?.name ?? g.course_id,
        semester: g.semester,
        grade: g.grade,
        gradePoints: Number(g.grade_points),
      })),
    };
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
