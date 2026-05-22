export function formatDate(iso: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  }).format(new Date(iso));
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatStatusLabel(status: string) {
  return status.replace(/_/g, " ");
}

export function formatPriority(priority: string) {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

const roleLabels: Record<string, string> = {
  admin: "Admin",
  dispatcher: "Dispatcher",
  procurement: "Procurement",
  requester: "Requester",
  viewer: "Viewer",
};

export function formatRole(role: string) {
  return roleLabels[role] ?? role;
}
