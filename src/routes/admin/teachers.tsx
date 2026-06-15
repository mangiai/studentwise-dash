import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  type AdminTeacher,
} from "@/lib/admin/shared";
import { useStaffPermissions } from "@/hooks/use-staff-permissions";
import { PersonAccountFields } from "@/components/admin/PersonAccountFields";
import { formatCnic, formatPakistanPhone, validatePersonAccountFields } from "@/lib/admin/person-form";
import { adminUpsertTeacher, adminDeleteTeacher, adminAssignInstructor } from "@/lib/supabase/data";

export const Route = createFileRoute("/admin/teachers")({
  head: () => pageHead("Manage Teachers"),
  beforeLoad: ({ context }) => {
    requireStaff(context.authUser);
  },
  loader: loadAdminPageData,
  component: AdminTeachers,
});

const emptyTeacherForm = {
  id: "",
  name: "",
  dept: "Computer Science",
  courses: "1",
  status: "Active",
  email: "",
  password: "",
  cnic: "",
  phone: "",
  dateOfBirth: "",
};

function AdminTeachers() {
  const router = useRouter();
  const { canDelete } = useStaffPermissions();
  const { teachers, courses, departments } = Route.useLoaderData();

  const [search, setSearch] = useState("");
  const [teacherOpen, setTeacherOpen] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [teacherForm, setTeacherForm] = useState(emptyTeacherForm);
  const [assignTeacherId, setAssignTeacherId] = useState<string | null>(null);
  const [assignCourseSelect, setAssignCourseSelect] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const filteredTeachers = useMemo(
    () =>
      teachers.filter(
        (t) =>
          !search ||
          matchesSearch(t.name, search) ||
          matchesSearch(t.id, search) ||
          matchesSearch(t.dept, search) ||
          matchesSearch(t.email, search) ||
          matchesSearch(t.phone, search) ||
          matchesSearch(t.cnic, search),
      ),
    [teachers, search],
  );

  const assignTeacher = teachers.find((t) => t.id === assignTeacherId) ?? null;

  function openTeacherDialog(teacher?: AdminTeacher) {
    if (teacher) {
      setEditingTeacherId(teacher.id);
      setTeacherForm({
        id: teacher.id,
        name: teacher.name,
        dept: teacher.dept,
        courses: String(teacher.courses),
        status: teacher.status,
        email: teacher.email,
        password: "",
        cnic: teacher.cnic ? formatCnic(teacher.cnic) : "",
        phone: teacher.phone ? formatPakistanPhone(teacher.phone) : "",
        dateOfBirth: teacher.dateOfBirth,
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

    const accountError = validatePersonAccountFields(
      {
        email: teacherForm.email,
        password: teacherForm.password,
        cnic: teacherForm.cnic,
        dateOfBirth: teacherForm.dateOfBirth,
        phone: teacherForm.phone,
      },
      { requirePassword: !editingTeacherId },
    );
    if (accountError) {
      toast.error(accountError);
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
          email: teacherForm.email.trim(),
          cnic: teacherForm.cnic,
          phone: teacherForm.phone,
          dateOfBirth: teacherForm.dateOfBirth,
          password: teacherForm.password || undefined,
          isNew: !editingTeacherId,
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
      await adminDeleteTeacher({ data: { id: deleteTarget.id } });
      toast.success(`${deleteTarget.name} deleted`);
      setDeleteTarget(null);
      await router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <AdminLayout title="Teachers" subtitle="Manage faculty records and course assignments">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 gap-4">
          <CardTitle className="text-base">Manage Teachers</CardTitle>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <div className="relative">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search teachers..."
                className="pl-9 w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                <TableHead>CNIC</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-center">Courses</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                    No teachers found.
                  </TableCell>
                </TableRow>
              )}
              {filteredTeachers.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{t.id}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {t.cnic ? formatCnic(t.cnic) : "—"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{t.email || "—"}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {t.phone ? formatPakistanPhone(t.phone) : "—"}
                  </TableCell>
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
                    {canDelete && (
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => setDeleteTarget({ id: t.id, name: t.name })}
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
        open={teacherOpen}
        onOpenChange={(open) => {
          setTeacherOpen(open);
          if (!open) {
            setEditingTeacherId(null);
            setTeacherForm(emptyTeacherForm);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
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

            <PersonAccountFields
              idPrefix="t"
              requirePassword={!editingTeacherId}
              values={{
                email: teacherForm.email,
                password: teacherForm.password,
                cnic: teacherForm.cnic,
                dateOfBirth: teacherForm.dateOfBirth,
                phone: teacherForm.phone,
              }}
              onChange={(patch) => setTeacherForm({ ...teacherForm, ...patch })}
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Department</Label>
                <Select value={teacherForm.dept} onValueChange={(v) => setTeacherForm({ ...teacherForm, dept: v })}>
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
                <SelectContent className={SELECT_CONTENT_CLASS}>
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
              <SelectContent className={SELECT_CONTENT_CLASS}>
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

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete teacher?</AlertDialogTitle>
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
