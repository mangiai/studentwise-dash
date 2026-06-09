import { useRouteContext } from "@tanstack/react-router";
import type { AuthUser } from "@/lib/auth-types";

export function useAuthUser(): AuthUser | null {
  const { authUser } = useRouteContext({ from: "__root__" });
  return authUser;
}
