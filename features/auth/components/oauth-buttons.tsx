"use client";

import { useState } from "react";
import { toast } from "sonner";
import { signInWithOAuth } from "@/services/auth.service";
import { getErrorMessage } from "@/lib/errors";
import { hasSupabaseEnv } from "@/lib/env";
import { Button } from "@/components/ui/button";

type Props = {
  mode?: "login" | "signup";
};

export function OAuthButtons({ mode = "login" }: Props) {
  const [pending, setPending] = useState(false);
  const configured = hasSupabaseEnv();

  async function onGoogle() {
    if (!configured) {
      toast.error("Supabase is not configured.");
      return;
    }
    setPending(true);
    try {
      await signInWithOAuth("google");
    } catch (error) {
      toast.error(getErrorMessage(error));
      setPending(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with SSO
          </span>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={!configured || pending}
        onClick={onGoogle}
      >
        {pending
          ? "Redirecting…"
          : `${mode === "signup" ? "Sign up" : "Sign in"} with Google`}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Enable Google under Supabase → Authentication → Providers.
      </p>
    </div>
  );
}
