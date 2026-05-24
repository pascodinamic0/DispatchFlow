import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site-url";

const INVITE_NEXT = "/onboarding";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/dashboard";
  const siteUrl = getSiteUrl();

  const supabase = await createClient();

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as EmailOtpType,
    });

    if (!error) {
      const destination =
        type === "invite" || type === "signup" ? INVITE_NEXT : next;
      return NextResponse.redirect(`${siteUrl}${destination}`);
    }
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const meta = user?.user_metadata as Record<string, unknown> | undefined;
      const invited = Boolean(meta?.invited);
      let destination = next.startsWith("/") ? next : `/${next}`;
      if (invited && (destination === "/dashboard" || destination === "dashboard")) {
        destination = INVITE_NEXT;
      }
      return NextResponse.redirect(`${siteUrl}${destination}`);
    }
  }

  return NextResponse.redirect(
    `${siteUrl}/login?error=auth_callback`,
  );
}
