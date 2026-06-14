#!/usr/bin/env node
/**
 * Push Supabase migrations during deploy (Vercel / CI).
 *
 * Required env vars:
 *   SUPABASE_ACCESS_TOKEN  — Supabase dashboard → Account → Access Tokens
 *   SUPABASE_DB_PASSWORD   — Project → Settings → Database → password
 *   SUPABASE_PROJECT_REF   — e.g. golzvsxrogutvjmpbpsj (or parsed from SUPABASE_URL)
 *
 * Skips silently when vars are missing so local `npm run build` still works.
 */

import { spawnSync } from "node:child_process";

function getProjectRef() {
  if (process.env.SUPABASE_PROJECT_REF) return process.env.SUPABASE_PROJECT_REF.trim();

  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "";
  const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
  return match?.[1] ?? null;
}

function run(args) {
  console.log(`\n[deploy-db] npx ${args.join(" ")}`);
  const result = spawnSync("npx", args, {
    stdio: "inherit",
    env: process.env,
    shell: false,
  });
  if (result.status !== 0) {
    throw new Error(`Command failed: npx ${args.join(" ")}`);
  }
}

const token = process.env.SUPABASE_ACCESS_TOKEN;
const password = process.env.SUPABASE_DB_PASSWORD;
const projectRef = getProjectRef();

if (!token || !password || !projectRef) {
  console.log(
    "[deploy-db] Skipping migrations — set SUPABASE_ACCESS_TOKEN, SUPABASE_DB_PASSWORD, and SUPABASE_PROJECT_REF (or SUPABASE_URL) on Vercel to auto-apply migrations on deploy.",
  );
  process.exit(0);
}

try {
  run(["supabase", "link", "--project-ref", projectRef, "--password", password, "--yes"]);
  run(["supabase", "db", "push", "--yes"]);
  console.log("\n[deploy-db] Migrations applied successfully.");
} catch (error) {
  console.error("\n[deploy-db] Migration failed:", error.message ?? error);
  process.exit(1);
}
