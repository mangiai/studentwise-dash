import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle } from "lucide-react";
import type { TeacherCourseRoster } from "@/lib/supabase/data";

export function ClassRosterTable({ course }: { course: TeacherCourseRoster }) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="font-mono text-xs text-muted-foreground">{course.id}</span>
        <Badge variant="outline">{course.enrolledCount} students</Badge>
        <Badge variant="outline">{course.avgAttendance}% avg attendance</Badge>
      </div>

      {course.students.length === 0 ? (
        <p className="text-sm text-muted-foreground">No students enrolled for this semester.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>ID</TableHead>
              <TableHead className="text-center">Semester</TableHead>
              <TableHead>Attendance</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {course.students.map((student) => (
              <TableRow key={`${course.id}-${student.id}`}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{student.id}</TableCell>
                <TableCell className="text-center">{student.semester}</TableCell>
                <TableCell className="w-48">
                  {student.totalClasses > 0 ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Progress
                          value={student.attendance}
                          className={`h-1.5 flex-1 ${student.atRisk ? "[&>div]:bg-destructive" : ""}`}
                        />
                        <span className={`text-xs w-9 ${student.atRisk ? "text-destructive font-medium" : ""}`}>
                          {student.attendance}%
                        </span>
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {student.classesAttended} / {student.totalClasses} classes
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">No sessions yet</span>
                  )}
                </TableCell>
                <TableCell>
                  {student.atRisk ? (
                    <Badge className="bg-destructive/15 text-destructive hover:bg-destructive/15 border-0">
                      <AlertTriangle className="size-3 mr-1" />
                      Short
                    </Badge>
                  ) : student.totalClasses > 0 ? (
                    <Badge className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/15 border-0">On track</Badge>
                  ) : (
                    <Badge variant="outline">Pending</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
