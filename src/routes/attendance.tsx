import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle } from "lucide-react";
import { pageHead } from "@/lib/seo";
import { requireAuth } from "@/lib/auth-guards";
import { fetchStudentAttendance } from "@/lib/supabase/data";

export const Route = createFileRoute("/attendance")({
  head: () => pageHead("Attendance"),
  beforeLoad: ({ context }) => {
    requireAuth(context.authUser);
  },
  loader: () => fetchStudentAttendance(),
  component: Attendance,
});

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
  const { rows, summary } = Route.useLoaderData();
  const overall = summary?.overall ?? 0;

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
          <div className="text-2xl font-semibold mt-1">{summary?.totalAttended ?? 0}<span className="text-sm text-muted-foreground font-normal"> / {summary?.totalClasses ?? 0}</span></div>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <div className="text-xs text-muted-foreground">Short Attendance</div>
          <div className="text-2xl font-semibold mt-1 text-destructive">{summary?.shortCount ?? 0} <span className="text-sm font-normal text-muted-foreground">courses</span></div>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <div className="text-xs text-muted-foreground">Min Required</div>
          <div className="text-2xl font-semibold mt-1">75%</div>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Course-wise Attendance</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          {rows.length === 0 && <p className="text-sm text-muted-foreground">No attendance records found.</p>}
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
