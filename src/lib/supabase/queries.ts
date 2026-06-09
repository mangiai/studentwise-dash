import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient, isSupabaseServerConfigured } from "@/lib/supabase/server";

export const fetchDashboardStats = createServerFn({ method: "GET" }).handler(async () => {
  if (!isSupabaseServerConfigured()) {
    return { configured: false as const, stats: null };
  }

  const supabase = getSupabaseServerClient();

  const [students, courses, teachers, pendingFees] = await Promise.all([
    supabase.from("students").select("id", { count: "exact", head: true }),
    supabase.from("courses").select("id", { count: "exact", head: true }),
    supabase.from("teachers").select("id", { count: "exact", head: true }),
    supabase
      .from("students")
      .select("id", { count: "exact", head: true })
      .eq("fee_status", "Pending"),
  ]);

  return {
    configured: true as const,
    stats: {
      students: students.count ?? 0,
      courses: courses.count ?? 0,
      teachers: teachers.count ?? 0,
      pendingFees: pendingFees.count ?? 0,
    },
  };
});

export const fetchStudents = createServerFn({ method: "GET" }).handler(async () => {
  if (!isSupabaseServerConfigured()) {
    return { configured: false as const, students: [] };
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("students")
    .select("id, name, semester, fee_status, status, departments(name)")
    .order("name");

  if (error) throw error;

  return {
    configured: true as const,
    students: (data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      dept: row.departments?.name ?? "Unknown",
      sem: row.semester,
      fee: row.fee_status,
      status: row.status,
    })),
  };
});
