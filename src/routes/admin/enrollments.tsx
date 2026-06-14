import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Search, Trash2 } from "lucide-react";
import { pageHead } from "@/lib/seo";
import { requireStaff } from "@/lib/auth-guards";
import { loadAdminPageData, matchesSearch, SELECT_CONTENT_CLASS } from "@/lib/admin/shared";
import { CURRENT_SEMESTER } from "@/lib/constants";
import { adminEnrollStudent, adminUnenrollStudent, fetchAdminEnrollments } from "@/lib/supabase/data";

export const Route = createFileRoute("/admin/enrollments")({
  head: () => pageHead("Enrollments"),
  beforeLoad: ({ context }) => {
    requireStaff(context.authUser);
  },
  loader: async () => {
    const [pageData, enrollData] = await Promise.all([loadAdminPageData(), fetchAdminEnrollments()]);
    return {
      ...pageData,
      enrollments: enrollData.enrollments,
    };
  },
  component: AdminEnrollments,
});

function AdminEnrollments() {
  const router = useRouter();
  const { students, courses, enrollments } = Route.useLoaderData();

  const [search, setSearch] = useState("");
  const [enrollStudentId, setEnrollStudentId] = useState("");
  const [enrollCourseId, setEnrollCourseId] = useState("");
  const [enrolling, setEnrolling] = useState(false);

  const filteredEnrollments = useMemo(
    () =>
      enrollments.filter(
        (e) =>
          !search ||
          matchesSearch(e.studentName, search) ||
          matchesSearch(e.studentId, search) ||
          matchesSearch(e.courseName, search) ||
          matchesSearch(e.courseId, search) ||
          matchesSearch(e.semester, search),
      ),
    [enrollments, search],
  );

  async function handleQuickEnroll() {
    if (!enrollStudentId || !enrollCourseId) {
      toast.error("Select a student and course");
      return;
    }

    setEnrolling(true);
    try {
      await adminEnrollStudent({ data: { courseId: enrollCourseId, studentId: enrollStudentId } });
      toast.success("Student enrolled");
      setEnrollStudentId("");
      setEnrollCourseId("");
      await router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  }

  async function handleUnenroll(courseId: string, studentId: string) {
    try {
      await adminUnenrollStudent({ data: { courseId, studentId } });
      toast.success("Student unenrolled");
      await router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not unenroll");
    }
  }

  return (
    <AdminLayout title="Enrollments" subtitle={`All course enrollments for ${CURRENT_SEMESTER}`}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Quick enroll</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-3">
            <div className="grid gap-2 min-w-[200px] flex-1">
              <Label>Student</Label>
              <Select value={enrollStudentId} onValueChange={setEnrollStudentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent className={SELECT_CONTENT_CLASS}>
                  {students.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} ({s.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2 min-w-[200px] flex-1">
              <Label>Course</Label>
              <Select value={enrollCourseId} onValueChange={setEnrollCourseId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent className={SELECT_CONTENT_CLASS}>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} ({c.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              className="bg-primary hover:bg-primary/90"
              onClick={handleQuickEnroll}
              disabled={enrolling || !enrollStudentId || !enrollCourseId}
            >
              <Plus className="size-4" /> Enroll
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 gap-4">
          <CardTitle className="text-base">All enrollments ({enrollments.length})</CardTitle>
          <div className="relative">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search enrollments..."
              className="pl-9 w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Course ID</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEnrollments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No enrollments found.
                  </TableCell>
                </TableRow>
              )}
              {filteredEnrollments.map((e) => (
                <TableRow key={`${e.studentId}-${e.courseId}`}>
                  <TableCell className="font-medium">{e.studentName}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{e.studentId}</TableCell>
                  <TableCell>{e.courseName}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{e.courseId}</TableCell>
                  <TableCell>{e.semester}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleUnenroll(e.courseId, e.studentId)}
                    >
                      <Trash2 className="size-4 text-destructive" /> Unenroll
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
