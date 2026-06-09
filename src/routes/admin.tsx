import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Search, Pencil, Trash2, Users, GraduationCap, BookOpen, Wallet } from "lucide-react";
import { pageHead } from "@/lib/seo";
import { requireAdmin } from "@/lib/auth-guards";

export const Route = createFileRoute("/admin")({ head: () => pageHead("Admin"), beforeLoad: ({ context }) => { requireAdmin(context.authUser); }, component: Admin });

type Student = { id: string; name: string; dept: string; sem: number; fee: string; status: string };

const initialStudents: Student[] = [
  { id: "2026-BSCS-0042", name: "Sarah Ahmed", dept: "Computer Science", sem: 7, fee: "Paid", status: "Active" },
  { id: "2026-BSCS-0043", name: "Hassan Raza", dept: "Computer Science", sem: 7, fee: "Pending", status: "Active" },
  { id: "2025-BSEE-0118", name: "Maryam Khan", dept: "Electrical Eng.", sem: 5, fee: "Paid", status: "Active" },
  { id: "2024-BBA-0204", name: "Usman Tariq", dept: "Business Admin.", sem: 3, fee: "Overdue", status: "Hold" },
  { id: "2026-MATH-0019", name: "Ayesha Malik", dept: "Mathematics", sem: 1, fee: "Paid", status: "Active" },
  { id: "2025-BSCS-0091", name: "Bilal Yousaf", dept: "Computer Science", sem: 3, fee: "Paid", status: "Active" },
];

type Teacher = { id: string; name: string; dept: string; courses: number; status: string };

const initialTeachers: Teacher[] = [
  { id: "FAC-2018-014", name: "Dr. Aamir Khan", dept: "CS", courses: 3, status: "Active" },
  { id: "FAC-2015-008", name: "Prof. Sana Ali", dept: "CS", courses: 2, status: "Active" },
  { id: "FAC-2020-031", name: "Dr. Hamza Saeed", dept: "CS", courses: 4, status: "Active" },
  { id: "FAC-2017-022", name: "Dr. Maria Iqbal", dept: "CS", courses: 2, status: "On Leave" },
];

type Course = { id: string; name: string; credits: number; instructor: string; enrolledIds: string[] };

const initialCourses: Course[] = [
  { id: "CS-301", name: "Database Systems", credits: 3, instructor: "Dr. Aamir Khan", enrolledIds: [] },
  { id: "CS-302", name: "Operating Systems", credits: 3, instructor: "Prof. Sana Ali", enrolledIds: [] },
  { id: "CS-401", name: "Software Engineering", credits: 3, instructor: "Dr. Hamza Saeed", enrolledIds: [] },
  { id: "CS-402", name: "Computer Networks", credits: 3, instructor: "Dr. Maria Iqbal", enrolledIds: [] },
];

const kpis = [
  { label: "Total Students", value: "5,284", icon: Users, tint: "bg-accent/10 text-accent" },
  { label: "Total Teachers", value: "184", icon: GraduationCap, tint: "bg-primary/10 text-primary" },
  { label: "Active Courses", value: "48", icon: BookOpen, tint: "bg-emerald-500/10 text-emerald-600" },
  { label: "Spring Semester", value: "2026", icon: Wallet, tint: "bg-amber-500/10 text-amber-600" },
];

function statusBadge(s: string) {
  const map: Record<string, string> = {
    Paid: "bg-emerald-500/15 text-emerald-600",
    Pending: "bg-amber-500/15 text-amber-600",
    Overdue: "bg-destructive/15 text-destructive",
    Active: "bg-emerald-500/15 text-emerald-600",
    Hold: "bg-destructive/15 text-destructive",
    "On Leave": "bg-amber-500/15 text-amber-600",
  };
  return <Badge className={`${map[s]} border-0 hover:opacity-90`}>{s}</Badge>;
}

