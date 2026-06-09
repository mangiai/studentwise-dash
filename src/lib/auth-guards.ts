import { redirect } from "@tanstack/react-router";
import type { AuthUser } from "@/lib/auth-types";

export function requireAuth(authUser: AuthUser | null | undefined) {
  if (!authUser) {
    throw redirect({ to: "/login" });
  }
}

export function requireGuest(authUser: AuthUser | null | undefined) {
  if (authUser) {
    throw redirect({ to: "/dashboard" });
  }
}

export function requireAdmin(authUser: AuthUser | null | undefined) {
  requireAuth(authUser);
  if (authUser!.role !== "admin") {
    throw redirect({ to: "/dashboard" });
  }
}
