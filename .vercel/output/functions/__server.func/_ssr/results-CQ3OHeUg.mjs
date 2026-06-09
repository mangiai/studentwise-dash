import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AppLayout } from "./AppLayout-DOKqw1EI.mjs";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-GjJqKVtd.mjs";
import { B as Badge } from "./use-auth-Xg1axn97.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DsfYZq-d.mjs";
import { a as Route$e } from "./router-DwUeabQG.mjs";
import "../_libs/supabase__ssr.mjs";
import "../_libs/sonner.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "../_libs/lucide-react.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/class-variance-authority.mjs";
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
function gradeBadge(grade) {
  const good = grade.startsWith("A");
  const ok = grade.startsWith("B");
  const cls = good ? "bg-emerald-500/15 text-emerald-600" : ok ? "bg-primary/10 text-primary" : "bg-amber-500/15 text-amber-600";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: `${cls} border-0 hover:opacity-90`, children: grade });
}
function Results() {
  const {
    semesters,
    student
  } = Route$e.useLoaderData();
  const cgpa = student?.gpa ?? 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLayout, { title: "Academic Results", subtitle: "Semester grades loaded from Supabase", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "CGPA" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-semibold mt-1", children: Number(cgpa).toFixed(2) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: "Out of 4.00" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Credits Earned" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-semibold mt-1", children: student?.credits_completed ?? 0 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-1", children: [
          student?.credits_required ?? 130,
          " required for degree"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Semesters" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-semibold mt-1", children: semesters.length }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: "With recorded grades" })
      ] }) })
    ] }),
    semesters.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No grades found for your student profile." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: semesters.map((sem) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: sem.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", children: [
          "SGPA ",
          sem.gpa.toFixed(2)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Course" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Code" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-center", children: "Credits" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-center", children: "Grade" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Points" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: sem.courses.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: c.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs text-muted-foreground", children: c.code }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center", children: c.credits }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center", children: gradeBadge(c.grade) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: c.points.toFixed(1) })
        ] }, `${sem.name}-${c.code}`)) })
      ] }) })
    ] }, sem.name)) })
  ] });
}
export {
  Results as component
};
