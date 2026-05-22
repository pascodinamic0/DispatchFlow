import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Used on public auth/marketing pages when middleware is not available. */
export async function redirectIfAuthenticated(
  destination = "/dashboard",
) {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(destination);
  }
}
