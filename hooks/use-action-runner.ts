"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errors";

type ActionResult = { error?: string };

export function useActionRunner() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function run(
    action: () => Promise<ActionResult>,
    options?: {
      successMessage?: string;
      onSuccess?: (result: ActionResult) => void;
    },
  ) {
    startTransition(async () => {
      try {
        const result = await action();
        if (result.error) {
          toast.error(result.error);
          return;
        }
        if (options?.successMessage) {
          toast.success(options.successMessage);
        }
        options?.onSuccess?.(result);
        router.refresh();
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    });
  }

  return { pending, run, startTransition };
}
