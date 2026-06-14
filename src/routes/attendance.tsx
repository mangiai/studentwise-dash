import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { parseISO, format } from "date-fns";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { pageHead } from "@/lib/seo";
import { requireAuth } from "@/lib/auth-guards";
import { fetchStudentAttendance } from "@/lib/supabase/data";
import { ATTENDANCE_TERM, ATTENDANCE_TERM_END, ATTENDANCE_TERM_START } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/attendance")({
  head: () => pageHead("Attendance"),
  beforeLoad: ({ context }) => {
    requireAuth(context.authUser);
  },
  loader: () => fetchStudentAttendance(),
  component: Attendance,
});

type SessionRow = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  present: boolean;
  courseCode: string;
  courseName: string;
};

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

function SessionItem({ session }: { session: SessionRow }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
      {session.present ? (
        <CheckCircle2 className="size-5 text-chart-3 shrink-0 mt-0.5" />
      ) : (
        <XCircle className="size-5 text-destructive shrink-0 mt-0.5" />
      )}
      <div className="flex-1 min-w-0">
        <div className="font-medium">{session.courseName}</div>
        <div className="text-xs text-muted-foreground font-mono mt-0.5">{session.courseCode}</div>
        <div className="text-xs text-muted-foreground mt-1">
          {session.startTime} – {session.endTime} · {session.room}
        </div>
      </div>
      <Badge variant="outline" className={session.present ? "text-chart-3 border-chart-3/40" : "text-destructive border-destructive/40"}>
        {session.present ? "Present" : "Absent"}
      </Badge>
    </div>
  );
}

function Attendance() {
  const { rows, summary, sessions, term, configured } = Route.useLoaderData();
  const overall = summary?.overall ?? 0;
  const termStart = parseISO(ATTENDANCE_TERM_START);
  const termEnd = parseISO(ATTENDANCE_TERM_END);

  const [selected, setSelected] = useState<Date | undefined>(termStart);
  const [listFilter, setListFilter] = useState<"all" | "attended" | "missed">("all");

  const sessionsByDate = useMemo(() => {
    const map = new Map<string, SessionRow[]>();
    for (const s of sessions as SessionRow[]) {
      const list = map.get(s.date) ?? [];
      list.push(s);
      map.set(s.date, list);
    }
    return map;
  }, [sessions]);

  const classDates = useMemo(
    () => Array.from(sessionsByDate.keys()).map((d) => parseISO(d)),
    [sessionsByDate],
  );

  const attendedOnlyDates = useMemo(
    () =>
      Array.from(sessionsByDate.entries())
        .filter(([, list]) => list.every((s) => s.present))
        .map(([d]) => parseISO(d)),
    [sessionsByDate],
  );

  const missedDates = useMemo(
    () =>
      Array.from(sessionsByDate.entries())
        .filter(([, list]) => list.some((s) => !s.present))
        .map(([d]) => parseISO(d)),
    [sessionsByDate],
  );

  const selectedKey = selected ? format(selected, "yyyy-MM-dd") : "";
  const selectedSessions = selectedKey ? (sessionsByDate.get(selectedKey) ?? []) : [];

  const filteredSessions = useMemo(() => {
    const list = [...(sessions as SessionRow[])].sort((a, b) =>
      `${b.date}${b.startTime}`.localeCompare(`${a.date}${a.startTime}`),
    );
    if (listFilter === "attended") return list.filter((s) => s.present);
    if (listFilter === "missed") return list.filter((s) => !s.present);
    return list;
  }, [sessions, listFilter]);

  const attendedCount = (sessions as SessionRow[]).filter((s) => s.present).length;
  const missedCount = (sessions as SessionRow[]).filter((s) => !s.present).length;

  return (
    <AppLayout
      title="Attendance"
      subtitle={`${term ?? ATTENDANCE_TERM} · ${format(termStart, "MMM d, yyyy")} – ${format(termEnd, "MMM d, yyyy")}`}
    >
      {configured && sessions.length === 0 && rows.length === 0 && (
        <Card className="mb-6 border-dashed">
          <CardContent className="p-5 text-sm text-muted-foreground">
            No Fall 2026 class sessions are loaded yet. An admin should run the attendance seed on Supabase
            (paste <code className="text-xs bg-muted px-1 py-0.5 rounded">supabase/seed-fall-attendance.sql</code> in the SQL Editor,
            or run <code className="text-xs bg-muted px-1 py-0.5 rounded">npm run db:seed:attendance</code> locally).
          </CardContent>
        </Card>
      )}

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

      <div className="grid gap-6 lg:grid-cols-[auto_1fr] mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Class calendar</CardTitle>
            <p className="text-xs text-muted-foreground">
              Weekday sessions · green = all present · red = at least one missed
            </p>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selected}
              onSelect={setSelected}
              defaultMonth={termStart}
              startMonth={termStart}
              endMonth={termEnd}
              disabled={{ before: termStart, after: termEnd }}
              modifiers={{ hasClass: classDates, allPresent: attendedOnlyDates, hasMissed: missedDates }}
              modifiersClassNames={{
                hasClass: "font-semibold",
                allPresent: "[&>button]:bg-chart-3/15 [&>button]:text-chart-3",
                hasMissed: "[&>button]:bg-destructive/10 [&>button]:text-destructive",
              }}
              className="rounded-md border"
            />
            <div className="flex flex-wrap gap-3 mt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-chart-3/60" /> All present</span>
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-destructive/60" /> Has absence</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {selected ? format(selected, "EEEE, MMMM d, yyyy") : "Select a date"}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {selectedSessions.length === 0 && (
              <p className="text-sm text-muted-foreground">No classes scheduled on this date.</p>
            )}
            {selectedSessions.map((s) => (
              <SessionItem key={`${s.id}-${s.courseCode}`} session={s} />
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
          <CardTitle className="text-base">Session log</CardTitle>
          <div className="flex gap-1 rounded-lg border p-1 bg-muted/40">
            {(["all", "attended", "missed"] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setListFilter(key)}
                className={cn(
                  "px-3 py-1 text-xs rounded-md capitalize transition-colors",
                  listFilter === key ? "bg-background shadow-sm font-medium" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {key === "all" ? `All (${sessions.length})` : key === "attended" ? `Attended (${attendedCount})` : `Missed (${missedCount})`}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="grid gap-2 max-h-[420px] overflow-y-auto">
          {filteredSessions.length === 0 && (
            <p className="text-sm text-muted-foreground">No sessions match this filter.</p>
          )}
          {filteredSessions.map((s) => (
            <div key={`${s.id}-${s.courseCode}`} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-24 shrink-0">{format(parseISO(s.date), "MMM d")}</span>
              <div className="flex-1 min-w-0">
                <SessionItem session={s} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Course-wise attendance</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          {rows.length === 0 && <p className="text-sm text-muted-foreground">No attendance records found for enrolled courses.</p>}
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
