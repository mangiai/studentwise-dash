import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useRouterState } from "../_libs/tanstack__react-router.mjs";
import { c as cn, I as Input, b as signOutFromBrowser } from "./client-D3n9w-6-.mjs";
import { u as useAuthUser, A as Avatar, a as AvatarFallback, B as Badge } from "./use-auth-Xg1axn97.mjs";
import { e as APP_LOGO_SHORT, a as APP_NAME, c as APP_TAGLINE } from "./brand-o1xXujAf.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { L as LayoutDashboard, B as BookOpen, C as CalendarCheck2, W as Wallet, U as Users, G as GraduationCap, f as ChartColumn, S as ShieldCheck, a as Bell, g as Settings, h as LogOut, i as Search } from "../_libs/lucide-react.mjs";
const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["student", "teacher", "admin"] },
  { to: "/courses", label: "My Courses", icon: BookOpen, roles: ["student", "teacher", "admin"] },
  { to: "/attendance", label: "Attendance", icon: CalendarCheck2, roles: ["student", "teacher", "admin"] },
  { to: "/fees", label: "Fee Management", icon: Wallet, roles: ["student", "admin"] },
  { to: "/teachers", label: "Teachers", icon: Users, roles: ["student", "teacher", "admin"] },
  { to: "/results", label: "Results", icon: GraduationCap, roles: ["student", "teacher", "admin"] },
  { to: "/reports", label: "Reports", icon: ChartColumn, roles: ["teacher", "admin"] },
  { to: "/admin/dashboard", label: "Admin Panel", icon: ShieldCheck, roles: ["admin"] },
  { to: "/notifications", label: "Notifications", icon: Bell, roles: ["student", "teacher", "admin"] },
  { to: "/settings", label: "Settings", icon: Settings, roles: ["student", "teacher", "admin"] }
];
function AppLayout({ children, title, subtitle }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const authUser = useAuthUser();
  const initials = authUser?.fullName?.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() ?? "?";
  const visibleNav = nav.filter(
    (item) => authUser ? item.roles.includes(authUser.role) : true
  );
  async function handleLogout() {
    try {
      await signOutFromBrowser();
      window.location.href = authUser?.role === "admin" ? "/admin/login" : "/login";
    } catch {
      toast.error("Could not sign out");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden lg:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground sticky top-0 h-screen", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 h-16 flex items-center gap-2 border-b border-sidebar-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-lg bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold text-sm", children: APP_LOGO_SHORT }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "leading-tight", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold tracking-tight", children: APP_NAME }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] opacity-70", children: APP_TAGLINE })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 overflow-y-auto py-4 px-3 space-y-0.5 text-sm", children: visibleNav.map((item) => {
        const active = path === item.to;
        const Icon = item.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: item.to,
            className: cn(
              "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
              active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4" }),
              item.label
            ]
          },
          item.to
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 border-t border-sidebar-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: handleLogout,
          className: "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent/60",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "size-4" }),
            " Logout"
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-10 bg-card border-b h-16 px-4 lg:px-8 flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 max-w-md relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search students, courses, teachers...", className: "pl-9 bg-background" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "relative p-2 rounded-md hover:bg-muted", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "size-5 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-3 pl-3 border-l", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "size-9", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary text-primary-foreground text-xs font-semibold", children: initials }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "leading-tight", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: authUser?.fullName ?? "User" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground capitalize", children: authUser?.role ?? APP_TAGLINE })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "p-4 lg:p-8 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex items-end justify-between flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: title }),
            subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: subtitle })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-card", children: "Spring Semester - 2026" })
        ] }),
        children
      ] })
    ] })
  ] });
}
export {
  AppLayout as A
};
