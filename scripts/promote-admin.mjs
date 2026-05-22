/**
 * Promote a user to org admin by email (requires SUPABASE_SERVICE_ROLE_KEY in .env.local).
 * Usage: node scripts/promote-admin.mjs pascal@dingi-digital-ll.com
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const email = process.argv[2]?.trim().toLowerCase();
if (!email) {
  console.error("Usage: node scripts/promote-admin.mjs <email>");
  process.exit(1);
}

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

if (!url || !serviceKey) {
  console.error(
    "Add SUPABASE_SERVICE_ROLE_KEY to .env.local (Dashboard → Settings → API → service_role).",
  );
  process.exit(1);
}

const headers = {
  apikey: serviceKey,
  Authorization: `Bearer ${serviceKey}`,
  "Content-Type": "application/json",
};

const usersRes = await fetch(
  `${url}/auth/v1/admin/users?per_page=200`,
  { headers },
);
if (!usersRes.ok) {
  console.error("Auth admin list failed:", usersRes.status, await usersRes.text());
  process.exit(1);
}

const { users } = await usersRes.json();
const user = users?.find((u) => u.email?.toLowerCase() === email);
if (!user) {
  console.error(`No auth user found for ${email}`);
  console.error(
    "Known emails:",
    users?.map((u) => u.email).filter(Boolean).join(", ") || "(none)",
  );
  process.exit(1);
}

const profileRes = await fetch(
  `${url}/rest/v1/profiles?id=eq.${user.id}&select=id,full_name,role,organization_id`,
  { headers },
);
if (!profileRes.ok) {
  console.error("Profile fetch failed:", profileRes.status, await profileRes.text());
  process.exit(1);
}

const profiles = await profileRes.json();
const profile = profiles?.[0];
if (!profile) {
  console.error(
    `User ${email} (${user.id}) exists but has no profile — complete onboarding first.`,
  );
  process.exit(1);
}

if (profile.role === "admin") {
  console.log(`${email} is already admin (${profile.full_name}).`);
  process.exit(0);
}

const patchRes = await fetch(`${url}/rest/v1/profiles?id=eq.${user.id}`, {
  method: "PATCH",
  headers: { ...headers, Prefer: "return=representation" },
  body: JSON.stringify({ role: "admin" }),
});

if (!patchRes.ok) {
  console.error("Profile update failed:", patchRes.status, await patchRes.text());
  process.exit(1);
}

const [updated] = await patchRes.json();
console.log(`Promoted ${email} to admin (${updated.full_name}, org ${updated.organization_id}).`);
