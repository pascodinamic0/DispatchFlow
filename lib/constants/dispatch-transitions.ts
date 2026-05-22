import type { DispatchStatus } from "@/types";

export type DispatchTransitionAction = {
  status: DispatchStatus;
  label: string;
  variant?: "default" | "outline" | "destructive";
};

export const DISPATCH_TRANSITION_ACTIONS: Partial<
  Record<DispatchStatus, DispatchTransitionAction[]>
> = {
  pending: [
    { status: "assigned", label: "Mark assigned" },
    { status: "cancelled", label: "Cancel", variant: "destructive" },
  ],
  assigned: [
    { status: "in_transit", label: "Start transit" },
    { status: "failed", label: "Failed", variant: "destructive" },
  ],
  in_transit: [
    { status: "delivered", label: "Mark delivered" },
    { status: "failed", label: "Failed", variant: "destructive" },
  ],
  failed: [
    { status: "pending", label: "Reopen" },
    { status: "cancelled", label: "Cancel", variant: "destructive" },
  ],
};
