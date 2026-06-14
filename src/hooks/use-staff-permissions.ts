import { useAuthUser } from "@/hooks/use-auth";

export function useStaffPermissions() {
  const authUser = useAuthUser();
  const isAdmin = authUser?.role === "admin";
  const isModerator = authUser?.role === "moderator";
  const isStaff = isAdmin || isModerator;
  const canDelete = isAdmin;

  return { isAdmin, isModerator, isStaff, canDelete };
}
