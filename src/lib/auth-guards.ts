import { redirect } from "@tanstack/react-router";
import type { AuthUser } from "@/lib/auth-types";
import { isStaffRole } from "@/lib/auth-types";

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

export function requireStaff(authUser: AuthUser | null | undefined) {
  if (!authUser) {
    throw redirect({ to: "/admin/login" });
  }
  if (!isStaffRole(authUser.role)) {
    throw redirect({ to: "/dashboard" });
  }
}

/** @deprecated use requireStaff */
export function requireAdmin(authUser: AuthUser | null | undefined) {
  requireStaff(authUser);
}

export function requireStaffGuest(authUser: AuthUser | null | undefined) {
  if (isStaffRole(authUser?.role)) {
    throw redirect({ to: "/admin/dashboard" });
  }
  if (authUser) {
    throw redirect({ to: "/dashboard" });
  }
}

/** @deprecated use requireStaffGuest */
export function requireAdminGuest(authUser: AuthUser | null | undefined) {
  requireStaffGuest(authUser);
}
