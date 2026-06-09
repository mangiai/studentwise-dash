import { T as TSS_SERVER_FUNCTION, s as setCookie, d as deleteCookie, b as getCookies } from "./index.mjs";
import { createRequire } from "node:module";
import { c as createServerClient } from "../_libs/supabase__ssr.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const require$1 = createRequire(import.meta.url);
function getServerClientOptions(cookies) {
  const options = { cookies };
  if (typeof WebSocket === "undefined") {
    try {
      const Ws = require$1("ws");
      options.realtime = {
        transport: Ws
      };
    } catch (error) {
      console.warn("Supabase server client: ws transport unavailable", error);
    }
  }
  return options;
}
function getServerEnv() {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
  }
  return { url, anonKey };
}
function getSupabaseServerClient() {
  const { url, anonKey } = getServerEnv();
  return createServerClient(
    url,
    anonKey,
    getServerClientOptions({
      getAll() {
        return Object.entries(getCookies()).map(([name, value]) => ({
          name,
          value
        }));
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          const cookieOptions = {
            ...options,
            path: options?.path ?? "/",
            sameSite: options?.sameSite ?? "lax",
            secure: options?.secure ?? true
          };
          if (value) {
            setCookie(name, value, cookieOptions);
          } else {
            deleteCookie(name, { path: cookieOptions.path });
          }
        });
      }
    })
  );
}
function getSupabaseServiceClient() {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  const options = {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  };
  if (typeof WebSocket === "undefined") {
    try {
      const Ws = require$1("ws");
      options.realtime = {
        transport: Ws
      };
    } catch (error) {
      console.warn("Supabase service client: ws transport unavailable", error);
    }
  }
  return createClient(url, serviceRoleKey, options);
}
function isSupabaseServerConfigured() {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;
  return Boolean(url && anonKey);
}
export {
  getSupabaseServiceClient as a,
  createServerRpc as c,
  getSupabaseServerClient as g,
  isSupabaseServerConfigured as i
};
