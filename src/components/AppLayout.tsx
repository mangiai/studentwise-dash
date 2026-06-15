import { useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck2,
  Wallet,
  Users,
  GraduationCap,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { APP_LOGO_SHORT, APP_NAME, APP_TAGLINE } from "@/lib/brand";
import { NotificationBell } from "@/components/NotificationBell";
import { ATTENDANCE_TERM, CURRENT_SEMESTER } from "@/lib/constants";
import type { UserRole } from "@/lib/auth-types";
import { isStaffRole } from "@/lib/auth-types";
import { useAuthUser } from "@/hooks/use-auth";
import { useRealtimeInvalidate } from "@/hooks/use-realtime-invalidate";
import { signOut } from "@/lib/supabase/auth";
import { toast } from "sonner";
import { PageContent } from "@/components/motion";
import { MobileNavBar } from "@/components/MobileNavBar";

const nav: { to: string; label: string; icon: typeof LayoutDashboard; roles: UserRole[] }[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["student", "teacher", "admin"] },
  { to: "/courses", label: "My Courses", icon: BookOpen, roles: ["student", "teacher", "admin"] },
  { to: "/attendance", label: "Attendance", icon: CalendarCheck2, roles: ["student", "teacher", "admin"] },
  { to: "/fees", label: "Fee Management", icon: Wallet, roles: ["student", "admin"] },
  { to: "/teachers", label: "Teachers", icon: Users, roles: ["student", "teacher", "admin"] },
  { to: "/results", label: "Results", icon: GraduationCap, roles: ["student", "teacher", "admin"] },
  { to: "/reports", label: "Reports", icon: BarChart3, roles: ["teacher", "admin"] },
  { to: "/notifications", label: "Notifications", icon: Bell, roles: ["student", "teacher", "admin"] },
  { to: "/settings", label: "Settings", icon: Settings, roles: ["student", "teacher", "admin"] },
];

export function AppLayout({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const authUser = useAuthUser();
  const initials = authUser?.fullName
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "?";

  const visibleNav = nav.filter((item) =>
    authUser ? item.roles.includes(authUser.role) : true,
  );

  const mobileNavItems = visibleNav.map((item) => ({
    ...item,
    useLink: false as const,
  }));

  useRealtimeInvalidate([
    "enrollments",
    "notifications",
    "semester_fees",
    "course_grades",
    "attendance_records",
  ]);

  async function handleLogout() {
    try {
      await signOut();
      window.location.href = isStaffRole(authUser?.role) ? "/admin/login" : "/login";
    } catch {
      toast.error("Could not sign out");
    }
  }

  return (
    <div className="min-h-screen app-shell-bg flex">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground sticky top-0 h-screen sidebar-glow">
        <div className="px-6 h-16 flex items-center gap-2 border-b border-sidebar-border">
          <div className="size-9 rounded-lg bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold text-sm transition-transform duration-300 hover:scale-105">
            {APP_LOGO_SHORT}
          </div>
          <div className="leading-tight">
            <div className="font-bold tracking-tight text-base">{APP_NAME}</div>
            <div className="text-[11px] opacity-70">{APP_TAGLINE}</div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5 text-sm">
          {visibleNav.map((item) => {
            const active = path === item.to;
            const Icon = item.icon;
            return (
              <a
                key={item.to}
                href={item.to}
                className={cn(
                  "nav-link-motion flex items-center gap-3 rounded-md px-3 py-2",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium nav-active-glow"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </a>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <button
            type="button"
            onClick={handleLogout}
            className="nav-link-motion flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent/60"
          >
            <LogOut className="size-4" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        <header className="sticky top-0 z-30 header-glass border-b h-14 sm:h-16 px-3 sm:px-4 lg:px-8 flex items-center gap-2 sm:gap-4">
          <div className="lg:hidden flex items-center gap-2 shrink-0">
            <div className="size-8 rounded-lg bg-primary text-primary-foreground grid place-content-center text-xs font-bold">
              {APP_LOGO_SHORT}
            </div>
          </div>
          <div className="flex-1 min-w-0 max-w-md relative">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search..."
              className="pl-9 bg-background/80 h-9 sm:h-10 text-sm"
            />
          </div>
          <NotificationBell />
          <div className="flex items-center gap-2 sm:gap-3 sm:pl-3 sm:border-l shrink-0">
            <Avatar className="size-8 sm:size-9">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="leading-tight hidden md:block max-w-[140px]">
              <div className="text-sm font-medium truncate">{authUser?.fullName ?? "User"}</div>
              <div className="text-xs text-muted-foreground capitalize truncate">{authUser?.role ?? APP_TAGLINE}</div>
            </div>
          </div>
        </header>

        <main className="p-3 sm:p-4 lg:p-8 flex-1 min-w-0">
          <div className="mb-4 sm:mb-6 flex items-start sm:items-end justify-between flex-wrap gap-3 animate-fade-in-up">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">{title}</h1>
              {subtitle && <p className="text-xs sm:text-sm text-muted-foreground mt-1">{subtitle}</p>}
            </div>
            <Badge variant="outline" className="bg-card shrink-0">
              {path === "/attendance" ? ATTENDANCE_TERM : CURRENT_SEMESTER}
            </Badge>
          </div>
          <PageContent>{children}</PageContent>
        </main>
      </div>

      <MobileNavBar items={mobileNavItems} path={path} primaryCount={3} />
    </div>
  );
}
