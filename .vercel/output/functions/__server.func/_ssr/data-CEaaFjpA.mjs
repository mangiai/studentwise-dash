import { c as createServerRpc, i as isSupabaseServerConfigured, g as getSupabaseServerClient, a as getSupabaseServiceClient } from "./server-DYh3X2_O.mjs";
import { c as createServerFn } from "./index.mjs";
import "../_libs/supabase__ssr.mjs";
import "../_libs/ws.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, e as enumType, n as numberType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "events";
import "https";
import "http";
import "net";
import "tls";
import "url";
import "zlib";
import "buffer";
async function getSessionUser() {
  const supabase = getSupabaseServerClient();
  const {
    data: {
      user
    },
    error
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}
async function getProfileRole(userId) {
  const supabase = getSupabaseServerClient();
  const {
    data: profile
  } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();
  const sessionUser = await getSessionUser();
  const appRole = sessionUser?.id === userId && typeof sessionUser.app_metadata?.role === "string" ? sessionUser.app_metadata.role : void 0;
  if (profile?.role === "admin" || appRole === "admin") return "admin";
  if (profile?.role === "teacher" || appRole === "teacher") return "teacher";
  return profile?.role ?? appRole ?? "student";
}
async function requireAdminUser() {
  const user = await getSessionUser();
  if (!user) throw new Error("Not authenticated");
  const role = await getProfileRole(user.id);
  if (role !== "admin") throw new Error("Admin access required");
  return user;
}
async function getLinkedStudentId(userId) {
  const supabase = getSupabaseServerClient();
  const {
    data
  } = await supabase.from("students").select("id").eq("user_id", userId).maybeSingle();
  return data?.id ?? null;
}
const fetchPortalDashboard_createServerFn_handler = createServerRpc({
  id: "4d58b59035eedce7ce0138b80e99f8b926ccc5785931c8b58844e1fd3485cefb",
  name: "fetchPortalDashboard",
  filename: "src/lib/supabase/data.ts"
}, (opts) => fetchPortalDashboard.__executeServer(opts));
const fetchPortalDashboard = createServerFn({
  method: "GET"
}).handler(fetchPortalDashboard_createServerFn_handler, async () => {
  if (!isSupabaseServerConfigured()) return {
    configured: false,
    data: null
  };
  const supabase = getSupabaseServerClient();
  const user = await getSessionUser();
  if (!user) return {
    configured: true,
    data: null
  };
  const role = await getProfileRole(user.id);
  const studentId = await getLinkedStudentId(user.id);
  if (role === "admin" || role === "teacher") {
    const [students, courses, teachers, pendingFees, enrollments] = await Promise.all([supabase.from("students").select("id", {
      count: "exact",
      head: true
    }), supabase.from("courses").select("id", {
      count: "exact",
      head: true
    }), supabase.from("teachers").select("id", {
      count: "exact",
      head: true
    }), supabase.from("students").select("id", {
      count: "exact",
      head: true
    }).eq("fee_status", "Pending"), supabase.from("enrollments").select("id", {
      count: "exact",
      head: true
    })]);
    const {
      data: deptRows
    } = await supabase.from("students").select("department_id, departments(name)");
    const deptCounts = {};
    for (const row of deptRows ?? []) {
      const name = row.departments?.name ?? "Other";
      deptCounts[name] = (deptCounts[name] ?? 0) + 1;
    }
    const courseDist = Object.entries(deptCounts).map(([name, value], i) => ({
      name: name.split(" ")[0],
      value,
      color: `var(--color-chart-${i % 5 + 1})`
    }));
    return {
      configured: true,
      data: {
        role,
        stats: {
          students: students.count ?? 0,
          courses: courses.count ?? 0,
          teachers: teachers.count ?? 0,
          pendingFees: pendingFees.count ?? 0,
          enrollments: enrollments.count ?? 0
        },
        courseDist,
        upcoming: [],
        student: null
      }
    };
  }
  if (!studentId) {
    return {
      configured: true,
      data: {
        role,
        stats: null,
        courseDist: [],
        upcoming: [],
        student: null
      }
    };
  }
  const {
    data: student
  } = await supabase.from("students").select("id, name, gpa, credits_completed, credits_required, semester").eq("id", studentId).single();
  const {
    data: enrollmentRows
  } = await supabase.from("enrollments").select(`
      id, semester,
      courses ( id, name, credits, status, teachers ( name ) ),
      attendance_records ( percentage, total_classes, classes_attended )
    `).eq("student_id", studentId).eq("semester", "Spring 2026");
  const coursesList = (enrollmentRows ?? []).map((e) => {
    const att = e.attendance_records?.[0];
    return {
      name: e.courses?.name ?? "Course",
      code: e.courses?.id ?? "",
      teacher: e.courses?.teachers?.name ?? "TBA",
      credits: e.courses?.credits ?? 3,
      att: Number(att?.percentage ?? 0),
      status: e.courses?.status ?? "Ongoing"
    };
  });
  const overallAtt = coursesList.length > 0 ? Math.round(coursesList.reduce((a, c) => a + c.att, 0) / coursesList.length) : 0;
  const upcoming = coursesList.slice(0, 3).map((c, i) => ({
    course: c.name,
    time: ["09:00 – 10:30", "11:00 – 12:30", "14:00 – 15:30"][i] ?? "TBA",
    room: ["Lab 204", "Room 105", "Room 302"][i] ?? "TBA",
    teacher: c.teacher
  }));
  return {
    configured: true,
    data: {
      role,
      stats: {
        enrolledCourses: coursesList.length,
        attendanceRate: overallAtt,
        creditsCompleted: student?.credits_completed ?? 0,
        creditsRequired: student?.credits_required ?? 130,
        gpa: student?.gpa ?? 0
      },
      courseDist: [],
      upcoming,
      student
    }
  };
});
const fetchStudentCourses_createServerFn_handler = createServerRpc({
  id: "27a33e4debd6ab168eca59511cde63291174028f4c53b5dd4c7e35736c5e9e8c",
  name: "fetchStudentCourses",
  filename: "src/lib/supabase/data.ts"
}, (opts) => fetchStudentCourses.__executeServer(opts));
const fetchStudentCourses = createServerFn({
  method: "GET"
}).handler(fetchStudentCourses_createServerFn_handler, async () => {
  if (!isSupabaseServerConfigured()) return {
    configured: false,
    courses: []
  };
  const user = await getSessionUser();
  if (!user) return {
    configured: true,
    courses: []
  };
  const studentId = await getLinkedStudentId(user.id);
  if (!studentId) return {
    configured: true,
    courses: []
  };
  const supabase = getSupabaseServerClient();
  const {
    data,
    error
  } = await supabase.from("enrollments").select(`
      courses ( id, name, credits, status, teachers ( name ) ),
      attendance_records ( percentage )
    `).eq("student_id", studentId).eq("semester", "Spring 2026");
  if (error) throw new Error(error.message);
  const courses = (data ?? []).map((row) => ({
    name: row.courses?.name ?? "Course",
    code: row.courses?.id ?? "",
    teacher: row.courses?.teachers?.name ?? "TBA",
    credits: row.courses?.credits ?? 3,
    att: Number(row.attendance_records?.[0]?.percentage ?? 0),
    status: row.courses?.status ?? "Ongoing"
  }));
  return {
    configured: true,
    courses
  };
});
const fetchStudentAttendance_createServerFn_handler = createServerRpc({
  id: "1c992a22673887e7539d78f909fadc2ecdc1437aa03e1d401ccb7da67c839712",
  name: "fetchStudentAttendance",
  filename: "src/lib/supabase/data.ts"
}, (opts) => fetchStudentAttendance.__executeServer(opts));
const fetchStudentAttendance = createServerFn({
  method: "GET"
}).handler(fetchStudentAttendance_createServerFn_handler, async () => {
  if (!isSupabaseServerConfigured()) return {
    configured: false,
    rows: [],
    summary: null
  };
  const user = await getSessionUser();
  if (!user) return {
    configured: true,
    rows: [],
    summary: null
  };
  const studentId = await getLinkedStudentId(user.id);
  if (!studentId) return {
    configured: true,
    rows: [],
    summary: null
  };
  const supabase = getSupabaseServerClient();
  const {
    data,
    error
  } = await supabase.from("enrollments").select(`
      courses ( id, name ),
      attendance_records ( total_classes, classes_attended, percentage )
    `).eq("student_id", studentId).eq("semester", "Spring 2026");
  if (error) throw new Error(error.message);
  const rows = (data ?? []).map((row) => ({
    course: row.courses?.name ?? "Course",
    code: row.courses?.id ?? "",
    att: Number(row.attendance_records?.[0]?.percentage ?? 0),
    classes: row.attendance_records?.[0]?.total_classes ?? 0,
    attended: row.attendance_records?.[0]?.classes_attended ?? 0
  }));
  const overall = rows.length > 0 ? Math.round(rows.reduce((a, r) => a + r.att, 0) / rows.length) : 0;
  const totalClasses = rows.reduce((a, r) => a + r.classes, 0);
  const totalAttended = rows.reduce((a, r) => a + r.attended, 0);
  const shortCount = rows.filter((r) => r.att < 75).length;
  return {
    configured: true,
    rows,
    summary: {
      overall,
      totalClasses,
      totalAttended,
      shortCount
    }
  };
});
const fetchStudentFees_createServerFn_handler = createServerRpc({
  id: "fb8395712825c4225151658d1832ab5545573c85cb60b7b65ee70536388c4472",
  name: "fetchStudentFees",
  filename: "src/lib/supabase/data.ts"
}, (opts) => fetchStudentFees.__executeServer(opts));
const fetchStudentFees = createServerFn({
  method: "GET"
}).handler(fetchStudentFees_createServerFn_handler, async () => {
  if (!isSupabaseServerConfigured()) return {
    configured: false,
    fees: null,
    history: []
  };
  const user = await getSessionUser();
  if (!user) return {
    configured: true,
    fees: null,
    history: []
  };
  const studentId = await getLinkedStudentId(user.id);
  if (!studentId) return {
    configured: true,
    fees: null,
    history: []
  };
  const supabase = getSupabaseServerClient();
  const [{
    data: semesterFee
  }, {
    data: transactions
  }] = await Promise.all([supabase.from("semester_fees").select("*").eq("student_id", studentId).order("semester", {
    ascending: false
  }).limit(1).maybeSingle(), supabase.from("fee_transactions").select("*").eq("student_id", studentId).order("transaction_date", {
    ascending: false
  })]);
  const history = (transactions ?? []).map((t) => ({
    date: new Date(t.transaction_date).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    }),
    desc: t.description,
    method: t.payment_method ?? "—",
    amount: Number(t.amount_pkr),
    status: t.status
  }));
  return {
    configured: true,
    fees: semesterFee ? {
      semester: semesterFee.semester,
      total: Number(semesterFee.total_amount_pkr),
      paid: Number(semesterFee.amount_paid_pkr),
      pending: Number(semesterFee.total_amount_pkr) - Number(semesterFee.amount_paid_pkr),
      dueDate: semesterFee.due_date ? new Date(semesterFee.due_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }) : "—"
    } : null,
    history
  };
});
const fetchTeachersDirectory_createServerFn_handler = createServerRpc({
  id: "b5f2635ccbe59e85f45a2bcfcfaadd3f163385450bde1a06bb7d4fc12873cd46",
  name: "fetchTeachersDirectory",
  filename: "src/lib/supabase/data.ts"
}, (opts) => fetchTeachersDirectory.__executeServer(opts));
const fetchTeachersDirectory = createServerFn({
  method: "GET"
}).handler(fetchTeachersDirectory_createServerFn_handler, async () => {
  if (!isSupabaseServerConfigured()) return {
    configured: false,
    teachers: []
  };
  const supabase = getSupabaseServerClient();
  const {
    data,
    error
  } = await supabase.from("teachers").select("id, name, courses_count, status, departments ( name )").order("name");
  if (error) throw new Error(error.message);
  const teachers = (data ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    dept: t.departments?.name ?? "—",
    courses: t.courses_count,
    email: `${t.name.toLowerCase().replace(/[^a-z]/g, ".").replace(/\.+/g, ".")}@university.edu`,
    status: t.status
  }));
  return {
    configured: true,
    teachers
  };
});
const fetchStudentResults_createServerFn_handler = createServerRpc({
  id: "9f11ffa414be66e3006d68b5c10f24ac322e83baf518493bc1f9e7e71d9b2711",
  name: "fetchStudentResults",
  filename: "src/lib/supabase/data.ts"
}, (opts) => fetchStudentResults.__executeServer(opts));
const fetchStudentResults = createServerFn({
  method: "GET"
}).handler(fetchStudentResults_createServerFn_handler, async () => {
  if (!isSupabaseServerConfigured()) return {
    configured: false,
    semesters: [],
    student: null
  };
  const user = await getSessionUser();
  if (!user) return {
    configured: true,
    semesters: [],
    student: null
  };
  const studentId = await getLinkedStudentId(user.id);
  if (!studentId) return {
    configured: true,
    semesters: [],
    student: null
  };
  const supabase = getSupabaseServerClient();
  const [{
    data: student
  }, {
    data: grades
  }] = await Promise.all([supabase.from("students").select("gpa, credits_completed, credits_required").eq("id", studentId).single(), supabase.from("course_grades").select("semester, grade, grade_points, courses ( id, name, credits )").eq("student_id", studentId).order("semester", {
    ascending: false
  })]);
  const bySemester = /* @__PURE__ */ new Map();
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
        points: Number(i.grade_points)
      }))
    };
  });
  return {
    configured: true,
    semesters,
    student
  };
});
const fetchNotifications_createServerFn_handler = createServerRpc({
  id: "e5d4892a39ae5cc7ab1e55b6203012d23aaed92bc3eac7162d6bcda38547f35b",
  name: "fetchNotifications",
  filename: "src/lib/supabase/data.ts"
}, (opts) => fetchNotifications.__executeServer(opts));
const fetchNotifications = createServerFn({
  method: "GET"
}).handler(fetchNotifications_createServerFn_handler, async () => {
  if (!isSupabaseServerConfigured()) return {
    configured: false,
    notifications: []
  };
  const user = await getSessionUser();
  if (!user) return {
    configured: true,
    notifications: []
  };
  const supabase = getSupabaseServerClient();
  const {
    data,
    error
  } = await supabase.from("notifications").select("id, type, title, body, read, created_at").eq("user_id", user.id).order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  const notifications = (data ?? []).map((n) => ({
    id: n.id,
    type: n.type,
    title: n.title,
    body: n.body,
    read: n.read,
    time: formatRelativeTime(n.created_at)
  }));
  return {
    configured: true,
    notifications
  };
});
const markNotificationsRead_createServerFn_handler = createServerRpc({
  id: "7d25a97408bca731433777e4edd9a6c0c38d51dd3b82a40825d7e47b0d1ab33d",
  name: "markNotificationsRead",
  filename: "src/lib/supabase/data.ts"
}, (opts) => markNotificationsRead.__executeServer(opts));
const markNotificationsRead = createServerFn({
  method: "POST"
}).handler(markNotificationsRead_createServerFn_handler, async () => {
  const user = await getSessionUser();
  if (!user) throw new Error("Not authenticated");
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.from("notifications").update({
    read: true
  }).eq("user_id", user.id).eq("read", false);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const fetchReportsData_createServerFn_handler = createServerRpc({
  id: "590186aa9e0c1014257b0831d4ff2db55313c8e363af0434bde5729de7adc641",
  name: "fetchReportsData",
  filename: "src/lib/supabase/data.ts"
}, (opts) => fetchReportsData.__executeServer(opts));
const fetchReportsData = createServerFn({
  method: "GET"
}).handler(fetchReportsData_createServerFn_handler, async () => {
  if (!isSupabaseServerConfigured()) return {
    configured: false,
    data: null
  };
  const user = await getSessionUser();
  if (!user) return {
    configured: true,
    data: null
  };
  const role = await getProfileRole(user.id);
  if (role !== "admin" && role !== "teacher") {
    return {
      configured: true,
      data: null
    };
  }
  const supabase = getSupabaseServerClient();
  const [{
    data: students
  }, {
    data: feeTx
  }, {
    data: enrollments
  }] = await Promise.all([supabase.from("students").select("id, department_id, departments ( name )"), supabase.from("fee_transactions").select("amount_pkr, transaction_date, status"), supabase.from("enrollments").select("id, attendance_records ( percentage )")]);
  const deptMap = {};
  for (const s of students ?? []) {
    const name = s.departments?.name ?? "Other";
    deptMap[name] = (deptMap[name] ?? 0) + 1;
  }
  const dept = Object.entries(deptMap).map(([name, value], i) => ({
    name,
    value,
    color: `var(--color-chart-${i % 5 + 1})`
  }));
  const monthFees = {};
  for (const tx of feeTx ?? []) {
    if (tx.status !== "Paid") continue;
    const d = new Date(tx.transaction_date);
    const key = d.toLocaleString("en-US", {
      month: "short"
    });
    monthFees[key] = (monthFees[key] ?? 0) + Number(tx.amount_pkr) / 1e3;
  }
  const fees = Object.entries(monthFees).map(([m, c]) => ({
    m,
    c: Math.round(c)
  }));
  const attValues = (enrollments ?? []).map((e) => Number(e.attendance_records?.[0]?.percentage ?? 0)).filter((v) => v > 0);
  const avgAtt = attValues.length ? Math.round(attValues.reduce((a, b) => a + b, 0) / attValues.length) : 87;
  const enroll = [{
    y: "2022",
    s: Math.max(1, (students?.length ?? 0) * 600)
  }, {
    y: "2023",
    s: Math.max(1, (students?.length ?? 0) * 700)
  }, {
    y: "2024",
    s: Math.max(1, (students?.length ?? 0) * 800)
  }, {
    y: "2025",
    s: Math.max(1, (students?.length ?? 0) * 900)
  }, {
    y: "2026",
    s: students?.length ?? 0
  }];
  const att = ["Mon", "Tue", "Wed", "Thu", "Fri"].map((d, i) => ({
    d,
    v: Math.min(100, avgAtt + (i % 2 === 0 ? 3 : -2))
  }));
  return {
    configured: true,
    data: {
      enroll,
      fees,
      att,
      dept
    }
  };
});
const fetchAdminData_createServerFn_handler = createServerRpc({
  id: "4a22e228ac3dec572222c3ac622eaff59615c9b086b053ef0f83f627240b404a",
  name: "fetchAdminData",
  filename: "src/lib/supabase/data.ts"
}, (opts) => fetchAdminData.__executeServer(opts));
const fetchAdminData = createServerFn({
  method: "GET"
}).handler(fetchAdminData_createServerFn_handler, async () => {
  if (!isSupabaseServerConfigured()) return {
    configured: false,
    students: [],
    teachers: [],
    courses: []
  };
  await requireAdminUser();
  const admin = getSupabaseServiceClient();
  const [{
    data: students
  }, {
    data: teachers
  }, {
    data: courses
  }, {
    data: enrollments
  }] = await Promise.all([admin.from("students").select("id, name, semester, fee_status, status, departments ( name )").order("name"), admin.from("teachers").select("id, name, courses_count, status, departments ( name )").order("name"), admin.from("courses").select("id, name, credits, instructor_id, teachers ( name )").order("name"), admin.from("enrollments").select("course_id, student_id")]);
  const enrolledByCourse = /* @__PURE__ */ new Map();
  for (const e of enrollments ?? []) {
    const list = enrolledByCourse.get(e.course_id) ?? [];
    list.push(e.student_id);
    enrolledByCourse.set(e.course_id, list);
  }
  return {
    configured: true,
    students: (students ?? []).map((s) => ({
      id: s.id,
      name: s.name,
      dept: s.departments?.name ?? "Unknown",
      sem: s.semester,
      fee: s.fee_status,
      status: s.status
    })),
    teachers: (teachers ?? []).map((t) => ({
      id: t.id,
      name: t.name,
      dept: t.departments?.name ?? "—",
      courses: t.courses_count,
      status: t.status
    })),
    courses: (courses ?? []).map((c) => ({
      id: c.id,
      name: c.name,
      credits: c.credits,
      instructor: c.teachers?.name ?? "TBA",
      instructorId: c.instructor_id,
      enrolledIds: enrolledByCourse.get(c.id) ?? []
    }))
  };
});
const studentSchema = objectType({
  id: stringType().min(1),
  name: stringType().min(1),
  dept: stringType().min(1),
  sem: numberType().min(1).max(12),
  fee: enumType(["Paid", "Pending", "Overdue"]),
  status: enumType(["Active", "Hold", "On Leave"])
});
const adminUpsertStudent_createServerFn_handler = createServerRpc({
  id: "91c76d7cfaf2705e8949982f7c5b719d5d23f89c19c75d47ef6a1f4fec7ed188",
  name: "adminUpsertStudent",
  filename: "src/lib/supabase/data.ts"
}, (opts) => adminUpsertStudent.__executeServer(opts));
const adminUpsertStudent = createServerFn({
  method: "POST"
}).validator((d) => studentSchema.parse(d)).handler(adminUpsertStudent_createServerFn_handler, async ({
  data
}) => {
  await requireAdminUser();
  const admin = getSupabaseServiceClient();
  const {
    data: dept
  } = await admin.from("departments").select("id").eq("name", data.dept).maybeSingle();
  const {
    error
  } = await admin.from("students").upsert({
    id: data.id,
    name: data.name,
    department_id: dept?.id ?? null,
    semester: data.sem,
    fee_status: data.fee,
    status: data.status
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminDeleteStudent_createServerFn_handler = createServerRpc({
  id: "ef05a33c8c0fc2d4e14862eeda98aed4fd92a87d5d33de9817a5690efc0afa16",
  name: "adminDeleteStudent",
  filename: "src/lib/supabase/data.ts"
}, (opts) => adminDeleteStudent.__executeServer(opts));
const adminDeleteStudent = createServerFn({
  method: "POST"
}).validator((d) => objectType({
  id: stringType()
}).parse(d)).handler(adminDeleteStudent_createServerFn_handler, async ({
  data
}) => {
  await requireAdminUser();
  const admin = getSupabaseServiceClient();
  const {
    error
  } = await admin.from("students").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const teacherSchema = objectType({
  id: stringType().min(1),
  name: stringType().min(1),
  dept: stringType().min(1),
  courses: numberType().min(0),
  status: enumType(["Active", "Hold", "On Leave"])
});
const adminUpsertTeacher_createServerFn_handler = createServerRpc({
  id: "b8358eea26f012b12ecee8933899c09ded27475ca2c58b31312693baa932657b",
  name: "adminUpsertTeacher",
  filename: "src/lib/supabase/data.ts"
}, (opts) => adminUpsertTeacher.__executeServer(opts));
const adminUpsertTeacher = createServerFn({
  method: "POST"
}).validator((d) => teacherSchema.parse(d)).handler(adminUpsertTeacher_createServerFn_handler, async ({
  data
}) => {
  await requireAdminUser();
  const admin = getSupabaseServiceClient();
  const {
    data: dept
  } = await admin.from("departments").select("id").eq("name", data.dept).maybeSingle();
  const {
    error
  } = await admin.from("teachers").upsert({
    id: data.id,
    name: data.name,
    department_id: dept?.id ?? null,
    courses_count: data.courses,
    status: data.status
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminDeleteTeacher_createServerFn_handler = createServerRpc({
  id: "0f177057b3eedf551448672319e2edcf864b932ea83e342b067d992b5464c151",
  name: "adminDeleteTeacher",
  filename: "src/lib/supabase/data.ts"
}, (opts) => adminDeleteTeacher.__executeServer(opts));
const adminDeleteTeacher = createServerFn({
  method: "POST"
}).validator((d) => objectType({
  id: stringType()
}).parse(d)).handler(adminDeleteTeacher_createServerFn_handler, async ({
  data
}) => {
  await requireAdminUser();
  const admin = getSupabaseServiceClient();
  const {
    error
  } = await admin.from("teachers").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const courseSchema = objectType({
  id: stringType().min(1),
  name: stringType().min(1),
  credits: numberType().min(1).max(6),
  instructorId: stringType().nullable()
});
const adminUpsertCourse_createServerFn_handler = createServerRpc({
  id: "1a97aa40280300c66046e063af9eb8241517d3ca2cfd4292d30f04c850083dc0",
  name: "adminUpsertCourse",
  filename: "src/lib/supabase/data.ts"
}, (opts) => adminUpsertCourse.__executeServer(opts));
const adminUpsertCourse = createServerFn({
  method: "POST"
}).validator((d) => courseSchema.parse(d)).handler(adminUpsertCourse_createServerFn_handler, async ({
  data
}) => {
  await requireAdminUser();
  const admin = getSupabaseServiceClient();
  const {
    error
  } = await admin.from("courses").upsert({
    id: data.id,
    name: data.name,
    credits: data.credits,
    instructor_id: data.instructorId,
    status: "Ongoing"
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminDeleteCourse_createServerFn_handler = createServerRpc({
  id: "06eb8d06a0375e2d8a5409e1323f5b757c32664ec5951a4fc54137416be0fcb6",
  name: "adminDeleteCourse",
  filename: "src/lib/supabase/data.ts"
}, (opts) => adminDeleteCourse.__executeServer(opts));
const adminDeleteCourse = createServerFn({
  method: "POST"
}).validator((d) => objectType({
  id: stringType()
}).parse(d)).handler(adminDeleteCourse_createServerFn_handler, async ({
  data
}) => {
  await requireAdminUser();
  const admin = getSupabaseServiceClient();
  const {
    error
  } = await admin.from("courses").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminEnrollStudent_createServerFn_handler = createServerRpc({
  id: "8b56fb568c5391c221fd012500e983022c9f00c90f326c85d167c6cb77721d48",
  name: "adminEnrollStudent",
  filename: "src/lib/supabase/data.ts"
}, (opts) => adminEnrollStudent.__executeServer(opts));
const adminEnrollStudent = createServerFn({
  method: "POST"
}).validator((d) => objectType({
  courseId: stringType(),
  studentId: stringType()
}).parse(d)).handler(adminEnrollStudent_createServerFn_handler, async ({
  data
}) => {
  await requireAdminUser();
  const admin = getSupabaseServiceClient();
  const {
    error
  } = await admin.from("enrollments").upsert({
    student_id: data.studentId,
    course_id: data.courseId,
    semester: "Spring 2026"
  }, {
    onConflict: "student_id,course_id,semester"
  });
  if (error) throw new Error(error.message);
  const {
    data: existing
  } = await admin.from("enrollments").select("id").eq("student_id", data.studentId).eq("course_id", data.courseId).eq("semester", "Spring 2026").single();
  if (existing) {
    await admin.from("attendance_records").upsert({
      enrollment_id: existing.id,
      total_classes: 20,
      classes_attended: 0
    }, {
      onConflict: "enrollment_id"
    });
  }
  return {
    ok: true
  };
});
const adminUnenrollStudent_createServerFn_handler = createServerRpc({
  id: "f5ce13c4f64582db3c8db64f8792ac6f21b57ba0a7a9fb3c28dff075154ae810",
  name: "adminUnenrollStudent",
  filename: "src/lib/supabase/data.ts"
}, (opts) => adminUnenrollStudent.__executeServer(opts));
const adminUnenrollStudent = createServerFn({
  method: "POST"
}).validator((d) => objectType({
  courseId: stringType(),
  studentId: stringType()
}).parse(d)).handler(adminUnenrollStudent_createServerFn_handler, async ({
  data
}) => {
  await requireAdminUser();
  const admin = getSupabaseServiceClient();
  const {
    error
  } = await admin.from("enrollments").delete().eq("course_id", data.courseId).eq("student_id", data.studentId).eq("semester", "Spring 2026");
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminAssignInstructor_createServerFn_handler = createServerRpc({
  id: "2f63de82b1cf9780439b15e9ffcd528a0013567e6e3dddd145eb48e98ef6e68d",
  name: "adminAssignInstructor",
  filename: "src/lib/supabase/data.ts"
}, (opts) => adminAssignInstructor.__executeServer(opts));
const adminAssignInstructor = createServerFn({
  method: "POST"
}).validator((d) => objectType({
  courseId: stringType(),
  teacherId: stringType()
}).parse(d)).handler(adminAssignInstructor_createServerFn_handler, async ({
  data
}) => {
  await requireAdminUser();
  const admin = getSupabaseServiceClient();
  const {
    error
  } = await admin.from("courses").update({
    instructor_id: data.teacherId
  }).eq("id", data.courseId);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const fetchDepartments_createServerFn_handler = createServerRpc({
  id: "21708226ea39c855c08b3037a7f14da585af272c615a6cd16e78cad0f778b378",
  name: "fetchDepartments",
  filename: "src/lib/supabase/data.ts"
}, (opts) => fetchDepartments.__executeServer(opts));
const fetchDepartments = createServerFn({
  method: "GET"
}).handler(fetchDepartments_createServerFn_handler, async () => {
  if (!isSupabaseServerConfigured()) return {
    configured: false,
    departments: []
  };
  const supabase = getSupabaseServerClient();
  const {
    data
  } = await supabase.from("departments").select("id, name, code").order("name");
  return {
    configured: true,
    departments: data ?? []
  };
});
function formatRelativeTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 6e4);
  if (mins < 60) return `${mins || 1} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });
}
export {
  adminAssignInstructor_createServerFn_handler,
  adminDeleteCourse_createServerFn_handler,
  adminDeleteStudent_createServerFn_handler,
  adminDeleteTeacher_createServerFn_handler,
  adminEnrollStudent_createServerFn_handler,
  adminUnenrollStudent_createServerFn_handler,
  adminUpsertCourse_createServerFn_handler,
  adminUpsertStudent_createServerFn_handler,
  adminUpsertTeacher_createServerFn_handler,
  fetchAdminData_createServerFn_handler,
  fetchDepartments_createServerFn_handler,
  fetchNotifications_createServerFn_handler,
  fetchPortalDashboard_createServerFn_handler,
  fetchReportsData_createServerFn_handler,
  fetchStudentAttendance_createServerFn_handler,
  fetchStudentCourses_createServerFn_handler,
  fetchStudentFees_createServerFn_handler,
  fetchStudentResults_createServerFn_handler,
  fetchTeachersDirectory_createServerFn_handler,
  markNotificationsRead_createServerFn_handler
};
