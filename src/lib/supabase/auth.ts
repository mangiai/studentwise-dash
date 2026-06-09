import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { AuthUser, UserRole } from "@/lib/auth-types";
import {
  getSupabaseServerClient,
  getSupabaseServiceClient,
  isSupabaseServerConfigured,
} from "@/lib/supabase/server";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
  studentId: z.string().optional(),
});

function resolveUserRole(
  profileRole: string | null | undefined,
  appMetadata: Record<string, unknown> | undefined,
): UserRole {
  const metaRole =
    typeof appMetadata?.role === "string" ? (appMetadata.role as UserRole) : undefined;
  const fromProfile =
    profileRole === "admin" || profileRole === "teacher" || profileRole === "student"
      ? (profileRole as UserRole)
      : undefined;

  if (fromProfile === "admin" || metaRole === "admin") return "admin";
  if (fromProfile === "teacher" || metaRole === "teacher") return "teacher";
  return fromProfile ?? metaRole ?? "student";
}

async function fetchAuthUser(): Promise<AuthUser | null> {
  if (!isSupabaseServerConfigured()) return null;

  try {
    const supabase = getSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .maybeSingle();

    const metaFullName =
      typeof user.user_metadata?.full_name === "string"
        ? user.user_metadata.full_name
        : undefined;
    const role = resolveUserRole(profile?.role, user.app_metadata);
    const fullName = profile?.full_name ?? metaFullName ?? user.email ?? "User";

    if (
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      (!profile || profile.role !== role || profile.full_name !== fullName)
    ) {
      try {
        await getSupabaseServiceClient()
          .from("profiles")
          .upsert({ id: user.id, full_name: fullName, role });
      } catch (syncError) {
        console.error("Profile sync failed:", syncError);
      }
    }

    return {
      id: user.id,
      email: user.email ?? "",
      fullName,
      role,
    };
  } catch (error) {
    console.error("Auth lookup failed:", error);
    return null;
  }
}

export const getAuthUser = createServerFn({ method: "GET" }).handler(async () => fetchAuthUser());

export const signIn = createServerFn({ method: "POST" })
  .validator((data: unknown) => signInSchema.parse(data))
  .handler(async ({ data }) => {
    if (!isSupabaseServerConfigured()) {
      throw new Error("Supabase is not configured. Add env vars to your .env file.");
    }

    const supabase = getSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) throw new Error(error.message);

    return { ok: true as const };
  });

export const signUp = createServerFn({ method: "POST" })
  .validator((data: unknown) => signUpSchema.parse(data))
  .handler(async ({ data }) => {
    if (!isSupabaseServerConfigured()) {
      throw new Error("Supabase is not configured. Add env vars to your .env file.");
    }

    const supabase = getSupabaseServerClient();
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.fullName },
      },
    });

    if (error) throw new Error(error.message);
    if (!authData.user) throw new Error("Account could not be created.");

    if (data.studentId?.trim()) {
      const admin = getSupabaseServiceClient();
      const { error: linkError } = await admin
        .from("students")
        .update({ user_id: authData.user.id, name: data.fullName })
        .eq("id", data.studentId.trim())
        .is("user_id", null);

      if (linkError) {
        console.error("Student link failed:", linkError.message);
      }
    }

    return { ok: true as const };
  });

export const signOut = createServerFn({ method: "POST" }).handler(async () => {
  if (!isSupabaseServerConfigured()) return { ok: true as const };

  const supabase = getSupabaseServerClient();
  await supabase.auth.signOut();

  return { ok: true as const };
});

const linkStudentSchema = z.object({
  studentId: z.string().min(1),
  fullName: z.string().min(2),
});

export const linkStudentAccount = createServerFn({ method: "POST" })
  .validator((data: unknown) => linkStudentSchema.parse(data))
  .handler(async ({ data }) => {
    if (!isSupabaseServerConfigured()) {
      throw new Error("Supabase is not configured.");
    }

    const supabase = getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Sign in required to link a student record.");

    const admin = getSupabaseServiceClient();
    const { error: linkError } = await admin
      .from("students")
      .update({ user_id: user.id, name: data.fullName })
      .eq("id", data.studentId.trim())
      .is("user_id", null);

    if (linkError) throw new Error(linkError.message);

    return { ok: true as const };
  });
