import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./button-BHZ8iVgM.mjs";
import { I as Input, i as isSupabaseConfigured, a as signInWithEmail } from "./client-D3n9w-6-.mjs";
import { L as Label } from "./label-DaTUMmlB.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as APP_NAME, d as APP_COPYRIGHT } from "./brand-o1xXujAf.mjs";
import "../_libs/supabase__ssr.mjs";
import { S as ShieldCheck, U as Users, f as ChartColumn, j as Lock } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function AdminLogin() {
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const supabaseReady = isSupabaseConfigured();
  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Enter email and password");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmail(email.trim(), password);
      toast.success("Welcome, admin!");
      window.location.href = "/admin/dashboard";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen grid lg:grid-cols-2 bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden lg:flex relative flex-col justify-between p-12 bg-sidebar text-sidebar-foreground overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_30%,white_0,transparent_40%),radial-gradient(circle_at_80%_70%,white_0,transparent_40%)]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-xl bg-sidebar-primary grid place-content-center text-sidebar-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-lg", children: APP_NAME }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs opacity-70", children: "Admin Portal" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative space-y-6 max-w-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-semibold leading-tight", children: "Secure admin access for university staff." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm opacity-80", children: "Manage students, teachers, courses, fees, and institutional records from one dashboard." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 pt-4", children: [{
          i: Users,
          t: "Student & faculty management"
        }, {
          i: ChartColumn,
          t: "Reports and analytics"
        }, {
          i: Lock,
          t: "Role-based secure access"
        }].map(({
          i: Icon,
          t
        }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-md bg-sidebar-accent grid place-content-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4" }) }),
          t
        ] }, t)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative text-xs opacity-60", children: APP_COPYRIGHT })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center p-6 lg:p-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:hidden mb-8 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-xl bg-primary grid place-content-center text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-lg", children: [
          APP_NAME,
          " Admin"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "Admin sign in" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Use your administrator credentials to access the admin dashboard." }),
      !supabaseReady && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-amber-600 bg-amber-500/10 border border-amber-500/20 rounded-md p-3", children: "Supabase env vars missing. Copy `.env.example` to `.env` and add your keys." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "mt-8 space-y-4", onSubmit: handleSubmit, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "admin-email", children: "Admin email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "admin-email", type: "email", placeholder: "admin@studentwise.test", value: email, onChange: (e) => setEmail(e.target.value), autoComplete: "email", disabled: loading })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "admin-pwd", children: "Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "admin-pwd", type: "password", placeholder: "••••••••", value: password, onChange: (e) => setPassword(e.target.value), autoComplete: "current-password", disabled: loading })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full bg-primary hover:bg-primary/90", disabled: loading, children: loading ? "Signing in..." : "Sign in to Admin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-sm text-muted-foreground", children: [
          "Student or teacher?",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-accent font-medium hover:underline", children: "Portal login" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  AdminLogin as component
};
