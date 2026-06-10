export type SupabasePublicConfig = {
  url: string;
  anonKey: string;
};

declare global {
  interface Window {
    __SUPABASE_CONFIG__?: SupabasePublicConfig;
  }
}

/** Server-side: read public Supabase keys from runtime env (works on Vercel without a rebuild). */
export function getSupabasePublicConfigFromEnv(): SupabasePublicConfig | null {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

/** Read public config: server runtime env → injected window config → Vite build-time env. */
export function getSupabasePublicConfig(): SupabasePublicConfig | null {
  if (typeof window === "undefined") {
    return getSupabasePublicConfigFromEnv();
  }

  if (window.__SUPABASE_CONFIG__?.url && window.__SUPABASE_CONFIG__?.anonKey) {
    return window.__SUPABASE_CONFIG__;
  }

  const fromEnv = getSupabasePublicConfigFromEnv();
  if (fromEnv) return fromEnv;

  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  return { url, anonKey };
}

export function isSupabasePublicConfigured() {
  return getSupabasePublicConfig() !== null;
}
