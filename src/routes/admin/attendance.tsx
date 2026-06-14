import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { Search, Loader2 } from "lucide-react";
import { pageHead } from "@/lib/seo";
import { requireStaff } from "@/lib/auth-guards";
import { matchesSearch, SELECT_CONTENT_CLASS } from "@/lib/admin/shared";
import { ATTENDANCE_TERM, ATTENDANCE_TERM_END, ATTENDANCE_TERM_START } from "@/lib/constants";
import { adminUpdateSessionAttendance, fetchAdminAttendance } from "@/lib/supabase/data";

export const Route = createFileRoute("/admin/attendance")({
  head: () => pageHead("Attendance"),
  beforeLoad: ({ context }) => {
    requireStaff(context.authUser);
  },
  loader: () => fetchAdminAttendance({ data: {} }),
  component: AdminAttendance,
});

type AdminSession = {
  markId: string;
  enrollmentId: string;
  present: boolean;
  sessionId: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  courseCode: string;
  courseName: string;
};

function AdminAttendance() {
  const router = useRouter();
  const { students, courses, term } = Route.useLoaderData();

  const [search, setSearch] = useState("");
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("all");
  const [sessions, setSessions] = useState<AdminSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredStudents = useMemo(
    () =>
      students.filter(
        (s) =>
          !search ||
          matchesSearch(s.name, search) ||
          matchesSearch(s.id, search),
      ),
    [students, search],
  );

  useEffect(() => {
    if (!studentId) {
      setSessions([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    void fetchAdminAttendance({
      data: { studentId, courseId: courseId === "all" ? undefined : courseId },
    })
      .then((result) => {
        if (!cancelled) setSessions(result.sessions as AdminSession[]);
      })
      .catch((err) => {
        if (!cancelled) toast.error(err instanceof Error ? err.message : "Could not load attendance");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [studentId, courseId]);

  const stats = useMemo(() => {
    const total = sessions.length;
    const attended = sessions.filter((s) => s.present).length;
    const pct = total > 0 ? Math.round((attended / total) * 100) : 0;
    return { total, attended, pct };
  }, [sessions]);

  async function handleToggle(markId: string, present: boolean) {
    setUpdatingId(markId);
    try {
      await adminUpdateSessionAttendance({ data: { markId, present } });
      setSessions((prev) => prev.map((s) => (s.markId === markId ? { ...s, present } : s)));
      toast.success(present ? "Marked present" : "Marked absent");
      await router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update attendance");
    } finally {
      setUpdatingId(null);
    }
  }

  const termLabel = `${term ?? ATTENDANCE_TERM} · ${format(parseISO(ATTENDANCE_TERM_START), "MMM d")} – ${format(parseISO(ATTENDANCE_TERM_END), "MMM d, yyyy")}`;

  return (
    <AdminLayout title="Attendance" subtitle={`Manage per-session attendance · ${termLabel}`}>
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <Card><CardContent className="p-5">
          <div className="text-xs text-muted-foreground">Sessions</div>
          <div className="text-2xl font-semibold mt-1">{stats.total}</div>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <div className="text-xs text-muted-foreground">Present</div>
          <div className="text-2xl font-semibold mt-1">{stats.attended}</div>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <div className="text-xs text-muted-foreground">Attendance %</div>
          <div className="text-2xl font-semibold mt-1">{stats.pct}%</div>
        </CardContent></Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Select student</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={studentId || "none"} onValueChange={(v) => setStudentId(v === "none" ? "" : v)}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Choose student" />
            </SelectTrigger>
            <SelectContent className={SELECT_CONTENT_CLASS}>
              <SelectItem value="none">Choose student</SelectItem>
              {filteredStudents.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name} ({s.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={courseId} onValueChange={setCourseId} disabled={!studentId}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="All courses" />
            </SelectTrigger>
            <SelectContent className={SELECT_CONTENT_CLASS}>
              <SelectItem value="all">All courses</SelectItem>
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Session marks</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!studentId && (
            <p className="p-6 text-sm text-muted-foreground">Select a student to view and edit attendance.</p>
          )}
          {studentId && loading && (
            <div className="p-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Loading sessions…
            </div>
          )}
          {studentId && !loading && sessions.length === 0 && (
            <p className="p-6 text-sm text-muted-foreground">No class sessions found for this student.</p>
          )}
          {studentId && !loading && sessions.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Present</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((s) => (
                  <TableRow key={s.markId}>
                    <TableCell>{format(parseISO(s.date), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <div className="font-medium">{s.courseName}</div>
                      <div className="text-xs text-muted-foreground font-mono">{s.courseCode}</div>
                    </TableCell>
                    <TableCell>{s.startTime} – {s.endTime}</TableCell>
                    <TableCell>{s.room}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={s.present ? "text-chart-3 border-chart-3/40" : "text-destructive border-destructive/40"}>
                        {s.present ? "Present" : "Absent"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Label htmlFor={`present-${s.markId}`} className="sr-only">
                          Present for {s.courseName} on {s.date}
                        </Label>
                        <Switch
                          id={`present-${s.markId}`}
                          checked={s.present}
                          disabled={updatingId === s.markId}
                          onCheckedChange={(checked) => void handleToggle(s.markId, checked)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
