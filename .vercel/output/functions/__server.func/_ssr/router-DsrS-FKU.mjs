import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { S as redirect } from "../_libs/tanstack__router-core.mjs";
import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as APP_DESCRIPTION, a as APP_NAME, b as APP_THEME_COLOR } from "./brand-o1xXujAf.mjs";
import { c as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./index.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import { o as objectType, s as stringType, e as enumType, n as numberType } from "../_libs/zod.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const appCss = "/assets/styles-kk4brqeW.css";
function appTitle(page) {
  return page ? `${page} | ${APP_NAME}` : APP_NAME;
}
function appHead(page) {
  const title = appTitle(page);
  return {
    meta: [
      { title },
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "description", content: APP_DESCRIPTION },
      { name: "application-name", content: APP_NAME },
      { name: "apple-mobile-web-app-title", content: APP_NAME },
      { name: "theme-color", content: APP_THEME_COLOR },
      { property: "og:site_name", content: APP_NAME },
      { property: "og:title", content: title },
      { property: "og:description", content: APP_DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: APP_DESCRIPTION }
    ],
    links: [
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/favicon.svg" },
      { rel: "manifest", href: "/site.webmanifest" }
    ]
  };
}
function pageHead(page) {
  const title = appTitle(page);
  return {
    meta: [
      { title },
      { property: "og:title", content: title },
      { name: "twitter:title", content: title }
    ]
  };
}
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const signInSchema = objectType({
  email: stringType().email(),
  password: stringType().min(6)
});
const signUpSchema = objectType({
  email: stringType().email(),
  password: stringType().min(8),
  fullName: stringType().min(2),
  studentId: stringType().optional()
});
const getAuthUser = createServerFn({
  method: "GET"
}).handler(createSsrRpc("f5c567ac5140e43ba5fcdf825b40cb38ba645dfb2a19ba0595a7807515a44f15"));
createServerFn({
  method: "POST"
}).validator((data) => signInSchema.parse(data)).handler(createSsrRpc("4653bac979dc566c839c98a53ac99755bb07c704bcf088b77feb9d57a4da1732"));
createServerFn({
  method: "POST"
}).validator((data) => signUpSchema.parse(data)).handler(createSsrRpc("d7fcca3fe3ac61831f82c7bdd38595963ad8aa6c56e1503dffd38f5ae092ea5e"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("248c5540df6c0e294de2706ca8a47b528b375918427cb544d809d4f7e845c1fe"));
const linkStudentSchema = objectType({
  studentId: stringType().min(1),
  fullName: stringType().min(2)
});
const linkStudentAccount = createServerFn({
  method: "POST"
}).validator((data) => linkStudentSchema.parse(data)).handler(createSsrRpc("848dbbe9e3ea97e446d34aaf053c7ed4c1cc74d7b16ee0d41be0232bcee585de"));
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$j = createRootRouteWithContext()({
  beforeLoad: async () => {
    const authUser = await getAuthUser();
    return { authUser };
  },
  head: () => {
    const seo = appHead();
    return {
      ...seo,
      links: [
        ...seo.links ?? [],
        {
          rel: "stylesheet",
          href: appCss
        },
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com"
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous"
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&display=swap"
        }
      ]
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$j.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { richColors: true, position: "top-right" })
  ] });
}
function requireAuth(authUser) {
  if (!authUser) {
    throw redirect({ to: "/login" });
  }
}
function requireGuest(authUser) {
  if (authUser) {
    throw redirect({ to: "/dashboard" });
  }
}
function requireAdmin(authUser) {
  if (!authUser) {
    throw redirect({ to: "/admin/login" });
  }
  if (authUser.role !== "admin") {
    throw redirect({ to: "/dashboard" });
  }
}
function requireAdminGuest(authUser) {
  if (authUser?.role === "admin") {
    throw redirect({ to: "/admin/dashboard" });
  }
  if (authUser) {
    throw redirect({ to: "/dashboard" });
  }
}
const fetchPortalDashboard = createServerFn({
  method: "GET"
}).handler(createSsrRpc("4d58b59035eedce7ce0138b80e99f8b926ccc5785931c8b58844e1fd3485cefb"));
const fetchStudentCourses = createServerFn({
  method: "GET"
}).handler(createSsrRpc("27a33e4debd6ab168eca59511cde63291174028f4c53b5dd4c7e35736c5e9e8c"));
const fetchStudentAttendance = createServerFn({
  method: "GET"
}).handler(createSsrRpc("1c992a22673887e7539d78f909fadc2ecdc1437aa03e1d401ccb7da67c839712"));
const fetchStudentFees = createServerFn({
  method: "GET"
}).handler(createSsrRpc("fb8395712825c4225151658d1832ab5545573c85cb60b7b65ee70536388c4472"));
const fetchTeachersDirectory = createServerFn({
  method: "GET"
}).handler(createSsrRpc("b5f2635ccbe59e85f45a2bcfcfaadd3f163385450bde1a06bb7d4fc12873cd46"));
const fetchStudentResults = createServerFn({
  method: "GET"
}).handler(createSsrRpc("9f11ffa414be66e3006d68b5c10f24ac322e83baf518493bc1f9e7e71d9b2711"));
const fetchNotifications = createServerFn({
  method: "GET"
}).handler(createSsrRpc("e5d4892a39ae5cc7ab1e55b6203012d23aaed92bc3eac7162d6bcda38547f35b"));
const markNotificationsRead = createServerFn({
  method: "POST"
}).handler(createSsrRpc("7d25a97408bca731433777e4edd9a6c0c38d51dd3b82a40825d7e47b0d1ab33d"));
const fetchReportsData = createServerFn({
  method: "GET"
}).handler(createSsrRpc("590186aa9e0c1014257b0831d4ff2db55313c8e363af0434bde5729de7adc641"));
const fetchAdminData = createServerFn({
  method: "GET"
}).handler(createSsrRpc("4a22e228ac3dec572222c3ac622eaff59615c9b086b053ef0f83f627240b404a"));
const studentSchema = objectType({
  id: stringType().min(1),
  name: stringType().min(1),
  dept: stringType().min(1),
  sem: numberType().min(1).max(12),
  fee: enumType(["Paid", "Pending", "Overdue"]),
  status: enumType(["Active", "Hold", "On Leave"])
});
const adminUpsertStudent = createServerFn({
  method: "POST"
}).validator((d) => studentSchema.parse(d)).handler(createSsrRpc("91c76d7cfaf2705e8949982f7c5b719d5d23f89c19c75d47ef6a1f4fec7ed188"));
const adminDeleteStudent = createServerFn({
  method: "POST"
}).validator((d) => objectType({
  id: stringType()
}).parse(d)).handler(createSsrRpc("ef05a33c8c0fc2d4e14862eeda98aed4fd92a87d5d33de9817a5690efc0afa16"));
const teacherSchema = objectType({
  id: stringType().min(1),
  name: stringType().min(1),
  dept: stringType().min(1),
  courses: numberType().min(0),
  status: enumType(["Active", "Hold", "On Leave"])
});
const adminUpsertTeacher = createServerFn({
  method: "POST"
}).validator((d) => teacherSchema.parse(d)).handler(createSsrRpc("b8358eea26f012b12ecee8933899c09ded27475ca2c58b31312693baa932657b"));
const adminDeleteTeacher = createServerFn({
  method: "POST"
}).validator((d) => objectType({
  id: stringType()
}).parse(d)).handler(createSsrRpc("0f177057b3eedf551448672319e2edcf864b932ea83e342b067d992b5464c151"));
const courseSchema = objectType({
  id: stringType().min(1),
  name: stringType().min(1),
  credits: numberType().min(1).max(6),
  instructorId: stringType().nullable()
});
const adminUpsertCourse = createServerFn({
  method: "POST"
}).validator((d) => courseSchema.parse(d)).handler(createSsrRpc("1a97aa40280300c66046e063af9eb8241517d3ca2cfd4292d30f04c850083dc0"));
const adminDeleteCourse = createServerFn({
  method: "POST"
}).validator((d) => objectType({
  id: stringType()
}).parse(d)).handler(createSsrRpc("06eb8d06a0375e2d8a5409e1323f5b757c32664ec5951a4fc54137416be0fcb6"));
const adminEnrollStudent = createServerFn({
  method: "POST"
}).validator((d) => objectType({
  courseId: stringType(),
  studentId: stringType()
}).parse(d)).handler(createSsrRpc("8b56fb568c5391c221fd012500e983022c9f00c90f326c85d167c6cb77721d48"));
const adminUnenrollStudent = createServerFn({
  method: "POST"
}).validator((d) => objectType({
  courseId: stringType(),
  studentId: stringType()
}).parse(d)).handler(createSsrRpc("f5ce13c4f64582db3c8db64f8792ac6f21b57ba0a7a9fb3c28dff075154ae810"));
const adminAssignInstructor = createServerFn({
  method: "POST"
}).validator((d) => objectType({
  courseId: stringType(),
  teacherId: stringType()
}).parse(d)).handler(createSsrRpc("2f63de82b1cf9780439b15e9ffcd528a0013567e6e3dddd145eb48e98ef6e68d"));
const fetchDepartments = createServerFn({
  method: "GET"
}).handler(createSsrRpc("21708226ea39c855c08b3037a7f14da585af272c615a6cd16e78cad0f778b378"));
const $$splitComponentImporter$i = () => import("./teachers-D2HDboCU.mjs");
const Route$i = createFileRoute("/teachers")({
  head: () => pageHead("Teachers"),
  beforeLoad: ({
    context
  }) => {
    requireAuth(context.authUser);
  },
  loader: () => fetchTeachersDirectory(),
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./teacher-BTU5dmpx.mjs");
const Route$h = createFileRoute("/teacher")({
  beforeLoad: () => {
    throw redirect({
      to: "/teachers"
    });
  },
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./signup-BJI8G1Nn.mjs");
const Route$g = createFileRoute("/signup")({
  head: () => pageHead("Sign Up"),
  beforeLoad: ({
    context
  }) => {
    requireGuest(context.authUser);
  },
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./settings-BxohiV84.mjs");
const Route$f = createFileRoute("/settings")({
  head: () => pageHead("Settings"),
  beforeLoad: ({
    context
  }) => {
    requireAuth(context.authUser);
  },
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./results-CXNJJhnA.mjs");
const Route$e = createFileRoute("/results")({
  head: () => pageHead("Results"),
  beforeLoad: ({
    context
  }) => {
    requireAuth(context.authUser);
  },
  loader: () => fetchStudentResults(),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./result-BTU5dmpx.mjs");
const Route$d = createFileRoute("/result")({
  beforeLoad: () => {
    throw redirect({
      to: "/results"
    });
  },
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./reports-5Z7rAGpz.mjs");
const Route$c = createFileRoute("/reports")({
  head: () => pageHead("Reports"),
  beforeLoad: ({
    context
  }) => {
    requireAuth(context.authUser);
  },
  loader: () => fetchReportsData(),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./notifications-BeCyo3Wq.mjs");
const Route$b = createFileRoute("/notifications")({
  head: () => pageHead("Notifications"),
  beforeLoad: ({
    context
  }) => {
    requireAuth(context.authUser);
  },
  loader: () => fetchNotifications(),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./notifcations-BTU5dmpx.mjs");
const Route$a = createFileRoute("/notifcations")({
  beforeLoad: () => {
    throw redirect({
      to: "/notifications"
    });
  },
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./login-BTHUmdjL.mjs");
const Route$9 = createFileRoute("/login")({
  head: () => pageHead("Sign In"),
  beforeLoad: ({
    context
  }) => {
    requireGuest(context.authUser);
  },
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./fees-C6ArIjTB.mjs");
const Route$8 = createFileRoute("/fees")({
  head: () => pageHead("Fees"),
  beforeLoad: ({
    context
  }) => {
    requireAuth(context.authUser);
  },
  loader: () => fetchStudentFees(),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./dashboard-jD3KWlWA.mjs");
const Route$7 = createFileRoute("/dashboard")({
  head: () => pageHead("Dashboard"),
  beforeLoad: ({
    context
  }) => {
    requireAuth(context.authUser);
  },
  loader: () => fetchPortalDashboard(),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./courses-CvzzNz57.mjs");
const Route$6 = createFileRoute("/courses")({
  head: () => pageHead("Courses"),
  beforeLoad: ({
    context
  }) => {
    requireAuth(context.authUser);
  },
  loader: () => fetchStudentCourses(),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./attendance-B0eV82V2.mjs");
const Route$5 = createFileRoute("/attendance")({
  head: () => pageHead("Attendance"),
  beforeLoad: ({
    context
  }) => {
    requireAuth(context.authUser);
  },
  loader: () => fetchStudentAttendance(),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./route-BFsOu0JM.mjs");
const Route$4 = createFileRoute("/admin")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./index-BTU5dmpx.mjs");
const Route$3 = createFileRoute("/")({
  beforeLoad: ({
    context
  }) => {
    throw redirect({
      to: context.authUser ? "/dashboard" : "/login"
    });
  },
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./index-Dwsdb6Kz.mjs");
const Route$2 = createFileRoute("/admin/")({
  beforeLoad: ({
    context
  }) => {
    throw redirect({
      to: context.authUser?.role === "admin" ? "/admin/dashboard" : "/admin/login"
    });
  },
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./login-B0FyPGMP.mjs");
const Route$1 = createFileRoute("/admin/login")({
  head: () => pageHead("Admin Sign In"),
  beforeLoad: ({
    context
  }) => {
    requireAdminGuest(context.authUser);
  },
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./dashboard-CTVRmi1l.mjs");
const Route = createFileRoute("/admin/dashboard")({
  head: () => pageHead("Admin Dashboard"),
  beforeLoad: ({
    context
  }) => {
    requireAdmin(context.authUser);
  },
  loader: async () => {
    const [adminData, deptData] = await Promise.all([fetchAdminData(), fetchDepartments()]);
    return {
      ...adminData,
      departments: deptData.departments.map((d) => d.name)
    };
  },
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const TeachersRoute = Route$i.update({
  id: "/teachers",
  path: "/teachers",
  getParentRoute: () => Route$j
});
const TeacherRoute = Route$h.update({
  id: "/teacher",
  path: "/teacher",
  getParentRoute: () => Route$j
});
const SignupRoute = Route$g.update({
  id: "/signup",
  path: "/signup",
  getParentRoute: () => Route$j
});
const SettingsRoute = Route$f.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => Route$j
});
const ResultsRoute = Route$e.update({
  id: "/results",
  path: "/results",
  getParentRoute: () => Route$j
});
const ResultRoute = Route$d.update({
  id: "/result",
  path: "/result",
  getParentRoute: () => Route$j
});
const ReportsRoute = Route$c.update({
  id: "/reports",
  path: "/reports",
  getParentRoute: () => Route$j
});
const NotificationsRoute = Route$b.update({
  id: "/notifications",
  path: "/notifications",
  getParentRoute: () => Route$j
});
const NotifcationsRoute = Route$a.update({
  id: "/notifcations",
  path: "/notifcations",
  getParentRoute: () => Route$j
});
const LoginRoute = Route$9.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$j
});
const FeesRoute = Route$8.update({
  id: "/fees",
  path: "/fees",
  getParentRoute: () => Route$j
});
const DashboardRoute = Route$7.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => Route$j
});
const CoursesRoute = Route$6.update({
  id: "/courses",
  path: "/courses",
  getParentRoute: () => Route$j
});
const AttendanceRoute = Route$5.update({
  id: "/attendance",
  path: "/attendance",
  getParentRoute: () => Route$j
});
const AdminRouteRoute = Route$4.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$j
});
const IndexRoute = Route$3.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$j
});
const AdminIndexRoute = Route$2.update({
  id: "/",
  path: "/",
  getParentRoute: () => AdminRouteRoute
});
const AdminLoginRoute = Route$1.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => AdminRouteRoute
});
const AdminDashboardRoute = Route.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AdminRouteRoute
});
const AdminRouteRouteChildren = {
  AdminDashboardRoute,
  AdminLoginRoute,
  AdminIndexRoute
};
const AdminRouteRouteWithChildren = AdminRouteRoute._addFileChildren(
  AdminRouteRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  AdminRouteRoute: AdminRouteRouteWithChildren,
  AttendanceRoute,
  CoursesRoute,
  DashboardRoute,
  FeesRoute,
  LoginRoute,
  NotifcationsRoute,
  NotificationsRoute,
  ReportsRoute,
  ResultRoute,
  ResultsRoute,
  SettingsRoute,
  SignupRoute,
  TeacherRoute,
  TeachersRoute
};
const routeTree = Route$j._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient, authUser: null },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$i as R,
  Route$e as a,
  Route$c as b,
  Route$b as c,
  Route$8 as d,
  Route$7 as e,
  Route$6 as f,
  Route$5 as g,
  Route as h,
  adminUpsertStudent as i,
  adminEnrollStudent as j,
  adminUpsertTeacher as k,
  linkStudentAccount as l,
  markNotificationsRead as m,
  adminUpsertCourse as n,
  adminUnenrollStudent as o,
  adminAssignInstructor as p,
  adminDeleteStudent as q,
  adminDeleteTeacher as r,
  adminDeleteCourse as s,
  router as t
};
