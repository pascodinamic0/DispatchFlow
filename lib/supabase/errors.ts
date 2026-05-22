import { AppError } from "@/lib/errors";

export function mapSupabaseError(error: { message: string; code?: string }): AppError {
  if (error.code === "23505") {
    return new AppError("A record with this value already exists.", error.code);
  }
  if (error.code === "42501") {
    return new AppError("You do not have permission to perform this action.", error.code);
  }
  return new AppError(error.message, error.code);
}
