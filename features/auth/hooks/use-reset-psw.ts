"use client";

import { useMutation } from "@tanstack/react-query";
import type { ResetPswRequest, ResetPswResponse } from "../types";
import { ApiResponse } from "@/lib/api/types";
import { logger } from "@/lib/logger";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { resetPassword } from "../api/reset/server";

interface UseResetPswOptions {
  onSuccess?: () => void;
}

/**
 * Hook to handle reset password request
 *
 * On success:
 * - Shows success toast with message
 * - Redirects to login page
 * - Calls optional onSuccess callback
 *
 * @param options - Optional callbacks for mutation lifecycle
 * @returns Mutation hook for reset password operation
 */
export function useResetPsw(options?: UseResetPswOptions) {
  const { toast } = useToast();
  const router = useRouter();

  return useMutation<ApiResponse<ResetPswResponse>, Error, ResetPswRequest>({
    mutationFn: (data) => resetPassword(data),
    onSuccess: (response) => {
      if (!response.status) {
        toast({
          title: "Reset password failed",
          description: Array.isArray(response.message)
            ? response.message.join(", ")
            : response.message,
          variant: "destructive",
        });
        return;
      } else {
        toast({
          title: "Password reset successful",
          description: Array.isArray(response.message)
            ? response.message.join(", ")
            : response.message,
        });
        options?.onSuccess?.();
        router.push("/login");
      }
    },
    onError: (error) => {
      logger(String(error), { error });
      toast({
        title: "Reset password failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
