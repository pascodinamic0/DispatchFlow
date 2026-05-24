"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

/** Full navigation so the next Server Component request includes auth cookies. */
function goToNext(path: string) {
  const destination = path.startsWith("/") ? path : `/${path}`;
  window.location.assign(destination);
}

export function AuthConfirmClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/onboarding";
  const [message, setMessage] = useState("Completing sign-in…");

  useEffect(() => {
    const supabase = createClient();

    async function completeAuth() {
      const query = new URLSearchParams(window.location.search);
      const code = query.get("code");
      const tokenHash = query.get("token_hash");
      const type = query.get("type");

      if (tokenHash && type) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as EmailOtpType,
        });
        if (!error) {
          goToNext(next);
          return;
        }
        setMessage(error.message);
        return;
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          goToNext(next);
          return;
        }
        setMessage(error.message);
        return;
      }

      const hash = window.location.hash.replace(/^#/, "");
      if (hash) {
        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (!error) {
            window.history.replaceState(
              null,
              "",
              `${window.location.pathname}${window.location.search}`,
            );
            goToNext(next);
            return;
          }

          setMessage(error.message);
          return;
        }
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        goToNext(next);
        return;
      }

      setMessage("Could not complete sign-in. Try the invite link again or sign up.");
      router.replace("/login?error=auth_confirm");
    }

    void completeAuth();
  }, [next, router]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-2 p-6 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
