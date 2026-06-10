import { defineConfig } from "nitro/config";

const isVercel = Boolean(process.env.VERCEL || process.env.VERCEL_ENV);

export default defineConfig({
  compatibilityDate: "2025-09-24",
  preset: isVercel ? "vercel" : undefined,
  // Expose Supabase keys to Nitro server runtime on Vercel (not just Vite build)
  runtimeConfig: {
    supabaseUrl: process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "",
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY ?? "",
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  },
  vercel: {
    functions: {
      runtime: "nodejs22.x",
    },
  },
  routeRules: {
    "/assets/**": {
      headers: {
        "cache-control": "public, max-age=31536000, immutable",
      },
    },
    "/**": {
      headers: {
        "cache-control": "no-store, no-cache, must-revalidate",
      },
    },
  },
});
