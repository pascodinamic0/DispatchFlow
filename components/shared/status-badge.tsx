import { cn } from "@/lib/utils";
import {
  DISPATCH_STATUS_LABELS,
  REQUEST_STATUS_LABELS,
} from "@/lib/constants/statuses";
import {
  dispatchStatusStyles,
  requestStatusStyles,
  statusBadgeBase,
} from "@/lib/status-styles";
import type { DispatchStatus, RequestStatus } from "@/types";

type RequestBadgeProps = {
  domain: "request";
  status: RequestStatus;
};

type DispatchBadgeProps = {
  domain: "dispatch";
  status: DispatchStatus;
};

type StatusBadgeProps = RequestBadgeProps | DispatchBadgeProps;

export function StatusBadge(props: StatusBadgeProps) {
  if (props.domain === "request") {
    return (
      <span className={cn(statusBadgeBase, requestStatusStyles[props.status])}>
        {REQUEST_STATUS_LABELS[props.status]}
      </span>
    );
  }

  return (
    <span className={cn(statusBadgeBase, dispatchStatusStyles[props.status])}>
      {DISPATCH_STATUS_LABELS[props.status]}
    </span>
  );
}

/** @deprecated Use `<StatusBadge domain="request" status={...} />` */
export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  return <StatusBadge domain="request" status={status} />;
}

/** @deprecated Use `<StatusBadge domain="dispatch" status={...} />` */
export function DispatchStatusBadge({ status }: { status: DispatchStatus }) {
  return <StatusBadge domain="dispatch" status={status} />;
}
