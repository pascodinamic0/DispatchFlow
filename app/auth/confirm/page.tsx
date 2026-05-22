import { Suspense } from "react";
import { AuthConfirmClient } from "@/features/auth/components/auth-confirm-client";

export default function AuthConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center p-6 text-sm text-muted-foreground">
          Completing sign-in…
        </div>
      }
    >
      <AuthConfirmClient />
    </Suspense>
  );
}
