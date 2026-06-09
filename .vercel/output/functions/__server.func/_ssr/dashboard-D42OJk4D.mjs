import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { A as AppLayout } from "./AppLayout-DOKqw1EI.mjs";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-GjJqKVtd.mjs";
import { u as useAuthUser, B as Badge } from "./use-auth-Xg1axn97.mjs";
import { P as Progress } from "./progress-BhtV1a3p.mjs";
import { B as Button } from "./button-BHZ8iVgM.mjs";
import { e as Route$7 } from "./router-DwUeabQG.mjs";
import "../_libs/supabase__ssr.mjs";
import "../_libs/sonner.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { U as Users, B as BookOpen, C as CalendarCheck2, W as Wallet, A as ArrowUpRight, d as Clock } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, P as PieChart, d as Pie, e as Cell, f as Legend } from "../_libs/recharts.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "./client-D3n9w-6-.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "./brand-o1xXujAf.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-progress.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/lodash.mjs";
import "../_libs/react-smooth.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/fast-equals.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/react-is.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/recharts-scale.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
function Dashboard() {
  const authUser = useAuthUser();
  const {
    configured,
    data
  } = Route$7.useLoaderData();
  const firstName = authUser?.fullName?.split(" ")[0] ?? "there";
  if (!configured) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppLayout, { title: `Welcome back, ${firstName}`, subtitle: "Connect Supabase to load live data.", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Add env vars from `.env.example` and run the seed scripts." }) });
  }
  const isStaff = data?.role === "admin" || data?.role === "teacher";
  if (isStaff && data?.stats && "students" in data.stats) {
    const s = data.stats;
    const staffStats = [{
      label: "Enrolled Students",
      value: s.students.toLocaleString(),
      icon: Users,
      tint: "bg-accent/10 text-accent"
    }, {
      label: "Active Courses",
      value: s.courses.toLocaleString(),
      icon: BookOpen,
      tint: "bg-primary/10 text-primary"
    }, {
      label: "Faculty",
      value: s.teachers.toLocaleString(),
      icon: CalendarCheck2,
      tint: "bg-emerald-500/10 text-emerald-600"
    }, {
      label: "Pending Fees",
      value: s.pendingFees.toLocaleString(),
      icon: Wallet,
      tint: "bg-amber-500/10 text-amber-600"
    }];
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLayout, { title: `Welcome back, ${firstName}`, subtitle: "University overview from live database.", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4", children: staffStats.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-10 rounded-lg grid place-content-center ${item.tint}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "size-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 text-2xl font-semibold", children: item.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: item.label })
      ] }) }, item.label)) }),
      data.courseDist.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Students by Department" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "h-72", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, { data: data.courseDist, dataKey: "value", innerRadius: 48, outerRadius: 80, paddingAngle: 2, children: data.courseDist.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: d.color }, d.name)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { iconType: "circle", wrapperStyle: {
            fontSize: 12
          } })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/reports", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", children: [
        "View full reports ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "size-3 ml-1" })
      ] }) }) })
    ] });
  }
  const st = data?.stats && "enrolledCourses" in data.stats ? data.stats : null;
  const studentStats = st ? [{
    label: "My Courses",
    value: String(st.enrolledCourses),
    icon: BookOpen,
    tint: "bg-primary/10 text-primary"
  }, {
    label: "Attendance",
    value: `${st.attendanceRate}%`,
    icon: CalendarCheck2,
    tint: "bg-emerald-500/10 text-emerald-600"
  }, {
    label: "Credits",
    value: `${st.creditsCompleted}/${st.creditsRequired}`,
    icon: Users,
    tint: "bg-accent/10 text-accent"
  }, {
    label: "GPA",
    value: Number(st.gpa).toFixed(2),
    icon: Wallet,
    tint: "bg-amber-500/10 text-amber-600"
  }] : [];
  const upcoming = data?.upcoming ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLayout, { title: `Welcome back, ${firstName}`, subtitle: "Here's what's happening with your studies today.", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4", children: studentStats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-10 rounded-lg grid place-content-center ${s.tint}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: "size-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 text-2xl font-semibold", children: s.value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: s.label })
    ] }) }, s.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-3 mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Upcoming Classes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/courses", className: "text-xs text-accent hover:underline", children: "View all" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
          upcoming.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No enrollments found. Link your account to a student record." }),
          upcoming.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 p-3 rounded-lg border bg-muted/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-md bg-primary/10 text-primary grid place-content-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm truncate", children: u.course }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                u.teacher,
                " · ",
                u.room
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-card", children: u.time })
          ] }, u.course))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Semester Progress" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: st && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Credits Completed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xl font-semibold mt-1", children: [
              st.creditsCompleted,
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
                " / ",
                st.creditsRequired
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: st.creditsCompleted / st.creditsRequired * 100, className: "mt-2 h-1.5" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Current GPA" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xl font-semibold mt-1", children: [
              Number(st.gpa).toFixed(2),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: " / 4.0" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: Number(st.gpa) / 4 * 100, className: "mt-2 h-1.5" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Attendance Rate" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xl font-semibold mt-1", children: [
              st.attendanceRate,
              "%"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: st.attendanceRate, className: "mt-2 h-1.5" })
          ] })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  Dashboard as component
};
