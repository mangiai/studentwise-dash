import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle } from "lucide-react";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/attendance")({ head: () => pageHead("Attendance"), component: Attendance });

const rows = [
  { course: "Database Systems", code: "CS-304", att: 82, classes: 28, attended: 23 },
  { course: "Operating Systems", code: "CS-307", att: 68, classes: 25, attended: 17 },
  { course: "Software Engineering", code: "CS-401", att: 91, classes: 22, attended: 20 },
  { course: "Computer Networks", code: "CS-403", att: 74, classes: 26, attended: 19 },
  { course: "Artificial Intelligence", code: "CS-411", att: 88, classes: 24, attended: 21 },
  { course: "Discrete Mathematics", code: "MATH-204", att: 65, classes: 24, attended: 16 },
];

function Ring({ value }: { value: number }) {
  const stroke = value < 75 ? "var(--color-destructive)" : value < 85 ? "var(--color-chart-4)" : "var(--color-chart-3)";
  const c = 2 * Math.PI * 28;
  const dash = (value / 100) * c;
  return (
    <div className="relative size-20">
      <svg viewBox="0 0 64 64" className="size-20 -rotate-90">
        <circle cx="32" cy="32" r="28" stroke="var(--color-border)" strokeWidth="6" fill="none" />
        <circle cx="32" cy="32" r="28" stroke={stroke} strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray={`${dash} ${c}`} />
      </svg>
      <div className="absolute inset-0 grid place-content-center text-sm font-semibold">{value}%</div>
    </div>
  );
}

function Attendance() {
  const overall = Math.round(rows.reduce((a, r) => a + r.att, 0) / rows.length);
  return (
    <AppLayout title="Attendance Management" subtitle="Track your attendance across all enrolled courses">
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        <Card><CardContent className="p-5">
          <div className="text-xs text-muted-foreground">Overall Attendance</div>
          <div className="text-2xl font-semibold mt-1">{overall}%</div>
          <Progress value={overall} className="mt-3 h-1.5" />
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <div className="text-xs text-muted-foreground">Classes Attended</div>
          <div className="text-2xl font-semibold mt-1">116<span className="text-sm text-muted-foreground font-normal"> / 149</span></div>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <div className="text-xs text-muted-foreground">Short Attendance</div>
          <div className="text-2xl font-semibold mt-1 text-destructive">2 <span className="text-sm font-normal text-muted-foreground">courses</span></div>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <div className="text-xs text-muted-foreground">Min Required</div>
          <div className="text-2xl font-semibold mt-1">75%</div>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Course-wise Attendance</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          {rows.map((r) => (
            <div key={r.code} className="flex items-center gap-5 p-4 rounded-lg border bg-card">
              <Ring value={r.att} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="font-medium">{r.course}</div>
                  <span className="text-xs text-muted-foreground font-mono">{r.code}</span>
                  {r.att < 75 && (
                    <Badge className="bg-destructive/15 text-destructive border-0 hover:bg-destructive/15">
                      <AlertTriangle className="size-3 mr-1" />Short Attendance
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Attended {r.attended} of {r.classes} classes
                </div>
                <Progress value={r.att} className={`mt-3 h-1.5 ${r.att < 75 ? "[&>div]:bg-destructive" : ""}`} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
