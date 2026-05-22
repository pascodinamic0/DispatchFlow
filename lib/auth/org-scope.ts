export function assertOrgMatch(
  entityOrgId: string | null | undefined,
  profileOrgId: string,
  message = "Resource not found",
): void {
  if (!entityOrgId || entityOrgId !== profileOrgId) {
    throw new Error(message);
  }
}
