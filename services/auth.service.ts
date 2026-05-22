import { createClient } from "@/lib/supabase/client";
import { AppError } from "@/lib/errors";
import type { LoginFormValues } from "@/features/auth/schemas/login-schema";
import type { SignupFormValues } from "@/features/auth/schemas/signup-schema";

export async function signUpWithPassword(values: SignupFormValues) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
  });

  if (error) {
    throw new AppError(error.message, error.code);
  }

  return { session: data.session, user: data.user };
}

export async function signInWithPassword(values: LoginFormValues) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  if (error) {
    throw new AppError(error.message, error.code);
  }

  return data;
}

export async function signInWithOAuth(provider: "google") {
  const supabase = createClient();
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    throw new AppError(error.message, error.code);
  }

  if (data.url) {
    window.location.href = data.url;
  }
}
