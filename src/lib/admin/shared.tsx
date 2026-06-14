import { Badge } from "@/components/ui/badge";

export const SELECT_CONTENT_CLASS = "z-[200]";

export const DEFAULT_DEPARTMENTS = [
  "Computer Science",
  "Electrical Engineering",
  "Business Administration",
  "Mathematics",
];

export type AdminStudent = {
  id: string;
  name: string;
  dept: string;
  sem: number;
  fee: string;
  status: string;
  enrolledCourseIds: string[];
};

export type AdminTeacher = {
  id: string;
  name: string;
  dept: string;
  courses: number;
  status: string;
};

export type AdminCourse = {
  id: string;
  name: string;
  credits: number;
  instructor: string;
  instructorId?: string | null;
  enrolledIds: string[];
};

export type AdminEnrollment = {
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  semester: string;
};

export type DeleteTarget = {
  kind: "student" | "teacher" | "course";
  id: string;
  name: string;
};

export function statusBadge(s: string) {
  const map: Record<string, string> = {
    Paid: "bg-emerald-500/15 text-emerald-600",
    Pending: "bg-amber-500/15 text-amber-600",
    Overdue: "bg-destructive/15 text-destructive",
    Active: "bg-emerald-500/15 text-emerald-600",
    Hold: "bg-destructive/15 text-destructive",
    "On Leave": "bg-amber-500/15 text-amber-600",
  };
  return <Badge className={`${map[s] ?? "bg-muted text-muted-foreground"} border-0 hover:opacity-90`}>{s}</Badge>;
}

export function matchesSearch(value: string, query: string) {
  return value.toLowerCase().includes(query.trim().toLowerCase());
}

export async function loadAdminPageData() {
  const { fetchAdminData, fetchDepartments } = await import("@/lib/supabase/data");
  const [adminData, deptData] = await Promise.all([fetchAdminData(), fetchDepartments()]);
  return {
    ...adminData,
    departments:
      deptData.departments.length > 0
        ? deptData.departments.map((d) => d.name)
        : DEFAULT_DEPARTMENTS,
  };
}
