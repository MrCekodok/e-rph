import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function applyEnvFile(filePath: string) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    const current = process.env[key];
    if (current === undefined || current.trim() === "") {
      process.env[key] = value;
    }
  }
}

function ensureLocalEnv() {
  const cwd = process.cwd();
  applyEnvFile(join(cwd, ".env.local"));
  applyEnvFile(join(cwd, "e-rph", ".env.local"));
}

function supabaseUrl() {
  ensureLocalEnv();
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
}

function supabaseKey() {
  ensureLocalEnv();
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  return serviceRole || anon || "";
}

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl() && supabaseKey());
}

export function createAdminClient(): SupabaseClient {
  const url = supabaseUrl();
  const key = supabaseKey();
  if (!url || !key) {
    throw new Error("Supabase belum dikonfigurasi. Isi .env.local.");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
