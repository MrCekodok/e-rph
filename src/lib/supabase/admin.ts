import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type EnvMap = Record<string, string>;

function parseEnvFile(filePath: string): EnvMap {
  if (!existsSync(filePath)) return {};
  const env: EnvMap = {};
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
    env[key] = value;
  }
  return env;
}

function fileEnv(): EnvMap {
  const cwd = process.cwd();
  const files = [
    join(cwd, ".env.local"),
    join(cwd, "e-rph", ".env.local"),
    join(dirname(process.cwd()), "e-rph", ".env.local"),
    "/Users/suhaili/e-rph/.env.local",
  ];
  return files.reduce<EnvMap>((all, file) => ({ ...all, ...parseEnvFile(file) }), {});
}

function envValue(key: string) {
  const fromFile = fileEnv()[key]?.trim();
  if (fromFile) return fromFile;
  const dynamic = process.env[key];
  return typeof dynamic === "string" ? dynamic.trim() : "";
}

function supabaseUrl() {
  return envValue("NEXT_PUBLIC_SUPABASE_URL");
}

function supabaseKey() {
  return envValue("SUPABASE_SERVICE_ROLE_KEY") || envValue("NEXT_PUBLIC_SUPABASE_ANON_KEY");
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
