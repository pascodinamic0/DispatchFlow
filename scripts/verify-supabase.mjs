/**
 * Quick connectivity check for the Supabase project in .env.local
 * Usage: node scripts/verify-supabase.mjs
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const envPath = resolve(process.cwd(), ".env.local");
const env = Object.fromEntries(
  readFileSync(envPath, "utf8")
    .split("\n")
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const i = line.indexOf("=");
      return [line.slice(0, i), line.slice(i + 1)];
    }),
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
  process.exit(1);
}

const tables = [
  "organizations",
  "profiles",
  "procurement_requests",
  "dispatches",
  "inventory_items",
  "inventory_movements",
];

console.log(`Project: ${url}`);
console.log(`Auth: ${await fetch(`${url}/auth/v1/health`, { headers: { apikey: key } }).then((r) => r.status)}`);

for (const table of tables) {
  const res = await fetch(`${url}/rest/v1/${table}?select=*&limit=0`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  const body = await res.text();
  console.log(`${table}: HTTP ${res.status} ${body.slice(0, 80)}`);
}
