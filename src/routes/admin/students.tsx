import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  statusBadge,
  matchesSearch,
  SELECT_CONTENT_CLASS,
  type AdminStudent,
  type AdminCourse,
} from "@/lib/admin/shared";
import { CURRENT_SEMESTER } from "@/lib/constants";
import { useStaffPermissions } from "@/hooks/use-staff-permissions";
import {
  adminUpsertStudent,
  adminDeleteStudent,
  adminEnrollStudent,
  adminUnenrollStudent,
  adminUpsertGrade,
} from "@/lib/supabase/data";

export const Route = createFileRoute("/admin/students")({
  head: () => pageHead("Manage Students"),
  beforeLoad: ({ context }) => {
    requireStaff(context.authUser);
  },
  loader: loadAdminPageData,
  component: AdminStudents,
});

const emptyStudentForm = {
  id: "",
  name: "",
  dept: "Computer Science",
  sem: "1",
  fee: "Pending",
  status: "Active",
  courseId: "none",
};

function AdminStudents() {
  const router = useRouter();
  const { canDelete } = useStaffPermissions();
  const { students, courses, departments } = Route.useLoaderData();

  const [search, setSearch] = useState("");
  const [studentOpen, setStudentOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [studentForm, setStudentForm] = useState(emptyStudentForm);
  const [manageStudentId, setManageStudentId] = useState<string | null>(null);
  const [studentCourseSelect, setStudentCourseSelect] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [gradeStudentId, setGradeStudentId] = useState<string | null>(null);
  const [gradeForm, setGradeForm] = useState({
    courseId: "",
    semester: CURRENT_SEMESTER,
    grade: "A",
    gradePoints: "12",
  });

  const filteredStudents = useMemo(
    () =>
      students.filter(
        (s) =>
          !search ||
          matchesSearch(s.name, search) ||
          matchesSearch(s.id, search) ||
          matchesSearch(s.dept, search),
      ),
    [students, search],
  );

  const manageStudent = students.find((s) => s.id === manageStudentId) ?? null;
  const gradeStudent = students.find((s) => s.id === gradeStudentId) ?? null;

  function openStudentDialog(student?: AdminStudent) {
    if (student) {
      setEditingStudentId(student.id);
      setStudentForm({
        id: student.id,
        name: student.name,
        dept: student.dept,
        sem: String(student.sem),
        fee: student.fee,
        status: student.status,
        courseId: "none",
      });
    } else {
      setEditingStudentId(null);
      setStudentForm(emptyStudentForm);
    }
    setStudentOpen(true);
  }

  async function saveStudent() {
    if (!studentForm.id.trim() || !studentForm.name.trim()) {
      toast.error("Please enter student name and ID");
      return;
    }

    try {
      await adminUpsertStudent({
        data: {
          id: studentForm.id.trim(),
          name: studentForm.name.trim(),
          dept: studentForm.dept,
          sem: Number(studentForm.sem) || 1,
          fee: studentForm.fee as "Paid" | "Pending" | "Overdue",
          status: studentForm.status as "Active" | "Hold" | "On Leave",
        },
      });

      if (!editingStudentId && studentForm.courseId && studentForm.courseId !== "none") {
        await adminEnrollStudent({
          data: { courseId: studentForm.courseId, studentId: studentForm.id.trim() },
        });
      }

      toast.success(editingStudentId ? "Student updated" : "Student added");
      setStudentOpen(false);
      setEditingStudentId(null);
      setStudentForm(emptyStudentForm);
      await router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save student");
    }
  }

  async function enrollStudentInCourse(courseId: string, studentId: string) {
    if (!studentId) return;
    try {
      await adminEnrollStudent({ data: { courseId, studentId } });
      toast.success("Student enrolled");
      setStudentCourseSelect("");
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

  async function assignCourseToStudent() {
    if (!manageStudentId || !studentCourseSelect) {
      toast.error("Select a course to assign");
      return;
    }
    await enrollStudentInCourse(studentCourseSelect, manageStudentId);
    setStudentCourseSelect("");
  }

  async function saveGrade() {
    if (!gradeStudentId || !gradeForm.courseId) {
      toast.error("Select a course and grade");
      return;
    }
    try {
      await adminUpsertGrade({
        data: {
          studentId: gradeStudentId,
          courseId: gradeForm.courseId,
          semester: gradeForm.semester,
          grade: gradeForm.grade,
          gradePoints: Number(gradeForm.gradePoints) || 0,
        },
      });
      toast.success("Grade posted");
      setGradeStudentId(null);
      await router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not post grade");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await adminDeleteStudent({ data: { id: deleteTarget.id } });
      toast.success(`${deleteTarget.name} deleted`);
      setDeleteTarget(null);
      await router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <AdminLayout title="Students" subtitle="Manage student records and course assignments">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 gap-4">
          <CardTitle className="text-base">Manage Students</CardTitle>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <div className="relative">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                className="pl-9 w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button type="button" className="bg-primary hover:bg-primary/90" onClick={() => openStudentDialog()}>
              <Plus className="size-4" /> Add Student
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-center">Sem</TableHead>
                <TableHead className="text-center">Courses</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    No students found.
                  </TableCell>
                </TableRow>
              )}
              {filteredStudents.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className="text-xs bg-muted">
                          {s.name.split(" ").map((p) => p[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{s.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{s.id}</TableCell>
                  <TableCell>{s.dept}</TableCell>
                  <TableCell className="text-center">{s.sem}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="font-mono text-xs">
                      {s.enrolledCourseIds.length}
                    </Badge>
                  </TableCell>
                  <TableCell>{statusBadge(s.fee)}</TableCell>
                  <TableCell>{statusBadge(s.status)}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setManageStudentId(s.id);
                        setStudentCourseSelect("");
                      }}
                    >
                      Assign Courses
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setGradeStudentId(s.id);
                        setGradeForm({
                          courseId: s.enrolledCourseIds[0] ?? "",
                          semester: CURRENT_SEMESTER,
                          grade: "A",
                          gradePoints: "12",
                        });
                      }}
                    >
                      Post Grade
                    </Button>
                    <Button type="button" size="icon" variant="ghost" onClick={() => openStudentDialog(s)}>
                      <Pencil className="size-4" />
                    </Button>
                    {canDelete && (
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => setDeleteTarget({ id: s.id, name: s.name })}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={studentOpen}
        onOpenChange={(open) => {
          setStudentOpen(open);
          if (!open) {
            setEditingStudentId(null);
            setStudentForm(emptyStudentForm);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingStudentId ? "Edit Student" : "Add Student"}</DialogTitle>
            <DialogDescription>
              {editingStudentId ? "Update student details below." : "Enter the new student's details below."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="s-name">Full name</Label>
              <Input
                id="s-name"
                value={studentForm.name}
                onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                placeholder="e.g. Sarah Ahmed"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="s-id">Student ID</Label>
              <Input
                id="s-id"
                value={studentForm.id}
                onChange={(e) => setStudentForm({ ...studentForm, id: e.target.value })}
                placeholder="e.g. 2026-BSCS-0050"
                disabled={!!editingStudentId}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Department</Label>
                <Select value={studentForm.dept} onValueChange={(v) => setStudentForm({ ...studentForm, dept: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={SELECT_CONTENT_CLASS}>
                    {departments.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="s-sem">Semester</Label>
                <Input
                  id="s-sem"
                  type="number"
                  min={1}
                  max={12}
                  value={studentForm.sem}
                  onChange={(e) => setStudentForm({ ...studentForm, sem: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Fee</Label>
                <Select value={studentForm.fee} onValueChange={(v) => setStudentForm({ ...studentForm, fee: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={SELECT_CONTENT_CLASS}>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={studentForm.status} onValueChange={(v) => setStudentForm({ ...studentForm, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={SELECT_CONTENT_CLASS}>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Hold">Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {!editingStudentId && (
              <div className="grid gap-2">
                <Label>Enroll in course (optional)</Label>
                <Select
                  value={studentForm.courseId}
                  onValueChange={(v) => setStudentForm({ ...studentForm, courseId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent className={SELECT_CONTENT_CLASS}>
                    <SelectItem value="none">None</SelectItem>
                    {courses.map((c: AdminCourse) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} ({c.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setStudentOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={saveStudent} className="bg-primary hover:bg-primary/90">
              {editingStudentId ? "Save changes" : "Add Student"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!manageStudentId} onOpenChange={(open) => !open && setManageStudentId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign courses — {manageStudent?.name}</DialogTitle>
            <DialogDescription>
              {manageStudent?.id} · {manageStudent?.dept} · {CURRENT_SEMESTER} semester
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Add a course</Label>
              <div className="flex gap-2">
                <Select value={studentCourseSelect} onValueChange={setStudentCourseSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent className={SELECT_CONTENT_CLASS}>
                    {courses
                      .filter((c) => !manageStudent?.enrolledCourseIds.includes(c.id))
                      .map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name} ({c.id}) · {c.credits} cr
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button type="button" onClick={assignCourseToStudent} disabled={!studentCourseSelect}>
                  Assign
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Enrolled courses ({manageStudent?.enrolledCourseIds.length ?? 0})</Label>
              <div className="border rounded-lg divide-y max-h-64 overflow-auto">
                {manageStudent && manageStudent.enrolledCourseIds.length === 0 && (
                  <div className="p-3 text-sm text-muted-foreground">
                    No courses assigned yet. Assign a course above — the student will see it on their dashboard.
                  </div>
                )}
                {manageStudent?.enrolledCourseIds.map((cid) => {
                  const c = courses.find((x) => x.id === cid);
                  return (
                    <div key={cid} className="flex items-center justify-between p-3">
                      <div>
                        <div className="text-sm font-medium">{c?.name ?? cid}</div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {cid} · {c?.credits ?? "?"} credits · {c?.instructor ?? "TBA"}
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => manageStudentId && unenrollStudent(cid, manageStudentId)}
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
            <Button type="button" variant="outline" onClick={() => setManageStudentId(null)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!gradeStudentId} onOpenChange={(open) => !open && setGradeStudentId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Post grade — {gradeStudent?.name}</DialogTitle>
            <DialogDescription>Student will be notified and see the grade on Results.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Course</Label>
              <Select value={gradeForm.courseId} onValueChange={(v) => setGradeForm({ ...gradeForm, courseId: v })}>
                <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                <SelectContent className={SELECT_CONTENT_CLASS}>
                  {courses
                    .filter((c) => gradeStudent?.enrolledCourseIds.includes(c.id))
                    .map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name} ({c.id})</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Semester</Label>
                <Input value={gradeForm.semester} onChange={(e) => setGradeForm({ ...gradeForm, semester: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Grade</Label>
                <Select value={gradeForm.grade} onValueChange={(v) => setGradeForm({ ...gradeForm, grade: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className={SELECT_CONTENT_CLASS}>
                    {["A", "A-", "B+", "B", "B-", "C+"].map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Grade points</Label>
              <Input
                type="number"
                min={0}
                max={16}
                step={0.1}
                value={gradeForm.gradePoints}
                onChange={(e) => setGradeForm({ ...gradeForm, gradePoints: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setGradeStudentId(null)}>Cancel</Button>
            <Button type="button" onClick={saveGrade}>Post grade</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete student?</AlertDialogTitle>
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
