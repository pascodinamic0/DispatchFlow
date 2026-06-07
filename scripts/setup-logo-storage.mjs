/**
 * One-time logo storage setup for DispatchFlow.
 *
 * Usage:
 *   1. Add SUPABASE_SERVICE_ROLE_KEY to .env.local (Dashboard → Settings → API)
 *   2. node scripts/setup-logo-storage.mjs
 *   3. Paste scripts/apply-logo-storage.sql in Supabase SQL Editor if the script says so
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

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
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL in .env.local");
  process.exit(1);
}

const projectRef = url.replace("https://", "").split(".")[0];
const sqlEditor = `https://supabase.com/dashboard/project/${projectRef}/sql/new`;

console.log(`Project: ${url}\n`);

const admin = createClient(url, serviceKey ?? anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function checkLogoColumn() {
  const res = await fetch(
    `${url}/rest/v1/organizations?select=logo_url&limit=0`,
    {
      headers: {
        apikey: serviceKey ?? anonKey,
        Authorization: `Bearer ${serviceKey ?? anonKey}`,
      },
    },
  );
  const body = await res.text();
  const hasColumn = !body.includes("logo_url does not exist");
  console.log(
    hasColumn
      ? "✓ organizations.logo_url column exists"
      : "✗ organizations.logo_url column missing",
  );
  return hasColumn;
}

async function ensureBucket(id) {
  const { data: existing, error: getError } = await admin.storage.getBucket(id);
  if (!getError && existing) {
    console.log(`✓ Storage bucket "${id}" exists`);
    return true;
  }

  if (!serviceKey) {
    console.log(`✗ Storage bucket "${id}" missing (needs SUPABASE_SERVICE_ROLE_KEY to create)`);
    return false;
  }

  const { error } = await admin.storage.createBucket(id, {
    public: true,
    fileSizeLimit: 2097152,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  });

  if (error) {
    console.log(`✗ Could not create bucket "${id}": ${error.message}`);
    return false;
  }

  console.log(`✓ Created storage bucket "${id}"`);
  return true;
}

const hasColumn = await checkLogoColumn();
const hasOrgBucket = await ensureBucket("organization-logos");
const hasAvatarBucket = await ensureBucket("avatars");

if (!hasColumn || !hasOrgBucket || !hasAvatarBucket) {
  console.log("\nNext step:");
  console.log(`Open SQL Editor: ${sqlEditor}`);
  console.log("Run the full contents of: scripts/apply-logo-storage.sql");
  if (!serviceKey) {
    console.log(
      "\nTip: add SUPABASE_SERVICE_ROLE_KEY to .env.local, then re-run this script to auto-create buckets.",
    );
  }
  process.exit(1);
}

console.log("\nLogo storage is ready. Upload a company logo in Settings → Organization.");
