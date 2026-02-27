"use client";

import { useMutation } from "@tanstack/react-query";
import type { ForgotPswRequest, ForgotPswResponse } from "../types";
import { ApiResponse } from "@/lib/api/types";
import { logger } from "@/lib/logger";
import { useToast } from "@/hooks/use-toast";
import { forgotPassword } from "../api/forgot/server";

interface UseForgotPswOptions {
  onSuccess?: () => void;
}

/**
 * Hook to handle forgot password request
 *
 * On success:
 * - Shows success toast with message
 * - Calls optional onSuccess callback (e.g., to reset form)
 *
 * @param options - Optional callbacks for mutation lifecycle
 * @returns Mutation hook for forgot password operation
 */
export function useForgotPsw(options?: UseForgotPswOptions) {
  const { toast } = useToast();

  return useMutation<ApiResponse<ForgotPswResponse>, Error, ForgotPswRequest>({
    mutationFn: (data) => forgotPassword(data),
    onSuccess: (response) => {
      if (!response.status) {
        toast({
          title: "Forgot password failed",
          description: Array.isArray(response.message)
            ? response.message.join(", ")
            : response.message,
          variant: "destructive",
        });
        return;
      } else {
        toast({
          title: "Forgot password successful",
          description: Array.isArray(response.message)
            ? response.message.join(", ")
            : response.message,
        });
        options?.onSuccess?.();
      }
    },
    onError: (error) => {
      logger(String(error), { error });
      toast({
        title: "Forgot password failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
