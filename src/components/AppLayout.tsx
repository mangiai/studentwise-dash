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
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { APP_LOGO_SHORT, APP_NAME, APP_TAGLINE } from "@/lib/brand";
import { NotificationBell } from "@/components/NotificationBell";
import { CURRENT_SEMESTER } from "@/lib/constants";
import { useAuthUser } from "@/hooks/use-auth";
import { signOut } from "@/lib/supabase/auth";
import { toast } from "sonner";

const nav: { to: string; label: string; icon: typeof LayoutDashboard; roles: UserRole[] }[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["student", "teacher", "admin"] },
  { to: "/courses", label: "My Courses", icon: BookOpen, roles: ["student", "teacher", "admin"] },
  { to: "/attendance", label: "Attendance", icon: CalendarCheck2, roles: ["student", "teacher", "admin"] },
  { to: "/fees", label: "Fee Management", icon: Wallet, roles: ["student", "admin"] },
  { to: "/teachers", label: "Teachers", icon: Users, roles: ["student", "teacher", "admin"] },
  { to: "/results", label: "Results", icon: GraduationCap, roles: ["student", "teacher", "admin"] },
  { to: "/reports", label: "Reports", icon: BarChart3, roles: ["teacher", "admin"] },
  { to: "/admin/dashboard", label: "Admin Panel", icon: ShieldCheck, roles: ["admin", "moderator"] },
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

  async function handleLogout() {
    try {
      await signOut();
      window.location.href = authUser?.role === "admin" ? "/admin/login" : "/login";
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
                  "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
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
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent/60"
          >
            <LogOut className="size-4" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 bg-card border-b h-16 px-4 lg:px-8 flex items-center gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search students, courses, teachers..." className="pl-9 bg-background" />
          </div>
          <NotificationBell />
          <div className="hidden sm:flex items-center gap-3 pl-3 border-l">
            <Avatar className="size-9">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <div className="text-sm font-medium">{authUser?.fullName ?? "User"}</div>
              <div className="text-xs text-muted-foreground capitalize">{authUser?.role ?? APP_TAGLINE}</div>
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
              {CURRENT_SEMESTER}
            </Badge>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
