export type UserRole = "student" | "teacher" | "admin" | "moderator";

export function isStaffRole(role: UserRole | undefined) {
  return role === "admin" || role === "moderator";
}

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
};
