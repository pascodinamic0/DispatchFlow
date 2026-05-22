export const REQUEST_PRIORITIES = ["low", "normal", "high", "urgent"] as const;

export type RequestPriority = (typeof REQUEST_PRIORITIES)[number];

export const PRIORITY_LABELS: Record<RequestPriority, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
  urgent: "Urgent",
};
