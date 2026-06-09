import { defineConfig } from "nitro/config";

const isVercel = Boolean(process.env.VERCEL || process.env.VERCEL_ENV);

export default defineConfig({
  compatibilityDate: "2025-09-24",
  preset: isVercel ? "vercel" : undefined,
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
