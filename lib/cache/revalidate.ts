import { revalidatePath } from "next/cache";

function revalidateNotifications() {
  revalidatePath("/notifications");
}

export function revalidateRequests(requestId?: string) {
  revalidatePath("/requests");
  revalidatePath("/dashboard");
  revalidateNotifications();
  if (requestId) revalidatePath(`/requests/${requestId}`);
}

export function revalidateDispatches(dispatchId?: string, requestId?: string) {
  revalidatePath("/dispatches");
  revalidatePath("/dashboard");
  revalidateNotifications();
  if (dispatchId) revalidatePath(`/dispatches/${dispatchId}`);
  if (requestId) {
    revalidatePath("/requests");
    revalidatePath(`/requests/${requestId}`);
  }
}

export function revalidateInventory(itemId?: string) {
  revalidatePath("/inventory");
  revalidatePath("/dashboard");
  if (itemId) revalidatePath(`/inventory/${itemId}`);
}
