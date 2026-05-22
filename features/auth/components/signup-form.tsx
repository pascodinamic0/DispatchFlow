"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  signupSchema,
  type SignupFormValues,
} from "@/features/auth/schemas/signup-schema";
import { signUpWithPassword } from "@/services/auth.service";
import { getErrorMessage } from "@/lib/errors";
import { hasSupabaseEnv } from "@/lib/env";
import { OAuthButtons } from "@/features/auth/components/oauth-buttons";
import { AuthShell } from "@/components/layout/auth-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignupForm() {
  const router = useRouter();
  const configured = hasSupabaseEnv();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: SignupFormValues) {
    if (!configured) {
      toast.error("Supabase is not configured. Add credentials to .env.local.");
      return;
    }

    try {
      const { session } = await signUpWithPassword(values);
      if (session) {
        toast.success("Account created");
        router.push("/onboarding");
        router.refresh();
        return;
      }
      toast.success("Check your email to confirm your account, then sign in.");
      router.push("/login");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <AuthShell
      title="Create account"
      description="Sign up, then set up your organization profile"
    >
      <Card className="border-border/80 shadow-lg">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                disabled={!configured || isSubmitting}
                {...register("email")}
              />
              {errors.email ? (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                disabled={!configured || isSubmitting}
                {...register("password")}
              />
              {errors.password ? (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                disabled={!configured || isSubmitting}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword ? (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              ) : null}
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              By creating an account you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
            <Button
              type="submit"
              className="w-full"
              disabled={!configured || isSubmitting}
            >
              {isSubmitting ? "Creating account…" : "Create account"}
            </Button>
          </form>
          <div className="mt-6">
            <OAuthButtons mode="signup" />
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
