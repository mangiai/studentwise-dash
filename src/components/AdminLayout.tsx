import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  Bell,
  Wallet,
  CalendarCheck2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { APP_LOGO_SHORT, APP_NAME } from "@/lib/brand";
import { useAuthUser } from "@/hooks/use-auth";
import { signOut } from "@/lib/supabase/auth";
import { toast } from "sonner";
import { ATTENDANCE_TERM, CURRENT_SEMESTER } from "@/lib/constants";

const nav = [
  { to: "/admin/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/students", label: "Students", icon: Users },
  { to: "/admin/teachers", label: "Teachers", icon: GraduationCap },
  { to: "/admin/courses", label: "Courses", icon: BookOpen },
  { to: "/admin/enrollments", label: "Enrollments", icon: ClipboardList },
  { to: "/admin/attendance", label: "Attendance", icon: CalendarCheck2 },
  { to: "/admin/fees", label: "Fees & Challans", icon: Wallet },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
];

const roleLabels: Record<string, string> = {
  admin: "Administrator",
  moderator: "Moderator",
};

export function AdminLayout({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const authUser = useAuthUser();
  const initials = authUser?.fullName
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "A";

  async function handleLogout() {
    try {
      await signOut();
      window.location.href = "/admin/login";
    } catch {
      toast.error("Could not sign out");
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground sticky top-0 h-screen">
        <div className="px-6 h-16 flex items-center gap-2 border-b border-sidebar-border">
          <div className="size-9 rounded-lg bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold text-sm">
            {APP_LOGO_SHORT}
          </div>
          <div className="leading-tight">
            <div className="font-semibold tracking-tight">{APP_NAME}</div>
            <div className="text-[11px] opacity-70">Staff Portal</div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5 text-sm">
          {nav.map((item) => {
            const active = item.exact ? path === item.to : path.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent/60"
          >
            <LogOut className="size-4" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 bg-card border-b h-16 px-4 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="size-4" />
            Staff access only
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="leading-tight hidden sm:block">
              <div className="text-sm font-medium">{authUser?.fullName ?? "Staff"}</div>
              <div className="text-xs text-muted-foreground">
                {roleLabels[authUser?.role ?? ""] ?? "Staff"}
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 flex-1">
          <div className="mb-6 flex items-end justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
            </div>
            <Badge variant="outline" className="bg-card">
              {path.startsWith("/admin/attendance") ? ATTENDANCE_TERM : CURRENT_SEMESTER}
            </Badge>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
