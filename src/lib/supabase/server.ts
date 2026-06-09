import { deleteCookie, getCookies, setCookie } from "@tanstack/react-start/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import ws from "ws";
import type { Database } from "@/lib/database.types";

const serverRealtimeOptions = {
  realtime: {
    transport: ws as unknown as typeof WebSocket,
  },
} as const;

function getServerEnv() {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
  }

  return { url, anonKey };
}

export function getSupabaseServerClient() {
  const { url, anonKey } = getServerEnv();

  return createServerClient<Database>(url, anonKey, {
    ...serverRealtimeOptions,
    cookies: {
      getAll() {
        return Object.entries(getCookies()).map(([name, value]) => ({
          name,
          value,
        }));
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          const cookieOptions = {
            ...options,
            path: options?.path ?? "/",
            sameSite: (options?.sameSite as "lax" | "strict" | "none" | undefined) ?? "lax",
            secure: options?.secure ?? process.env.NODE_ENV === "production",
          };

          if (value) {
            setCookie(name, value, cookieOptions);
          } else {
            deleteCookie(name, { path: cookieOptions.path });
          }
        });
      },
    },
  });
}

export function getSupabaseServiceClient() {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient<Database>(url, serviceRoleKey, {
    ...serverRealtimeOptions,
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function isSupabaseServerConfigured() {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;
  return Boolean(url && anonKey);
}