function Admin() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: "", name: "", dept: "Computer Science", sem: "1", fee: "Pending", status: "Active", courseId: "none" });
  const [teacherOpen, setTeacherOpen] = useState(false);
  const [teacherForm, setTeacherForm] = useState({ id: "", name: "", dept: "Computer Science", courses: "1", status: "Active" });
  const [courseOpen, setCourseOpen] = useState(false);
  const [courseForm, setCourseForm] = useState({ id: "", name: "", credits: "3", instructor: "" });
  const [manageCourseId, setManageCourseId] = useState<string | null>(null);
  const [enrollSelect, setEnrollSelect] = useState("");

  const handleAdd = () => {
    if (!form.id.trim() || !form.name.trim()) {
      toast.error("Please enter student name and ID");
      return;
    }
    const newId = form.id.trim();
    setStudents((prev) => [
      { id: newId, name: form.name.trim(), dept: form.dept, sem: Number(form.sem) || 1, fee: form.fee, status: form.status },
      ...prev,
    ]);
    if (form.courseId && form.courseId !== "none") {
      setCourses((prev) => prev.map((c) => c.id === form.courseId && !c.enrolledIds.includes(newId)
        ? { ...c, enrolledIds: [...c.enrolledIds, newId] } : c));
    }
    toast.success("Student added");
    setOpen(false);
    setForm({ id: "", name: "", dept: "Computer Science", sem: "1", fee: "Pending", status: "Active", courseId: "none" });
  };

  const handleAddTeacher = () => {
    if (!teacherForm.id.trim() || !teacherForm.name.trim()) {
      toast.error("Please enter teacher name and employee ID");
      return;
    }
    setTeachers((prev) => [
      { id: teacherForm.id.trim(), name: teacherForm.name.trim(), dept: teacherForm.dept, courses: Number(teacherForm.courses) || 1, status: teacherForm.status },
      ...prev,
    ]);
    toast.success("Teacher added");
    setTeacherOpen(false);
    setTeacherForm({ id: "", name: "", dept: "Computer Science", courses: "1", status: "Active" });
  };

  const handleAddCourse = () => {
    if (!courseForm.id.trim() || !courseForm.name.trim()) {
      toast.error("Please enter course code and name");
      return;
    }
    setCourses((prev) => [
      { id: courseForm.id.trim(), name: courseForm.name.trim(), credits: Number(courseForm.credits) || 3, instructor: courseForm.instructor.trim() || "TBA", enrolledIds: [] },
      ...prev,
    ]);
    toast.success("Course added");
    setCourseOpen(false);
    setCourseForm({ id: "", name: "", credits: "3", instructor: "" });
  };

  const enrollStudentInCourse = (courseId: string, studentId: string) => {
    if (!studentId) return;
    setCourses((prev) => prev.map((c) => c.id === courseId && !c.enrolledIds.includes(studentId)
      ? { ...c, enrolledIds: [...c.enrolledIds, studentId] } : c));
    toast.success("Student enrolled");
    setEnrollSelect("");
  };

  const unenrollStudent = (courseId: string, studentId: string) => {
    setCourses((prev) => prev.map((c) => c.id === courseId
      ? { ...c, enrolledIds: c.enrolledIds.filter((id) => id !== studentId) } : c));
  };

  const manageCourse = courses.find((c) => c.id === manageCourseId) || null;

  return (
    <AppLayout title="Admin Dashboard" subtitle="Manage students, teachers, courses, and university records">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        {kpis.map((k) => (
          <Card key={k.label}><CardContent className="p-5 flex items-center gap-4">
            <div className={`size-12 rounded-lg grid place-content-center ${k.tint}`}><k.icon className="size-5" /></div>
            <div><div className="text-2xl font-semibold">{k.value}</div><div className="text-xs text-muted-foreground">{k.label}</div></div>
          </CardContent></Card>
        ))}
      </div>

      <Tabs defaultValue="students">
        <TabsList>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 gap-4">
              <CardTitle className="text-base">Manage Students</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search students..." className="pl-9 w-64" />
                </div>
                <Button className="bg-primary hover:bg-primary/90" onClick={() => setOpen(true)}><Plus className="size-4" /> Add Student</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Student</TableHead><TableHead>ID</TableHead><TableHead>Department</TableHead>
                  <TableHead className="text-center">Sem</TableHead><TableHead>Fee</TableHead><TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {students.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8"><AvatarFallback className="text-xs bg-muted">{s.name.split(" ").map(p => p[0]).join("")}</AvatarFallback></Avatar>
                          <span className="font-medium">{s.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{s.id}</TableCell>
                      <TableCell>{s.dept}</TableCell>
                      <TableCell className="text-center">{s.sem}</TableCell>
                      <TableCell>{statusBadge(s.fee)}</TableCell>
                      <TableCell>{statusBadge(s.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button size="icon" variant="ghost"><Pencil className="size-4" /></Button>
                        <Button size="icon" variant="ghost"><Trash2 className="size-4 text-destructive" /></Button>
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
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Manage Teachers</CardTitle>
              <Button className="bg-primary hover:bg-primary/90" onClick={() => setTeacherOpen(true)}><Plus className="size-4" /> Add Teacher</Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Name</TableHead><TableHead>Employee ID</TableHead><TableHead>Department</TableHead>
                  <TableHead className="text-center">Courses</TableHead><TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {teachers.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.name}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{t.id}</TableCell>
                      <TableCell>{t.dept}</TableCell>
                      <TableCell className="text-center">{t.courses}</TableCell>
                      <TableCell>{statusBadge(t.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">Assign Course</Button>
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
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Manage Courses</CardTitle>
              <Button className="bg-primary hover:bg-primary/90" onClick={() => setCourseOpen(true)}><Plus className="size-4" /> Add Course</Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {courses.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{c.name} <span className="text-xs text-muted-foreground font-mono">({c.id})</span></div>
                      <div className="text-xs text-muted-foreground mt-0.5">{c.credits} credits · {c.instructor} · {c.enrolledIds.length} enrolled</div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => { setManageCourseId(c.id); setEnrollSelect(""); }}>Manage</Button>
                      <Button size="icon" variant="ghost" onClick={() => { setCourses((prev) => prev.filter((x) => x.id !== c.id)); toast.success("Course removed"); }}><Trash2 className="size-4 text-destructive" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Student</DialogTitle>
            <DialogDescription>Enter the new student's details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="s-name">Full name</Label>
              <Input id="s-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Sarah Ahmed" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="s-id">Student ID</Label>
              <Input id="s-id" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} placeholder="e.g. 2026-BSCS-0050" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Department</Label>
                <Select value={form.dept} onValueChange={(v) => setForm({ ...form, dept: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Electrical Eng.">Electrical Eng.</SelectItem>
                    <SelectItem value="Business Admin.">Business Admin.</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="s-sem">Semester</Label>
                <Input id="s-sem" type="number" min={1} max={12} value={form.sem} onChange={(e) => setForm({ ...form, sem: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Fee</Label>
                <Select value={form.fee} onValueChange={(v) => setForm({ ...form, fee: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Hold">Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Enroll in course (optional)</Label>
              <Select value={form.courseId} onValueChange={(v) => setForm({ ...form, courseId: v })}>
                <SelectTrigger><SelectValue placeholder="Select a course" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.name} ({c.id})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">Add Student</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={teacherOpen} onOpenChange={setTeacherOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Teacher</DialogTitle>
            <DialogDescription>Enter the new teacher's details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="t-name">Full name</Label>
              <Input id="t-name" value={teacherForm.name} onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })} placeholder="e.g. Dr. Aamir Khan" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="t-id">Employee ID</Label>
              <Input id="t-id" value={teacherForm.id} onChange={(e) => setTeacherForm({ ...teacherForm, id: e.target.value })} placeholder="e.g. FAC-2026-001" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Department</Label>
                <Select value={teacherForm.dept} onValueChange={(v) => setTeacherForm({ ...teacherForm, dept: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Electrical Eng.">Electrical Eng.</SelectItem>
                    <SelectItem value="Business Admin.">Business Admin.</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="t-courses">Courses</Label>
                <Input id="t-courses" type="number" min={1} max={10} value={teacherForm.courses} onChange={(e) => setTeacherForm({ ...teacherForm, courses: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={teacherForm.status} onValueChange={(v) => setTeacherForm({ ...teacherForm, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTeacherOpen(false)}>Cancel</Button>
            <Button onClick={handleAddTeacher} className="bg-primary hover:bg-primary/90">Add Teacher</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={courseOpen} onOpenChange={setCourseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Course</DialogTitle>
            <DialogDescription>Create a new course offering.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="c-id">Course code</Label>
              <Input id="c-id" value={courseForm.id} onChange={(e) => setCourseForm({ ...courseForm, id: e.target.value })} placeholder="e.g. CS-403" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="c-name">Course name</Label>
              <Input id="c-name" value={courseForm.name} onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })} placeholder="e.g. Artificial Intelligence" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="c-credits">Credits</Label>
                <Input id="c-credits" type="number" min={1} max={6} value={courseForm.credits} onChange={(e) => setCourseForm({ ...courseForm, credits: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="c-inst">Instructor</Label>
                <Input id="c-inst" value={courseForm.instructor} onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })} placeholder="e.g. Dr. Aamir Khan" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCourseOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCourse} className="bg-primary hover:bg-primary/90">Add Course</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!manageCourseId} onOpenChange={(v) => !v && setManageCourseId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{manageCourse?.name}</DialogTitle>
            <DialogDescription>{manageCourse?.id} · {manageCourse?.credits} credits · {manageCourse?.instructor}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Enroll an existing student</Label>
              <div className="flex gap-2">
                <Select value={enrollSelect} onValueChange={setEnrollSelect}>
                  <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                  <SelectContent>
                    {students.filter((s) => !manageCourse?.enrolledIds.includes(s.id)).map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name} ({s.id})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={() => manageCourseId && enrollStudentInCourse(manageCourseId, enrollSelect)} disabled={!enrollSelect}>Enroll</Button>
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
                      <Button size="sm" variant="ghost" onClick={() => unenrollStudent(manageCourseId!, sid)}><Trash2 className="size-4 text-destructive" /></Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setManageCourseId(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
