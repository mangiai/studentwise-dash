import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { pageHead } from "@/lib/seo";
import { requireStaff } from "@/lib/auth-guards";
import {
  loadAdminPageData,
  matchesSearch,
  SELECT_CONTENT_CLASS,
  type AdminCourse,
} from "@/lib/admin/shared";
import { useStaffPermissions } from "@/hooks/use-staff-permissions";
import {
  adminUpsertCourse,
  adminDeleteCourse,
  adminEnrollStudent,
  adminUnenrollStudent,
} from "@/lib/supabase/data";

export const Route = createFileRoute("/admin/courses")({
  head: () => pageHead("Manage Courses"),
  beforeLoad: ({ context }) => {
    requireStaff(context.authUser);
  },
  loader: loadAdminPageData,
  component: AdminCourses,
});

const emptyCourseForm = {
  id: "",
  name: "",
  credits: "3",
  instructor: "none",
};

function AdminCourses() {
  const router = useRouter();
  const { canDelete } = useStaffPermissions();
  const { students, teachers, courses } = Route.useLoaderData();

  const [search, setSearch] = useState("");
  const [courseOpen, setCourseOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courseForm, setCourseForm] = useState(emptyCourseForm);
  const [manageCourseId, setManageCourseId] = useState<string | null>(null);
  const [enrollSelect, setEnrollSelect] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const filteredCourses = useMemo(
    () =>
      courses.filter(
        (c) =>
          !search ||
          matchesSearch(c.name, search) ||
          matchesSearch(c.id, search) ||
          matchesSearch(c.instructor, search),
      ),
    [courses, search],
  );

  const manageCourse = courses.find((c) => c.id === manageCourseId) ?? null;

  function openCourseDialog(course?: AdminCourse) {
    if (course) {
      setEditingCourseId(course.id);
      setCourseForm({
        id: course.id,
        name: course.name,
        credits: String(course.credits),
        instructor: course.instructorId ?? "none",
      });
    } else {
      setEditingCourseId(null);
      setCourseForm(emptyCourseForm);
    }
    setCourseOpen(true);
  }

  async function saveCourse() {
    if (!courseForm.id.trim() || !courseForm.name.trim()) {
      toast.error("Please enter course code and name");
      return;
    }

    try {
      await adminUpsertCourse({
        data: {
          id: courseForm.id.trim(),
          name: courseForm.name.trim(),
          credits: Number(courseForm.credits) || 3,
          instructorId: courseForm.instructor && courseForm.instructor !== "none" ? courseForm.instructor : null,
        },
      });
      toast.success(editingCourseId ? "Course updated" : "Course added");
      setCourseOpen(false);
      setEditingCourseId(null);
      setCourseForm(emptyCourseForm);
      await router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save course");
    }
  }

  async function enrollStudentInCourse(courseId: string, studentId: string) {
    if (!studentId) return;
    try {
      await adminEnrollStudent({ data: { courseId, studentId } });
      toast.success("Student enrolled");
      setEnrollSelect("");
      await router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Enrollment failed");
    }
  }

  async function unenrollStudent(courseId: string, studentId: string) {
    try {
      await adminUnenrollStudent({ data: { courseId, studentId } });
      toast.success("Student removed from course");
      await router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not unenroll");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await adminDeleteCourse({ data: { id: deleteTarget.id } });
      toast.success(`${deleteTarget.name} deleted`);
      setDeleteTarget(null);
      await router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <AdminLayout title="Courses" subtitle="Manage course catalog and enrollments">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 gap-4">
          <CardTitle className="text-base">Manage Courses</CardTitle>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <div className="relative">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                className="pl-9 w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button type="button" className="bg-primary hover:bg-primary/90" onClick={() => openCourseDialog()}>
              <Plus className="size-4" /> Add Course
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCourses.length === 0 && (
            <div className="text-center text-muted-foreground py-8">No courses found.</div>
          )}
          <div className="grid gap-3 md:grid-cols-2">
            {filteredCourses.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-4 border rounded-lg gap-3">
                <div className="min-w-0">
                  <div className="font-medium">
                    {c.name}{" "}
                    <span className="text-xs text-muted-foreground font-mono">({c.id})</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {c.credits} credits · {c.instructor} · {c.enrolledIds.length} enrolled
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setManageCourseId(c.id);
                      setEnrollSelect("");
                    }}
                  >
                    Manage
                  </Button>
                  <Button type="button" size="icon" variant="ghost" onClick={() => openCourseDialog(c)}>
                    <Pencil className="size-4" />
                  </Button>
                  {canDelete && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => setDeleteTarget({ id: c.id, name: c.name })}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={courseOpen}
        onOpenChange={(open) => {
          setCourseOpen(open);
          if (!open) {
            setEditingCourseId(null);
            setCourseForm(emptyCourseForm);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCourseId ? "Edit Course" : "Add Course"}</DialogTitle>
            <DialogDescription>
              {editingCourseId ? "Update course details below." : "Create a new course offering."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="c-id">Course code</Label>
              <Input
                id="c-id"
                value={courseForm.id}
                onChange={(e) => setCourseForm({ ...courseForm, id: e.target.value })}
                placeholder="e.g. CS-403"
                disabled={!!editingCourseId}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="c-name">Course name</Label>
              <Input
                id="c-name"
                value={courseForm.name}
                onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                placeholder="e.g. Artificial Intelligence"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="c-credits">Credits</Label>
                <Input
                  id="c-credits"
                  type="number"
                  min={1}
                  max={6}
                  value={courseForm.credits}
                  onChange={(e) => setCourseForm({ ...courseForm, credits: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Instructor</Label>
                <Select
                  value={courseForm.instructor || "none"}
                  onValueChange={(v) => setCourseForm({ ...courseForm, instructor: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select instructor" />
                  </SelectTrigger>
                  <SelectContent className={SELECT_CONTENT_CLASS}>
                    <SelectItem value="none">Unassigned</SelectItem>
                    {teachers.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setCourseOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={saveCourse} className="bg-primary hover:bg-primary/90">
              {editingCourseId ? "Save changes" : "Add Course"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!manageCourseId} onOpenChange={(open) => !open && setManageCourseId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{manageCourse?.name}</DialogTitle>
            <DialogDescription>
              {manageCourse?.id} · {manageCourse?.credits} credits · {manageCourse?.instructor}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Enroll an existing student</Label>
              <div className="flex gap-2">
                <Select value={enrollSelect} onValueChange={setEnrollSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent className={SELECT_CONTENT_CLASS}>
                    {students
                      .filter((s) => !manageCourse?.enrolledIds.includes(s.id))
                      .map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name} ({s.id})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  onClick={() => manageCourseId && enrollStudentInCourse(manageCourseId, enrollSelect)}
                  disabled={!enrollSelect}
                >
                  Enroll
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Enrolled students ({manageCourse?.enrolledIds.length ?? 0})</Label>
              <div className="border rounded-lg divide-y max-h-64 overflow-auto">
                {manageCourse && manageCourse.enrolledIds.length === 0 && (
                  <div className="p-3 text-sm text-muted-foreground">No students enrolled yet.</div>
                )}
                {manageCourse?.enrolledIds.map((sid) => {
                  const s = students.find((x) => x.id === sid);
                  return (
                    <div key={sid} className="flex items-center justify-between p-3">
                      <div>
                        <div className="text-sm font-medium">{s?.name ?? sid}</div>
                        <div className="text-xs text-muted-foreground font-mono">{sid}</div>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => manageCourseId && unenrollStudent(manageCourseId, sid)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setManageCourseId(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete course?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <strong>{deleteTarget?.name}</strong>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
