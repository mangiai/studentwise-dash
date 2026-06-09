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

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

const stats = [
  { label: "Enrolled Students", value: "5,284", delta: "+12%", icon: Users, tint: "bg-accent/10 text-accent" },
  { label: "Active Courses", value: "48", delta: "+3", icon: BookOpen, tint: "bg-primary/10 text-primary" },
  { label: "Attendance Rate", value: "87%", delta: "+2.4%", icon: CalendarCheck2, tint: "bg-emerald-500/10 text-emerald-600" },
  { label: "Pending Fees", value: "PKR 0.5 M", delta: "-8%", icon: Wallet, tint: "bg-amber-500/10 text-amber-600" },
];

const enrollmentData = [
  { m: "Jan", s: 420 }, { m: "Feb", s: 480 }, { m: "Mar", s: 510 },
  { m: "Apr", s: 560 }, { m: "May", s: 590 }, { m: "Jun", s: 640 },
  { m: "Jul", s: 720 }, { m: "Aug", s: 810 },
];

const feeCollection = [
  { m: "Wk 1", paid: 12, pending: 4 },
  { m: "Wk 2", paid: 18, pending: 6 },
  { m: "Wk 3", paid: 22, pending: 3 },
  { m: "Wk 4", paid: 28, pending: 5 },
];

const courseDist = [
  { name: "CS", value: 38, color: "var(--color-chart-1)" },
  { name: "EE", value: 22, color: "var(--color-chart-2)" },
  { name: "BBA", value: 18, color: "var(--color-chart-3)" },
  { name: "Math", value: 12, color: "var(--color-chart-4)" },
  { name: "Other", value: 10, color: "var(--color-chart-5)" },
];

const upcoming = [
  { course: "Database Systems", time: "09:00 – 10:30", room: "Lab 204", teacher: "Dr. Khan" },
  { course: "Operating Systems", time: "11:00 – 12:30", room: "Room 105", teacher: "Prof. Ali" },
  { course: "Software Engineering", time: "14:00 – 15:30", room: "Room 302", teacher: "Dr. Saeed" },
];

function Dashboard() {
  return (
    <AppLayout title="Welcome back, Sarah" subtitle="Here's what's happening with your studies today.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/60">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className={`size-10 rounded-lg grid place-content-center ${s.tint}`}>
                  <s.icon className="size-5" />
                </div>
                <Badge variant="secondary" className="gap-1 text-[11px]">
                  <TrendingUp className="size-3" /> {s.delta}
                </Badge>
              </div>
              <div className="mt-4 text-2xl font-semibold tracking-tight">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3 mt-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Student Enrollment</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">New enrollments over the past 8 months</p>
            </div>
            <Button variant="outline" size="sm">View report <ArrowUpRight className="size-3" /></Button>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enrollmentData} margin={{ left: -20, right: 8, top: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="s" stroke="var(--color-chart-2)" strokeWidth={2.5} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Course Distribution</CardTitle>
            <p className="text-xs text-muted-foreground">By department</p>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={courseDist} dataKey="value" innerRadius={48} outerRadius={80} paddingAngle={2}>
                  {courseDist.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 mt-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Upcoming Classes</CardTitle>
            <Link to="/courses" className="text-xs text-accent hover:underline">View all</Link>
          </CardHeader>
          <CardContent className="space-y-3">
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
            <CardTitle className="text-base">Fee Collection</CardTitle>
            <p className="text-xs text-muted-foreground">This month (in thousands)</p>
          </CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={feeCollection} margin={{ left: -20, top: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Bar dataKey="paid" fill="var(--color-chart-3)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill="var(--color-chart-4)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Semester Progress</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Credits Completed", v: 96, max: 130 },
            { label: "Current GPA", v: 3.7, max: 4, pct: 92 },
            { label: "Assignments Submitted", v: 84, max: 100 },
          ].map((p) => (
            <div key={p.label} className="p-4 rounded-lg border bg-muted/20">
              <div className="text-xs text-muted-foreground">{p.label}</div>
              <div className="text-xl font-semibold mt-1">{p.v}<span className="text-sm text-muted-foreground font-normal"> / {p.max}</span></div>
              <Progress value={p.pct ?? (p.v / p.max) * 100} className="mt-3 h-1.5" />
            </div>
          ))}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
