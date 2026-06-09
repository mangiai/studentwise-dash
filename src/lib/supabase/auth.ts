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

async function fetchAuthUser(): Promise<AuthUser | null> {
  if (!isSupabaseServerConfigured()) return null;

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

  return {
    id: user.id,
    email: user.email ?? "",
    fullName: profile?.full_name ?? user.email ?? "User",
    role: (profile?.role as UserRole) ?? "student",
  };
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
