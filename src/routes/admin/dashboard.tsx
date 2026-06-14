import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { pageHead } from "@/lib/seo";
import { requireStaff } from "@/lib/auth-guards";
import { loadAdminPageData } from "@/lib/admin/shared";
import {
  Users,
  GraduationCap,
  BookOpen,
  Wallet,
  ClipboardList,
  Bell,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => pageHead("Admin Dashboard"),
  beforeLoad: ({ context }) => {
    requireStaff(context.authUser);
  },
  loader: loadAdminPageData,
  component: AdminOverview,
});

const quickLinks = [
  { to: "/admin/students", label: "Students", description: "Manage student records", icon: Users, tint: "bg-accent/10 text-accent" },
  { to: "/admin/teachers", label: "Teachers", description: "Faculty and assignments", icon: GraduationCap, tint: "bg-primary/10 text-primary" },
  { to: "/admin/courses", label: "Courses", description: "Course catalog & enrollments", icon: BookOpen, tint: "bg-emerald-500/10 text-emerald-600" },
  { to: "/admin/enrollments", label: "Enrollments", description: "Semester enrollments", icon: ClipboardList, tint: "bg-blue-500/10 text-blue-600" },
  { to: "/admin/fees", label: "Fees & Challans", description: "Fee status & challans", icon: Wallet, tint: "bg-amber-500/10 text-amber-600" },
  { to: "/admin/notifications", label: "Notifications", description: "Send announcements", icon: Bell, tint: "bg-violet-500/10 text-violet-600" },
] as const;

function AdminOverview() {
  const { students, teachers, courses } = Route.useLoaderData();
  const enrollmentCount = courses.reduce((sum, c) => sum + c.enrolledIds.length, 0);

  const kpis = [
    { label: "Total Students", value: students.length.toLocaleString(), icon: Users, tint: "bg-accent/10 text-accent" },
    { label: "Total Teachers", value: teachers.length.toLocaleString(), icon: GraduationCap, tint: "bg-primary/10 text-primary" },
    { label: "Active Courses", value: courses.length.toLocaleString(), icon: BookOpen, tint: "bg-emerald-500/10 text-emerald-600" },
    { label: "Enrollments", value: enrollmentCount.toLocaleString(), icon: Wallet, tint: "bg-amber-500/10 text-amber-600" },
  ];

  return (
    <AdminLayout title="Overview" subtitle="University records at a glance">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`size-12 rounded-lg grid place-content-center ${k.tint}`}>
                <k.icon className="size-5" />
              </div>
              <div>
                <div className="text-2xl font-semibold">{k.value}</div>
                <div className="text-xs text-muted-foreground">{k.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((link) => (
          <Link key={link.to} to={link.to}>
            <Card className="h-full transition-colors hover:bg-muted/40">
              <CardContent className="p-5 flex items-start gap-4">
                <div className={`size-11 rounded-lg grid place-content-center shrink-0 ${link.tint}`}>
                  <link.icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium flex items-center gap-2">
                    {link.label}
                    <ArrowRight className="size-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{link.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}
