import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, CalendarCheck2, Wallet, TrendingUp, Clock, ArrowUpRight } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import { requireAuth } from "@/lib/auth-guards";
import { pageHead } from "@/lib/seo";
import { useAuthUser } from "@/hooks/use-auth";
import { fetchPortalDashboard } from "@/lib/supabase/data";
import { useRealtimeInvalidate } from "@/hooks/use-realtime-invalidate";

export const Route = createFileRoute("/dashboard")({
  head: () => pageHead("Dashboard"),
  beforeLoad: ({ context }) => {
    requireAuth(context.authUser);
  },
  loader: () => fetchPortalDashboard(),
  component: Dashboard,
});

function Dashboard() {
  const authUser = useAuthUser();
  const { configured, data } = Route.useLoaderData();
  const firstName = authUser?.fullName?.split(" ")[0] ?? "there";

  useRealtimeInvalidate(["enrollments", "notifications", "semester_fees", "course_grades"]);

  if (!configured) {
    return (
      <AppLayout title={`Welcome back, ${firstName}`} subtitle="Connect Supabase to load live data.">
        <p className="text-sm text-muted-foreground">Add env vars from `.env.example` and run the seed scripts.</p>
      </AppLayout>
    );
  }

  const isStaff = data?.role === "admin" || data?.role === "teacher";

  if (isStaff && data?.stats && "students" in data.stats) {
    const s = data.stats;
    const staffStats = [
      { label: "Enrolled Students", value: s.students.toLocaleString(), icon: Users, tint: "bg-accent/10 text-accent" },
      { label: "Active Courses", value: s.courses.toLocaleString(), icon: BookOpen, tint: "bg-primary/10 text-primary" },
      { label: "Faculty", value: s.teachers.toLocaleString(), icon: CalendarCheck2, tint: "bg-emerald-500/10 text-emerald-600" },
      { label: "Pending Fees", value: s.pendingFees.toLocaleString(), icon: Wallet, tint: "bg-amber-500/10 text-amber-600" },
    ];

    return (
      <AppLayout title={`Welcome back, ${firstName}`} subtitle="University overview from live database.">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {staffStats.map((item) => (
            <Card key={item.label}>
              <CardContent className="p-5">
                <div className={`size-10 rounded-lg grid place-content-center ${item.tint}`}>
                  <item.icon className="size-5" />
                </div>
                <div className="mt-4 text-2xl font-semibold">{item.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        {data.courseDist.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Students by Department</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.courseDist} dataKey="value" innerRadius={48} outerRadius={80} paddingAngle={2}>
                    {data.courseDist.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
        <div className="mt-6">
          <Link to="/reports">
            <Button variant="outline">View full reports <ArrowUpRight className="size-3 ml-1" /></Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const st = data?.stats && "enrolledCourses" in data.stats ? data.stats : null;
  const studentStats = st
    ? [
        { label: "My Courses", value: String(st.enrolledCourses), icon: BookOpen, tint: "bg-primary/10 text-primary" },
        { label: "Attendance", value: `${st.attendanceRate}%`, icon: CalendarCheck2, tint: "bg-emerald-500/10 text-emerald-600" },
        { label: "Credits", value: `${st.creditsCompleted}/${st.creditsRequired}`, icon: Users, tint: "bg-accent/10 text-accent" },
        { label: "GPA", value: Number(st.gpa).toFixed(2), icon: Wallet, tint: "bg-amber-500/10 text-amber-600" },
      ]
    : [];

  const upcoming = data?.upcoming ?? [];

  return (
    <AppLayout title={`Welcome back, ${firstName}`} subtitle="Here's what's happening with your studies today.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {studentStats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className={`size-10 rounded-lg grid place-content-center ${s.tint}`}>
                <s.icon className="size-5" />
              </div>
              <div className="mt-4 text-2xl font-semibold">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3 mt-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Upcoming Classes</CardTitle>
            <Link to="/courses" className="text-xs text-accent hover:underline">View all</Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcoming.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No course data yet. Ask your admin to run{" "}
                <code className="text-xs bg-muted px-1 rounded">npm run seed:all</code> on Supabase, then sign in again.
              </p>
            )}
            {upcoming.map((u) => (
              <div key={u.course} className="flex items-center gap-4 p-3 rounded-lg border bg-muted/30">
                <div className="size-10 rounded-md bg-primary/10 text-primary grid place-content-center">
                  <Clock className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{u.course}</div>
                  <div className="text-xs text-muted-foreground">{u.teacher} · {u.room}</div>
                </div>
                <Badge variant="outline" className="bg-card">{u.time}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Semester Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {st && (
              <>
                <div>
                  <div className="text-xs text-muted-foreground">Credits Completed</div>
                  <div className="text-xl font-semibold mt-1">
                    {st.creditsCompleted}<span className="text-sm text-muted-foreground"> / {st.creditsRequired}</span>
                  </div>
                  <Progress value={(st.creditsCompleted / st.creditsRequired) * 100} className="mt-2 h-1.5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Current GPA</div>
                  <div className="text-xl font-semibold mt-1">{Number(st.gpa).toFixed(2)}<span className="text-sm text-muted-foreground"> / 4.0</span></div>
                  <Progress value={(Number(st.gpa) / 4) * 100} className="mt-2 h-1.5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Attendance Rate</div>
                  <div className="text-xl font-semibold mt-1">{st.attendanceRate}%</div>
                  <Progress value={st.attendanceRate} className="mt-2 h-1.5" />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
