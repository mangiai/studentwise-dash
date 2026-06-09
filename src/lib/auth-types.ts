export type UserRole = "student" | "teacher" | "admin";

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
};
