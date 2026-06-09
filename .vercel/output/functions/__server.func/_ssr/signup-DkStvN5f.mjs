import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./button-BHZ8iVgM.mjs";
import { I as Input, i as isSupabaseConfigured, s as signUpWithEmail } from "./client-D3n9w-6-.mjs";
import { L as Label } from "./label-DaTUMmlB.mjs";
import { C as Card, a as CardContent } from "./card-GjJqKVtd.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as APP_NAME } from "./brand-o1xXujAf.mjs";
import { l as linkStudentAccount } from "./router-DwUeabQG.mjs";
import "../_libs/supabase__ssr.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { G as GraduationCap } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
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
function Signup() {
  const [fullName, setFullName] = reactExports.useState("");
  const [studentId, setStudentId] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const supabaseReady = isSupabaseConfigured();
  async function handleSubmit(e) {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast.error("Fill in all required fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      await signUpWithEmail(email.trim(), password, fullName.trim());
      if (studentId.trim()) {
        await linkStudentAccount({
          data: {
            studentId: studentId.trim(),
            fullName: fullName.trim()
          }
        });
      }
      toast.success("Account created!");
      window.location.href = "/dashboard";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background grid place-items-center p-4 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-xl bg-primary grid place-content-center text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "size-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-lg", children: APP_NAME })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "Create your account" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Join StudentWise — manage your academic life with ease." })
    ] }),
    !supabaseReady && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-4 text-sm text-amber-600 bg-amber-500/10 border border-amber-500/20 rounded-md p-3", children: "Supabase env vars missing. Copy `.env.example` to `.env` and add your keys." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6 sm:p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "grid sm:grid-cols-2 gap-4", onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 sm:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Full Name *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name", placeholder: "Sarah Ahmed", value: fullName, onChange: (e) => setFullName(e.target.value), disabled: loading })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "sid", children: "Student ID (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "sid", placeholder: "2026-BSCS-0042", value: studentId, onChange: (e) => setStudentId(e.target.value), disabled: loading })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", placeholder: "student@university.edu", value: email, onChange: (e) => setEmail(e.target.value), autoComplete: "email", disabled: loading })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "p1", children: "Password *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "p1", type: "password", placeholder: "••••••••", value: password, onChange: (e) => setPassword(e.target.value), autoComplete: "new-password", disabled: loading })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "p2", children: "Confirm Password *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "p2", type: "password", placeholder: "••••••••", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), autoComplete: "new-password", disabled: loading })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:col-span-2 pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full bg-primary hover:bg-primary/90", disabled: loading, children: loading ? "Creating account..." : "Create Account" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2 text-center text-sm text-muted-foreground", children: [
        "Already have an account?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-accent font-medium hover:underline", children: "Sign in" })
      ] })
    ] }) }) })
  ] }) });
}
export {
  Signup as component
};
