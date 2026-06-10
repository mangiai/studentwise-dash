import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";
import { getSupabasePublicConfig, isSupabasePublicConfigured } from "@/lib/supabase/public-config";

let browserClient: ReturnType<typeof createBrowserClient<Database>> | undefined;

export function getSupabaseBrowserClient() {
  if (browserClient) return browserClient;

  const config = getSupabasePublicConfig();
  if (!config) {
    throw new Error("Missing Supabase URL or anon key");
  }

  browserClient = createBrowserClient<Database>(config.url, config.anonKey);
  return browserClient;
}

export function isSupabaseConfigured() {
  return isSupabasePublicConfigured();
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string,
) {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) throw error;
}

export async function signOutFromBrowser() {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
