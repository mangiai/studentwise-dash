import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useRouter, d as useRouterState } from "../_libs/tanstack__react-router.mjs";
import { I as Input, c as cn, b as signOutFromBrowser } from "./client-D3n9w-6-.mjs";
import { A as Avatar, a as AvatarFallback, u as useAuthUser, B as Badge } from "./use-auth-Xg1axn97.mjs";
import { e as APP_LOGO_SHORT, a as APP_NAME } from "./brand-o1xXujAf.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-GjJqKVtd.mjs";
import { B as Button, b as buttonVariants } from "./button-BHZ8iVgM.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DsfYZq-d.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-DBPnVq87.mjs";
import { R as Root, P as Portal, C as Content, a as Close, T as Title, D as Description, O as Overlay } from "../_libs/radix-ui__react-dialog.mjs";
import { R as Root2, P as Portal2, C as Content2, T as Title2, D as Description2, a as Cancel, A as Action, O as Overlay2 } from "../_libs/radix-ui__react-alert-dialog.mjs";
import { L as Label } from "./label-DaTUMmlB.mjs";
import { S as Select$1, a as SelectValue$1, b as SelectTrigger$1, c as SelectIcon, d as SelectPortal, e as SelectContent$1, f as SelectViewport, g as SelectItem$1, h as SelectItemIndicator, i as SelectItemText, j as SelectScrollUpButton$1, k as SelectScrollDownButton$1, l as SelectLabel$1, m as SelectSeparator$1 } from "../_libs/radix-ui__react-select.mjs";
import { h as Route, i as adminUpsertStudent, j as adminEnrollStudent, k as adminUpsertTeacher, n as adminUpsertCourse, o as adminUnenrollStudent, p as adminAssignInstructor, q as adminDeleteStudent, r as adminDeleteTeacher, s as adminDeleteCourse } from "./router-DwUeabQG.mjs";
import "../_libs/supabase__ssr.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { U as Users, G as GraduationCap, B as BookOpen, W as Wallet, i as Search, P as Plus, k as Pencil, l as Trash2, L as LayoutDashboard, m as ArrowLeft, h as LogOut, S as ShieldCheck, X, n as ChevronDown, b as Check, o as ChevronUp } from "../_libs/lucide-react.mjs";
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
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
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
import "../_libs/supabase__functions-js.mjs";
const nav = [
  { to: "/admin/dashboard", label: "Admin Dashboard", icon: LayoutDashboard }
];
function AdminLayout({ children, title, subtitle }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const authUser = useAuthUser();
  const initials = authUser?.fullName?.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() ?? "A";
  async function handleLogout() {
    try {
      await signOutFromBrowser();
      window.location.href = "/admin/login";
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] opacity-70", children: "Admin Portal" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex-1 overflow-y-auto py-4 px-3 space-y-0.5 text-sm", children: [
        nav.map((item) => {
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
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: "/dashboard",
            className: "flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground transition-colors mt-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
              "Student portal"
            ]
          }
        )
      ] }),
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
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-10 bg-card border-b h-16 px-4 lg:px-8 flex items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-4" }),
          "Admin access only"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "size-9", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary text-primary-foreground text-xs font-semibold", children: initials }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "leading-tight hidden sm:block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: authUser?.fullName ?? "Admin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Administrator" })
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
const Dialog = Root;
const DialogPortal = Portal;
const DialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = Overlay.displayName;
const DialogContent = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = Content.displayName;
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
const DialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = Title.displayName;
const DialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = Description.displayName;
const AlertDialog = Root2;
const AlertDialogPortal = Portal2;
const AlertDialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay2,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = Overlay2.displayName;
const AlertDialogContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content2,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = Content2.displayName;
const AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title2,
  {
    ref,
    className: cn("text-lg font-semibold", className),
    ...props
  }
));
AlertDialogTitle.displayName = Title2.displayName;
const AlertDialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description2,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
AlertDialogDescription.displayName = Description2.displayName;
const AlertDialogAction = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Action, { ref, className: cn(buttonVariants(), className), ...props }));
AlertDialogAction.displayName = Action.displayName;
const AlertDialogCancel = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Cancel,
  {
    ref,
    className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
    ...props
  }
));
AlertDialogCancel.displayName = Cancel.displayName;
const Select = Select$1;
const SelectValue = SelectValue$1;
const SelectTrigger = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SelectTrigger$1,
  {
    ref,
    className: cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectIcon, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectTrigger$1.displayName;
const SelectScrollUpButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SelectScrollUpButton$1,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
const SelectScrollDownButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SelectScrollDownButton$1,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
const SelectContent = reactExports.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectPortal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SelectContent$1,
  {
    ref,
    className: cn(
      "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SelectViewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectContent$1.displayName;
const SelectLabel = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SelectLabel$1,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectLabel$1.displayName;
const SelectItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SelectItem$1,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItemIndicator, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectItem$1.displayName;
const SelectSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SelectSeparator$1,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectSeparator$1.displayName;
const selectContentClass = "z-[200]";
const emptyStudentForm = {
  id: "",
  name: "",
  dept: "Computer Science",
  sem: "1",
  fee: "Pending",
  status: "Active",
  courseId: "none"
};
const emptyTeacherForm = {
  id: "",
  name: "",
  dept: "Computer Science",
  courses: "1",
  status: "Active"
};
const emptyCourseForm = {
  id: "",
  name: "",
  credits: "3",
  instructor: "none"
};
function statusBadge(s) {
  const map = {
    Paid: "bg-emerald-500/15 text-emerald-600",
    Pending: "bg-amber-500/15 text-amber-600",
    Overdue: "bg-destructive/15 text-destructive",
    Active: "bg-emerald-500/15 text-emerald-600",
    Hold: "bg-destructive/15 text-destructive",
    "On Leave": "bg-amber-500/15 text-amber-600"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: `${map[s] ?? "bg-muted text-muted-foreground"} border-0 hover:opacity-90`, children: s });
}
function matchesSearch(value, query) {
  return value.toLowerCase().includes(query.trim().toLowerCase());
}
function Admin() {
  const router = useRouter();
  const loaderData = Route.useLoaderData();
  const students = loaderData.students;
  const teachers = loaderData.teachers;
  const courses = loaderData.courses;
  const departments = loaderData.departments.length > 0 ? loaderData.departments : ["Computer Science", "Electrical Engineering", "Business Administration", "Mathematics"];
  const [studentSearch, setStudentSearch] = reactExports.useState("");
  const [teacherSearch, setTeacherSearch] = reactExports.useState("");
  const [courseSearch, setCourseSearch] = reactExports.useState("");
  const [studentOpen, setStudentOpen] = reactExports.useState(false);
  const [editingStudentId, setEditingStudentId] = reactExports.useState(null);
  const [studentForm, setStudentForm] = reactExports.useState(emptyStudentForm);
  const [teacherOpen, setTeacherOpen] = reactExports.useState(false);
  const [editingTeacherId, setEditingTeacherId] = reactExports.useState(null);
  const [teacherForm, setTeacherForm] = reactExports.useState(emptyTeacherForm);
  const [courseOpen, setCourseOpen] = reactExports.useState(false);
  const [editingCourseId, setEditingCourseId] = reactExports.useState(null);
  const [courseForm, setCourseForm] = reactExports.useState(emptyCourseForm);
  const [manageCourseId, setManageCourseId] = reactExports.useState(null);
  const [enrollSelect, setEnrollSelect] = reactExports.useState("");
  const [assignTeacherId, setAssignTeacherId] = reactExports.useState(null);
  const [assignCourseSelect, setAssignCourseSelect] = reactExports.useState("");
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const filteredStudents = reactExports.useMemo(() => students.filter((s) => !studentSearch || matchesSearch(s.name, studentSearch) || matchesSearch(s.id, studentSearch) || matchesSearch(s.dept, studentSearch)), [students, studentSearch]);
  const filteredTeachers = reactExports.useMemo(() => teachers.filter((t) => !teacherSearch || matchesSearch(t.name, teacherSearch) || matchesSearch(t.id, teacherSearch) || matchesSearch(t.dept, teacherSearch)), [teachers, teacherSearch]);
  const filteredCourses = reactExports.useMemo(() => courses.filter((c) => !courseSearch || matchesSearch(c.name, courseSearch) || matchesSearch(c.id, courseSearch) || matchesSearch(c.instructor, courseSearch)), [courses, courseSearch]);
  const manageCourse = courses.find((c) => c.id === manageCourseId) ?? null;
  const assignTeacher = teachers.find((t) => t.id === assignTeacherId) ?? null;
  const kpis = [{
    label: "Total Students",
    value: students.length.toLocaleString(),
    icon: Users,
    tint: "bg-accent/10 text-accent"
  }, {
    label: "Total Teachers",
    value: teachers.length.toLocaleString(),
    icon: GraduationCap,
    tint: "bg-primary/10 text-primary"
  }, {
    label: "Active Courses",
    value: courses.length.toLocaleString(),
    icon: BookOpen,
    tint: "bg-emerald-500/10 text-emerald-600"
  }, {
    label: "Enrollments",
    value: courses.reduce((sum, c) => sum + c.enrolledIds.length, 0).toLocaleString(),
    icon: Wallet,
    tint: "bg-amber-500/10 text-amber-600"
  }];
  function openStudentDialog(student) {
    if (student) {
      setEditingStudentId(student.id);
      setStudentForm({
        id: student.id,
        name: student.name,
        dept: student.dept,
        sem: String(student.sem),
        fee: student.fee,
        status: student.status,
        courseId: "none"
      });
    } else {
      setEditingStudentId(null);
      setStudentForm(emptyStudentForm);
    }
    setStudentOpen(true);
  }
  async function saveStudent() {
    if (!studentForm.id.trim() || !studentForm.name.trim()) {
      toast.error("Please enter student name and ID");
      return;
    }
    try {
      await adminUpsertStudent({
        data: {
          id: studentForm.id.trim(),
          name: studentForm.name.trim(),
          dept: studentForm.dept,
          sem: Number(studentForm.sem) || 1,
          fee: studentForm.fee,
          status: studentForm.status
        }
      });
      if (!editingStudentId && studentForm.courseId && studentForm.courseId !== "none") {
        await adminEnrollStudent({
          data: {
            courseId: studentForm.courseId,
            studentId: studentForm.id.trim()
          }
        });
      }
      toast.success(editingStudentId ? "Student updated" : "Student added");
      setStudentOpen(false);
      setEditingStudentId(null);
      setStudentForm(emptyStudentForm);
      await router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save student");
    }
  }
  function openTeacherDialog(teacher) {
    if (teacher) {
      setEditingTeacherId(teacher.id);
      setTeacherForm({
        id: teacher.id,
        name: teacher.name,
        dept: teacher.dept,
        courses: String(teacher.courses),
        status: teacher.status
      });
    } else {
      setEditingTeacherId(null);
      setTeacherForm(emptyTeacherForm);
    }
    setTeacherOpen(true);
  }
  async function saveTeacher() {
    if (!teacherForm.id.trim() || !teacherForm.name.trim()) {
      toast.error("Please enter teacher name and employee ID");
      return;
    }
    try {
      await adminUpsertTeacher({
        data: {
          id: teacherForm.id.trim(),
          name: teacherForm.name.trim(),
          dept: teacherForm.dept,
          courses: Number(teacherForm.courses) || 1,
          status: teacherForm.status
        }
      });
      toast.success(editingTeacherId ? "Teacher updated" : "Teacher added");
      setTeacherOpen(false);
      setEditingTeacherId(null);
      setTeacherForm(emptyTeacherForm);
      await router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save teacher");
    }
  }
  function openCourseDialog(course) {
    if (course) {
      setEditingCourseId(course.id);
      setCourseForm({
        id: course.id,
        name: course.name,
        credits: String(course.credits),
        instructor: course.instructorId ?? "none"
      });
    } else {
      setEditingCourseId(null);
      setCourseForm(emptyCourseForm);
    }
    setCourseOpen(true);
  }
  async function saveCourse() {
    if (!courseForm.id.trim() || !courseForm.name.trim()) {
      toast.error("Please enter course code and name");
      return;
    }
    try {
      await adminUpsertCourse({
        data: {
          id: courseForm.id.trim(),
          name: courseForm.name.trim(),
          credits: Number(courseForm.credits) || 3,
          instructorId: courseForm.instructor && courseForm.instructor !== "none" ? courseForm.instructor : null
        }
      });
      toast.success(editingCourseId ? "Course updated" : "Course added");
      setCourseOpen(false);
      setEditingCourseId(null);
      setCourseForm(emptyCourseForm);
      await router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save course");
    }
  }
  async function enrollStudentInCourse(courseId, studentId) {
    if (!studentId) return;
    try {
      await adminEnrollStudent({
        data: {
          courseId,
          studentId
        }
      });
      toast.success("Student enrolled");
      setEnrollSelect("");
      await router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Enrollment failed");
    }
  }
  async function unenrollStudent(courseId, studentId) {
    try {
      await adminUnenrollStudent({
        data: {
          courseId,
          studentId
        }
      });
      toast.success("Student removed from course");
      await router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not unenroll");
    }
  }
  async function assignCourseToTeacher() {
    if (!assignTeacherId || !assignCourseSelect) {
      toast.error("Select a course to assign");
      return;
    }
    try {
      await adminAssignInstructor({
        data: {
          courseId: assignCourseSelect,
          teacherId: assignTeacherId
        }
      });
      const course = courses.find((c) => c.id === assignCourseSelect);
      const teacher = teachers.find((t) => t.id === assignTeacherId);
      toast.success(`${course?.name ?? "Course"} assigned to ${teacher?.name ?? "teacher"}`);
      setAssignTeacherId(null);
      setAssignCourseSelect("");
      await router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Assignment failed");
    }
  }
  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.kind === "student") {
        await adminDeleteStudent({
          data: {
            id: deleteTarget.id
          }
        });
      } else if (deleteTarget.kind === "teacher") {
        await adminDeleteTeacher({
          data: {
            id: deleteTarget.id
          }
        });
      } else {
        await adminDeleteCourse({
          data: {
            id: deleteTarget.id
          }
        });
      }
      toast.success(`${deleteTarget.name} deleted`);
      setDeleteTarget(null);
      await router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { title: "Admin Dashboard", subtitle: "Manage students, teachers, courses, and university records", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6", children: kpis.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5 flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-12 rounded-lg grid place-content-center ${k.tint}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(k.icon, { className: "size-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-semibold", children: k.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: k.label })
      ] })
    ] }) }, k.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "students", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "students", children: [
          "Students (",
          students.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "teachers", children: [
          "Teachers (",
          teachers.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "courses", children: [
          "Courses (",
          courses.length,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "students", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Manage Students" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap justify-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search students...", className: "pl-9 w-64", value: studentSearch, onChange: (e) => setStudentSearch(e.target.value) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", className: "bg-primary hover:bg-primary/90", onClick: () => openStudentDialog(), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
              " Add Student"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Student" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Department" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-center", children: "Sem" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Fee" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TableBody, { children: [
            filteredStudents.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 7, className: "text-center text-muted-foreground py-8", children: "No students found." }) }),
            filteredStudents.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "size-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-xs bg-muted", children: s.name.split(" ").map((p) => p[0]).join("") }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: s.name })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs text-muted-foreground", children: s.id }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: s.dept }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center", children: s.sem }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: statusBadge(s.fee) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: statusBadge(s.status) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", size: "icon", variant: "ghost", onClick: () => openStudentDialog(s), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", size: "icon", variant: "ghost", onClick: () => setDeleteTarget({
                  kind: "student",
                  id: s.id,
                  name: s.name
                }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4 text-destructive" }) })
              ] })
            ] }, s.id))
          ] })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "teachers", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Manage Teachers" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap justify-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search teachers...", className: "pl-9 w-64", value: teacherSearch, onChange: (e) => setTeacherSearch(e.target.value) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", className: "bg-primary hover:bg-primary/90", onClick: () => openTeacherDialog(), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
              " Add Teacher"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Employee ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Department" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-center", children: "Courses" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TableBody, { children: [
            filteredTeachers.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 6, className: "text-center text-muted-foreground py-8", children: "No teachers found." }) }),
            filteredTeachers.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: t.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs text-muted-foreground", children: t.id }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: t.dept }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center", children: t.courses }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: statusBadge(t.status) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right space-x-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", size: "sm", variant: "outline", onClick: () => {
                  setAssignTeacherId(t.id);
                  setAssignCourseSelect("");
                }, children: "Assign Course" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", size: "icon", variant: "ghost", onClick: () => openTeacherDialog(t), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", size: "icon", variant: "ghost", onClick: () => setDeleteTarget({
                  kind: "teacher",
                  id: t.id,
                  name: t.name
                }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4 text-destructive" }) })
              ] })
            ] }, t.id))
          ] })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "courses", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Manage Courses" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap justify-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search courses...", className: "pl-9 w-64", value: courseSearch, onChange: (e) => setCourseSearch(e.target.value) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", className: "bg-primary hover:bg-primary/90", onClick: () => openCourseDialog(), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
              " Add Course"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          filteredCourses.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-muted-foreground py-8", children: "No courses found." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 md:grid-cols-2", children: filteredCourses.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium", children: [
                c.name,
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-mono", children: [
                  "(",
                  c.id,
                  ")"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-0.5", children: [
                c.credits,
                " credits · ",
                c.instructor,
                " · ",
                c.enrolledIds.length,
                " enrolled"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", size: "sm", variant: "outline", onClick: () => {
                setManageCourseId(c.id);
                setEnrollSelect("");
              }, children: "Manage" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", size: "icon", variant: "ghost", onClick: () => openCourseDialog(c), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", size: "icon", variant: "ghost", onClick: () => setDeleteTarget({
                kind: "course",
                id: c.id,
                name: c.name
              }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4 text-destructive" }) })
            ] })
          ] }, c.id)) })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: studentOpen, onOpenChange: (open) => {
      setStudentOpen(open);
      if (!open) {
        setEditingStudentId(null);
        setStudentForm(emptyStudentForm);
      }
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editingStudentId ? "Edit Student" : "Add Student" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: editingStudentId ? "Update student details below." : "Enter the new student's details below." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "s-name", children: "Full name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "s-name", value: studentForm.name, onChange: (e) => setStudentForm({
            ...studentForm,
            name: e.target.value
          }), placeholder: "e.g. Sarah Ahmed" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "s-id", children: "Student ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "s-id", value: studentForm.id, onChange: (e) => setStudentForm({
            ...studentForm,
            id: e.target.value
          }), placeholder: "e.g. 2026-BSCS-0050", disabled: !!editingStudentId })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Department" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: studentForm.dept, onValueChange: (v) => setStudentForm({
              ...studentForm,
              dept: v
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: selectContentClass, children: departments.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: d, children: d }, d)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "s-sem", children: "Semester" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "s-sem", type: "number", min: 1, max: 12, value: studentForm.sem, onChange: (e) => setStudentForm({
              ...studentForm,
              sem: e.target.value
            }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Fee" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: studentForm.fee, onValueChange: (v) => setStudentForm({
              ...studentForm,
              fee: v
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: selectContentClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Paid", children: "Paid" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Pending", children: "Pending" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Overdue", children: "Overdue" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: studentForm.status, onValueChange: (v) => setStudentForm({
              ...studentForm,
              status: v
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: selectContentClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Active", children: "Active" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Hold", children: "Hold" })
              ] })
            ] })
          ] })
        ] }),
        !editingStudentId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Enroll in course (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: studentForm.courseId, onValueChange: (v) => setStudentForm({
            ...studentForm,
            courseId: v
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a course" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: selectContentClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: "None" }),
              courses.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: c.id, children: [
                c.name,
                " (",
                c.id,
                ")"
              ] }, c.id))
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => setStudentOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", onClick: saveStudent, className: "bg-primary hover:bg-primary/90", children: editingStudentId ? "Save changes" : "Add Student" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: teacherOpen, onOpenChange: (open) => {
      setTeacherOpen(open);
      if (!open) {
        setEditingTeacherId(null);
        setTeacherForm(emptyTeacherForm);
      }
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editingTeacherId ? "Edit Teacher" : "Add Teacher" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: editingTeacherId ? "Update teacher details below." : "Enter the new teacher's details below." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "t-name", children: "Full name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "t-name", value: teacherForm.name, onChange: (e) => setTeacherForm({
            ...teacherForm,
            name: e.target.value
          }), placeholder: "e.g. Dr. Aamir Khan" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "t-id", children: "Employee ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "t-id", value: teacherForm.id, onChange: (e) => setTeacherForm({
            ...teacherForm,
            id: e.target.value
          }), placeholder: "e.g. FAC-2026-001", disabled: !!editingTeacherId })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Department" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: teacherForm.dept, onValueChange: (v) => setTeacherForm({
              ...teacherForm,
              dept: v
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: selectContentClass, children: departments.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: d, children: d }, d)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "t-courses", children: "Courses" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "t-courses", type: "number", min: 0, max: 10, value: teacherForm.courses, onChange: (e) => setTeacherForm({
              ...teacherForm,
              courses: e.target.value
            }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: teacherForm.status, onValueChange: (v) => setTeacherForm({
            ...teacherForm,
            status: v
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: selectContentClass, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Active", children: "Active" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "On Leave", children: "On Leave" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => setTeacherOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", onClick: saveTeacher, className: "bg-primary hover:bg-primary/90", children: editingTeacherId ? "Save changes" : "Add Teacher" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: courseOpen, onOpenChange: (open) => {
      setCourseOpen(open);
      if (!open) {
        setEditingCourseId(null);
        setCourseForm(emptyCourseForm);
      }
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editingCourseId ? "Edit Course" : "Add Course" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: editingCourseId ? "Update course details below." : "Create a new course offering." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "c-id", children: "Course code" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "c-id", value: courseForm.id, onChange: (e) => setCourseForm({
            ...courseForm,
            id: e.target.value
          }), placeholder: "e.g. CS-403", disabled: !!editingCourseId })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "c-name", children: "Course name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "c-name", value: courseForm.name, onChange: (e) => setCourseForm({
            ...courseForm,
            name: e.target.value
          }), placeholder: "e.g. Artificial Intelligence" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "c-credits", children: "Credits" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "c-credits", type: "number", min: 1, max: 6, value: courseForm.credits, onChange: (e) => setCourseForm({
              ...courseForm,
              credits: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Instructor" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: courseForm.instructor || "none", onValueChange: (v) => setCourseForm({
              ...courseForm,
              instructor: v
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select instructor" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: selectContentClass, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: "Unassigned" }),
                teachers.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t.id, children: t.name }, t.id))
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => setCourseOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", onClick: saveCourse, className: "bg-primary hover:bg-primary/90", children: editingCourseId ? "Save changes" : "Add Course" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!manageCourseId, onOpenChange: (open) => !open && setManageCourseId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: manageCourse?.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
          manageCourse?.id,
          " · ",
          manageCourse?.credits,
          " credits · ",
          manageCourse?.instructor
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Enroll an existing student" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: enrollSelect, onValueChange: setEnrollSelect, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select student" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: selectContentClass, children: students.filter((s) => !manageCourse?.enrolledIds.includes(s.id)).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: s.id, children: [
                s.name,
                " (",
                s.id,
                ")"
              ] }, s.id)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", onClick: () => manageCourseId && enrollStudentInCourse(manageCourseId, enrollSelect), disabled: !enrollSelect, children: "Enroll" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
            "Enrolled students (",
            manageCourse?.enrolledIds.length ?? 0,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border rounded-lg divide-y max-h-64 overflow-auto", children: [
            manageCourse && manageCourse.enrolledIds.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 text-sm text-muted-foreground", children: "No students enrolled yet." }),
            manageCourse?.enrolledIds.map((sid) => {
              const s = students.find((x) => x.id === sid);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: s?.name ?? sid }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground font-mono", children: sid })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", size: "sm", variant: "ghost", onClick: () => manageCourseId && unenrollStudent(manageCourseId, sid), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4 text-destructive" }) })
              ] }, sid);
            })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => setManageCourseId(null), children: "Close" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!assignTeacherId, onOpenChange: (open) => {
      if (!open) {
        setAssignTeacherId(null);
        setAssignCourseSelect("");
      }
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Assign course" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
          "Assign a course to ",
          assignTeacher?.name ?? "this teacher",
          " as instructor."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Course" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: assignCourseSelect, onValueChange: setAssignCourseSelect, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a course" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: selectContentClass, children: courses.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: c.id, children: [
            c.name,
            " (",
            c.id,
            ") — ",
            c.instructor
          ] }, c.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => setAssignTeacherId(null), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", onClick: assignCourseToTeacher, className: "bg-primary hover:bg-primary/90", children: "Assign" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!deleteTarget, onOpenChange: (open) => !open && setDeleteTarget(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { children: [
          "Delete ",
          deleteTarget?.kind,
          "?"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
          "This will permanently remove ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: deleteTarget?.name }),
          ". This action cannot be undone."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: confirmDelete, className: "bg-destructive hover:bg-destructive/90", children: "Delete" })
      ] })
    ] }) })
  ] });
}
export {
  Admin as component
};
