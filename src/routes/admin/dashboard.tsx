import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { Plus, Search, Pencil, Trash2, Users, GraduationCap, BookOpen, Wallet } from "lucide-react";
import { pageHead } from "@/lib/seo";
import { requireAdmin } from "@/lib/auth-guards";
import {
  fetchAdminData,
  fetchDepartments,
  adminUpsertStudent,
  adminDeleteStudent,
  adminUpsertTeacher,
  adminDeleteTeacher,
  adminUpsertCourse,
  adminDeleteCourse,
  adminEnrollStudent,
  adminUnenrollStudent,
  adminAssignInstructor,
} from "@/lib/supabase/data";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => pageHead("Admin Dashboard"),
  beforeLoad: ({ context }) => {
    requireAdmin(context.authUser);
  },
  loader: async () => {
    const [adminData, deptData] = await Promise.all([fetchAdminData(), fetchDepartments()]);
    return {
      ...adminData,
      departments: deptData.departments.map((d) => d.name),
    };
  },
  component: Admin,
});

type Student = {
  id: string;
  name: string;
  dept: string;
  sem: number;
  fee: string;
  status: string;
  enrolledCourseIds: string[];
};
type Teacher = { id: string; name: string; dept: string; courses: number; status: string };
type Course = { id: string; name: string; credits: number; instructor: string; instructorId?: string | null; enrolledIds: string[] };
type DeleteTarget = { kind: "student" | "teacher" | "course"; id: string; name: string };

const selectContentClass = "z-[200]";

const emptyStudentForm = {
  id: "",
  name: "",
  dept: "Computer Science",
  sem: "1",
  fee: "Pending",
  status: "Active",
  courseId: "none",
};

const emptyTeacherForm = {
  id: "",
  name: "",
  dept: "Computer Science",
  courses: "1",
  status: "Active",
};

const emptyCourseForm = {
  id: "",
  name: "",
  credits: "3",
  instructor: "none",
};

