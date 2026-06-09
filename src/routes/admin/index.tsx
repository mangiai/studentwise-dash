import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  beforeLoad: ({ context }) => {
    throw redirect({
      to: context.authUser?.role === "admin" ? "/admin/dashboard" : "/admin/login",
    });
  },
  component: () => null,
});
