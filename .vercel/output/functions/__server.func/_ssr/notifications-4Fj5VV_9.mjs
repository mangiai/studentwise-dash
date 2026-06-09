import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useRouter } from "../_libs/tanstack__react-router.mjs";
import { A as AppLayout } from "./AppLayout-DOKqw1EI.mjs";
import { C as Card, a as CardContent } from "./card-GjJqKVtd.mjs";
import { B as Badge } from "./use-auth-Xg1axn97.mjs";
import { B as Button } from "./button-BHZ8iVgM.mjs";
import { c as cn } from "./client-D3n9w-6-.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { c as Route$b, m as markNotificationsRead } from "./router-DwUeabQG.mjs";
import "../_libs/supabase__ssr.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { a as Bell, M as Megaphone, B as BookOpen, C as CalendarCheck2, W as Wallet } from "../_libs/lucide-react.mjs";
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
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
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
const iconMap = {
  fee: Wallet,
  attendance: CalendarCheck2,
  course: BookOpen,
  announcement: Megaphone
};
function Notifications() {
  const router = useRouter();
  const {
    notifications
  } = Route$b.useLoaderData();
  const unread = notifications.filter((n) => !n.read).length;
  async function handleMarkAllRead() {
    try {
      await markNotificationsRead();
      toast.success("All notifications marked as read");
      await router.invalidate();
    } catch {
      toast.error("Could not update notifications");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLayout, { title: "Notifications", subtitle: `${unread} unread notification${unread === 1 ? "" : "s"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "size-4" }),
        "Live notifications from your Supabase account"
      ] }),
      unread > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: handleMarkAllRead, children: "Mark all as read" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      notifications.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No notifications yet." }),
      notifications.map((n) => {
        const Icon = iconMap[n.type] ?? Bell;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: cn(!n.read && "border-primary/30 bg-primary/[0.02]"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-lg bg-muted grid place-content-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-5 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: n.title }),
              !n.read && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary/10 text-primary border-0 hover:bg-primary/10", children: "New" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: n.body }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-2", children: n.time })
          ] })
        ] }) }, n.id);
      })
    ] })
  ] });
}
export {
  Notifications as component
};
