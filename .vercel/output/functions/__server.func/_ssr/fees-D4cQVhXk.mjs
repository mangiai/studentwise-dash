import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AppLayout } from "./AppLayout-DOKqw1EI.mjs";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-GjJqKVtd.mjs";
import { B as Badge } from "./use-auth-Xg1axn97.mjs";
import { B as Button } from "./button-BHZ8iVgM.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DsfYZq-d.mjs";
import { d as Route$8 } from "./router-DwUeabQG.mjs";
import "../_libs/supabase__ssr.mjs";
import "../_libs/sonner.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { D as Download, c as CircleCheck, d as Clock } from "../_libs/lucide-react.mjs";
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
function Fees() {
  const {
    fees,
    history
  } = Route$8.useLoaderData();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLayout, { title: "Fee Management", subtitle: "View, pay, and track your semester fees", children: [
    !fees && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "No fee record linked to your student profile." }),
    fees && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-3 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "lg:col-span-2 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs opacity-80 uppercase tracking-wide", children: fees.semester }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-3xl font-semibold mt-1", children: [
              "PKR ",
              fees.total.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm opacity-90 mt-1", children: "Total semester fee" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "grid sm:grid-cols-3 gap-4 p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Paid" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-lg font-semibold text-emerald-600", children: [
                "PKR ",
                fees.paid.toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Pending" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-lg font-semibold text-amber-600", children: [
                "PKR ",
                fees.pending.toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Due Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-semibold", children: fees.dueDate })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Quick Actions" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full bg-primary hover:bg-primary/90", children: "Pay Full Fee" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-4" }),
              " Download Voucher"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", className: "w-full", children: "Request Installment" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-lg grid place-content-center text-emerald-600 bg-emerald-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "bg-emerald-500/15 text-emerald-600 border-0", children: "Paid" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Amount paid" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-semibold mt-1", children: [
              "PKR ",
              fees.paid.toLocaleString()
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-lg grid place-content-center text-amber-600 bg-amber-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: "Pending" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Outstanding" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-semibold mt-1", children: [
              "PKR ",
              fees.pending.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-1", children: [
              "Due: ",
              fees.dueDate
            ] })
          ] }),
          fees.pending > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full bg-accent hover:bg-accent/90 text-accent-foreground", children: "Pay Now" })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Payment History" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Method" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableBody, { children: [
          history.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 5, className: "text-center text-muted-foreground py-8", children: "No transactions yet." }) }),
          history.map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm", children: h.date }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: h.desc }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm text-muted-foreground", children: h.method }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right font-medium", children: [
              "PKR ",
              h.amount.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-emerald-500/15 text-emerald-600 border-0 hover:bg-emerald-500/15", children: h.status }) })
          ] }, i))
        ] })
      ] }) })
    ] })
  ] });
}
export {
  Fees as component
};
