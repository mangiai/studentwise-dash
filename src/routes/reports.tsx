import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { pageHead } from "@/lib/seo";
import { requireAuth } from "@/lib/auth-guards";

export const Route = createFileRoute("/reports")({ head: () => pageHead("Reports"), beforeLoad: ({ context }) => { requireAuth(context.authUser); }, component: Reports });

const enroll = [
  { y: "2021", s: 3200 }, { y: "2022", s: 3680 }, { y: "2023", s: 4120 },
  { y: "2024", s: 4540 }, { y: "2025", s: 4920 }, { y: "2026", s: 5284 },
];
const fees = [
  { m: "Jan", c: 142 }, { m: "Feb", c: 168 }, { m: "Mar", c: 195 }, { m: "Apr", c: 178 },
  { m: "May", c: 210 }, { m: "Jun", c: 232 }, { m: "Jul", c: 248 }, { m: "Aug", c: 284 },
];
const att = [
  { d: "Mon", v: 92 }, { d: "Tue", v: 89 }, { d: "Wed", v: 87 },
  { d: "Thu", v: 91 }, { d: "Fri", v: 78 }, { d: "Sat", v: 84 },
];
const dept = [
  { name: "Computer Science", value: 1820, color: "var(--color-chart-1)" },
  { name: "Electrical Eng.", value: 1140, color: "var(--color-chart-2)" },
  { name: "Business Admin.", value: 920, color: "var(--color-chart-3)" },
  { name: "Mathematics", value: 640, color: "var(--color-chart-4)" },
  { name: "Other", value: 764, color: "var(--color-chart-5)" },
];

function Reports() {
  return (
    <AppLayout title="Reports & Analytics" subtitle="University-wide insights and performance metrics">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Student Enrollment Trend</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enroll} margin={{ left: -10, top: 4 }}>
                <defs>
                  <linearGradient id="ge" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="y" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="s" stroke="var(--color-chart-1)" strokeWidth={2.5} fill="url(#ge)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Fee Collection</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fees} margin={{ left: -10, top: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Bar dataKey="c" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Weekly Attendance Analytics</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={att} margin={{ left: -10, top: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="d" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} domain={[60, 100]} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="v" stroke="var(--color-chart-3)" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Students by Department</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dept} dataKey="value" innerRadius={60} outerRadius={95} paddingAngle={2}>
                  {dept.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
