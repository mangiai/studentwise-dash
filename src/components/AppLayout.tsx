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

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/courses", label: "My Courses", icon: BookOpen },
  { to: "/attendance", label: "Attendance", icon: CalendarCheck2 },
  { to: "/fees", label: "Fee Management", icon: Wallet },
  { to: "/teachers", label: "Teachers", icon: Users },
  { to: "/results", label: "Results", icon: GraduationCap },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/admin", label: "Admin Panel", icon: ShieldCheck },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppLayout({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
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
          {nav.map((item) => {
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
          <a
            href="/login"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent/60"
          >
            <LogOut className="size-4" /> Logout
          </a>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 bg-card border-b h-16 px-4 lg:px-8 flex items-center gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search students, courses, teachers..." className="pl-9 bg-background" />
          </div>
          <button className="relative p-2 rounded-md hover:bg-muted">
            <Bell className="size-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive" />
          </button>
          <div className="hidden sm:flex items-center gap-3 pl-3 border-l">
            <Avatar className="size-9">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">A</AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <div className="text-sm font-medium">Admin</div>
              <div className="text-xs text-muted-foreground">{APP_TAGLINE}</div>
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
              Spring Semester - 2026
            </Badge>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
