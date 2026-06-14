import { createFileRoute, redirect } from "@tanstack/react-router";
import { isStaffRole } from "@/lib/auth-types";

export const Route = createFileRoute("/admin/")({
  beforeLoad: ({ context }) => {
    throw redirect({
      to: isStaffRole(context.authUser?.role) ? "/admin/dashboard" : "/admin/login",
    });
  },
  component: () => null,
});
