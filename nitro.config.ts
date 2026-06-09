import { defineConfig } from "nitro/config";

export default defineConfig({
  compatibilityDate: "2025-09-24",
  preset: process.env.VERCEL ? "vercel" : undefined,
});
