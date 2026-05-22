/**
 * Status badge styles — soft pills, high readability (brand spec).
 */

export const statusBadgeBase =
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-tight";

export const requestStatusStyles = {
  draft: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  submitted: "bg-amber-500/12 text-amber-800 dark:text-amber-300",
  approved: "bg-emerald-500/12 text-emerald-800 dark:text-emerald-400",
  rejected: "bg-red-500/12 text-red-700 dark:text-red-400",
  in_dispatch: "bg-blue-500/12 text-blue-800 dark:text-blue-300",
  delivered: "bg-emerald-500/12 text-emerald-800 dark:text-emerald-400",
  cancelled: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
} as const;

export const dispatchStatusStyles = {
  pending: "bg-amber-500/12 text-amber-800 dark:text-amber-300",
  assigned: "bg-blue-500/12 text-blue-800 dark:text-blue-300",
  in_transit: "bg-blue-500/12 text-blue-800 dark:text-blue-300",
  delivered: "bg-emerald-500/12 text-emerald-800 dark:text-emerald-400",
  failed: "bg-red-500/12 text-red-700 dark:text-red-400",
  cancelled: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
} as const;

export const chartStatusColors = {
  draft: "#94a3b8",
  submitted: "#f59e0b",
  approved: "#10b981",
  rejected: "#ef4444",
  in_dispatch: "#2563eb",
  delivered: "#10b981",
  cancelled: "#64748b",
  pending: "#f59e0b",
  assigned: "#3b82f6",
  in_transit: "#2563eb",
  failed: "#ef4444",
} as const;