function statusBadge(s: string) {
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

function matchesSearch(value: string, query: string) {
  return value.toLowerCase().includes(query.trim().toLowerCase());
}

function Admin() {
  const router = useRouter();
  const loaderData = Route.useLoaderData();
  const students = loaderData.students as Student[];
  const teachers = loaderData.teachers as Teacher[];
  const courses = loaderData.courses as Course[];
  const departments = loaderData.departments.length > 0
    ? loaderData.departments
    : ["Computer Science", "Electrical Engineering", "Business Administration", "Mathematics"];

  const [studentSearch, setStudentSearch] = useState("");
  const [teacherSearch, setTeacherSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");

  const [studentOpen, setStudentOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [studentForm, setStudentForm] = useState(emptyStudentForm);

  const [teacherOpen, setTeacherOpen] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [teacherForm, setTeacherForm] = useState(emptyTeacherForm);

  const [courseOpen, setCourseOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courseForm, setCourseForm] = useState(emptyCourseForm);

  const [manageCourseId, setManageCourseId] = useState<string | null>(null);
  const [enrollSelect, setEnrollSelect] = useState("");

  const [manageStudentId, setManageStudentId] = useState<string | null>(null);
  const [studentCourseSelect, setStudentCourseSelect] = useState("");

  const [assignTeacherId, setAssignTeacherId] = useState<string | null>(null);
  const [assignCourseSelect, setAssignCourseSelect] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const filteredStudents = useMemo(
    () =>
      students.filter(
        (s) =>
          !studentSearch ||
          matchesSearch(s.name, studentSearch) ||
          matchesSearch(s.id, studentSearch) ||
          matchesSearch(s.dept, studentSearch),
      ),
    [students, studentSearch],
  );

  const filteredTeachers = useMemo(
    () =>
      teachers.filter(
        (t) =>
          !teacherSearch ||
          matchesSearch(t.name, teacherSearch) ||
          matchesSearch(t.id, teacherSearch) ||
          matchesSearch(t.dept, teacherSearch),
      ),
    [teachers, teacherSearch],
  );

  const filteredCourses = useMemo(
    () =>
      courses.filter(
        (c) =>
          !courseSearch ||
          matchesSearch(c.name, courseSearch) ||
          matchesSearch(c.id, courseSearch) ||
          matchesSearch(c.instructor, courseSearch),
      ),
    [courses, courseSearch],
  );

  const manageCourse = courses.find((c) => c.id === manageCourseId) ?? null;
  const manageStudent = students.find((s) => s.id === manageStudentId) ?? null;
  const assignTeacher = teachers.find((t) => t.id === assignTeacherId) ?? null;

  const kpis = [
    { label: "Total Students", value: students.length.toLocaleString(), icon: Users, tint: "bg-accent/10 text-accent" },
    { label: "Total Teachers", value: teachers.length.toLocaleString(), icon: GraduationCap, tint: "bg-primary/10 text-primary" },
    { label: "Active Courses", value: courses.length.toLocaleString(), icon: BookOpen, tint: "bg-emerald-500/10 text-emerald-600" },
    {
      label: "Enrollments",
      value: courses.reduce((sum, c) => sum + c.enrolledIds.length, 0).toLocaleString(),
      icon: Wallet,
      tint: "bg-amber-500/10 text-amber-600",
    },
  ];

  function openStudentDialog(student?: Student) {
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

  function openTeacherDialog(teacher?: Teacher) {
    if (teacher) {
      setEditingTeacherId(teacher.id);
      setTeacherForm({
        id: teacher.id,
        name: teacher.name,
        dept: teacher.dept,
        courses: String(teacher.courses),
        status: teacher.status,
      });
    } else {
      setEditingTeacherId(null);
      setTeacherForm(emptyTeacherForm);
    }
    setTeacherOpen(true);
  }

  async function saveTeacher() {
    if (!teacherForm.id.trim() || !teacherForm.name.trim()) {
      toast.error("Please enter teacher name and employee ID");
      return;
    }

    try {
      await adminUpsertTeacher({
        data: {
          id: teacherForm.id.trim(),
          name: teacherForm.name.trim(),
          dept: teacherForm.dept,
          courses: Number(teacherForm.courses) || 1,
          status: teacherForm.status as "Active" | "Hold" | "On Leave",
        },
      });
      toast.success(editingTeacherId ? "Teacher updated" : "Teacher added");
      setTeacherOpen(false);
      setEditingTeacherId(null);
      setTeacherForm(emptyTeacherForm);
      await router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save teacher");
    }
  }

  function openCourseDialog(course?: Course) {
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

  async function assignCourseToStudent() {
    if (!manageStudentId || !studentCourseSelect) {
      toast.error("Select a course to assign");
      return;
    }
    await enrollStudentInCourse(studentCourseSelect, manageStudentId);
    setStudentCourseSelect("");
  }

  async function assignCourseToTeacher() {
    if (!assignTeacherId || !assignCourseSelect) {
      toast.error("Select a course to assign");
      return;
    }

    try {
      await adminAssignInstructor({
        data: { courseId: assignCourseSelect, teacherId: assignTeacherId },
      });
      const course = courses.find((c) => c.id === assignCourseSelect);
      const teacher = teachers.find((t) => t.id === assignTeacherId);
      toast.success(`${course?.name ?? "Course"} assigned to ${teacher?.name ?? "teacher"}`);
      setAssignTeacherId(null);
      setAssignCourseSelect("");
      await router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Assignment failed");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.kind === "student") {
        await adminDeleteStudent({ data: { id: deleteTarget.id } });
      } else if (deleteTarget.kind === "teacher") {
        await adminDeleteTeacher({ data: { id: deleteTarget.id } });
      } else {
        await adminDeleteCourse({ data: { id: deleteTarget.id } });
      }
      toast.success(`${deleteTarget.name} deleted`);
      setDeleteTarget(null);
      await router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <AdminLayout title="Admin Dashboard" subtitle="Manage students, teachers, courses, and university records">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`size-12 rounded-lg grid place-content-center ${k.tint}`}>
                <k.icon className="size-5" />
              </div>
              <div>
                <div className="text-2xl font-semibold">{k.value}</div>
                <div className="text-xs text-muted-foreground">{k.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="students">
        <TabsList>
          <TabsTrigger value="students">Students ({students.length})</TabsTrigger>
          <TabsTrigger value="teachers">Teachers ({teachers.length})</TabsTrigger>
          <TabsTrigger value="courses">Courses ({courses.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 gap-4">
              <CardTitle className="text-base">Manage Students</CardTitle>
              <div className="flex items-center gap-2 flex-wrap justify-end">
                <div className="relative">
                  <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    className="pl-9 w-64"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
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
                        <Button type="button" size="icon" variant="ghost" onClick={() => openStudentDialog(s)}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => setDeleteTarget({ kind: "student", id: s.id, name: s.name })}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teachers" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 gap-4">
              <CardTitle className="text-base">Manage Teachers</CardTitle>
              <div className="flex items-center gap-2 flex-wrap justify-end">
                <div className="relative">
                  <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search teachers..."
                    className="pl-9 w-64"
                    value={teacherSearch}
                    onChange={(e) => setTeacherSearch(e.target.value)}
                  />
                </div>
                <Button type="button" className="bg-primary hover:bg-primary/90" onClick={() => openTeacherDialog()}>
                  <Plus className="size-4" /> Add Teacher
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-center">Courses</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeachers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No teachers found.
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredTeachers.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.name}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{t.id}</TableCell>
                      <TableCell>{t.dept}</TableCell>
                      <TableCell className="text-center">{t.courses}</TableCell>
                      <TableCell>{statusBadge(t.status)}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setAssignTeacherId(t.id);
                            setAssignCourseSelect("");
                          }}
                        >
                          Assign Course
                        </Button>
                        <Button type="button" size="icon" variant="ghost" onClick={() => openTeacherDialog(t)}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => setDeleteTarget({ kind: "teacher", id: t.id, name: t.name })}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 gap-4">
              <CardTitle className="text-base">Manage Courses</CardTitle>
              <div className="flex items-center gap-2 flex-wrap justify-end">
                <div className="relative">
                  <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search courses..."
                    className="pl-9 w-64"
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
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
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => setDeleteTarget({ kind: "course", id: c.id, name: c.name })}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Student add/edit */}
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
                  <SelectContent className={selectContentClass}>
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
                  <SelectContent className={selectContentClass}>
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
                  <SelectContent className={selectContentClass}>
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
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="none">None</SelectItem>
                    {courses.map((c) => (
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

      {/* Teacher add/edit */}
      <Dialog
        open={teacherOpen}
        onOpenChange={(open) => {
          setTeacherOpen(open);
          if (!open) {
            setEditingTeacherId(null);
            setTeacherForm(emptyTeacherForm);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTeacherId ? "Edit Teacher" : "Add Teacher"}</DialogTitle>
            <DialogDescription>
              {editingTeacherId ? "Update teacher details below." : "Enter the new teacher's details below."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="t-name">Full name</Label>
              <Input
                id="t-name"
                value={teacherForm.name}
                onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                placeholder="e.g. Dr. Aamir Khan"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="t-id">Employee ID</Label>
              <Input
                id="t-id"
                value={teacherForm.id}
                onChange={(e) => setTeacherForm({ ...teacherForm, id: e.target.value })}
                placeholder="e.g. FAC-2026-001"
                disabled={!!editingTeacherId}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Department</Label>
                <Select value={teacherForm.dept} onValueChange={(v) => setTeacherForm({ ...teacherForm, dept: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    {departments.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="t-courses">Courses</Label>
                <Input
                  id="t-courses"
                  type="number"
                  min={0}
                  max={10}
                  value={teacherForm.courses}
                  onChange={(e) => setTeacherForm({ ...teacherForm, courses: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={teacherForm.status} onValueChange={(v) => setTeacherForm({ ...teacherForm, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={selectContentClass}>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setTeacherOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={saveTeacher} className="bg-primary hover:bg-primary/90">
              {editingTeacherId ? "Save changes" : "Add Teacher"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Course add/edit */}
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
                  <SelectContent className={selectContentClass}>
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

      {/* Manage student course assignments */}
      <Dialog open={!!manageStudentId} onOpenChange={(open) => !open && setManageStudentId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign courses — {manageStudent?.name}</DialogTitle>
            <DialogDescription>
              {manageStudent?.id} · {manageStudent?.dept} · Spring 2026 semester
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
                  <SelectContent className={selectContentClass}>
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

      {/* Manage course enrollments */}
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
                  <SelectContent className={selectContentClass}>
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

      {/* Assign course to teacher */}
      <Dialog
        open={!!assignTeacherId}
        onOpenChange={(open) => {
          if (!open) {
            setAssignTeacherId(null);
            setAssignCourseSelect("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign course</DialogTitle>
            <DialogDescription>
              Assign a course to {assignTeacher?.name ?? "this teacher"} as instructor.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-2">
            <Label>Course</Label>
            <Select value={assignCourseSelect} onValueChange={setAssignCourseSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent className={selectContentClass}>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} ({c.id}) — {c.instructor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAssignTeacherId(null)}>
              Cancel
            </Button>
            <Button type="button" onClick={assignCourseToTeacher} className="bg-primary hover:bg-primary/90">
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.kind}?</AlertDialogTitle>
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
