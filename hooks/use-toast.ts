/**
 * Toast Hook
 *
 * Toast notification hook using Sonner for user feedback.
 */

"use client";

import { toast as sonnerToast } from "sonner";

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

/**
 * useToast - Toast notification hook using Sonner
 */
export function useToast() {
  const toast = (options: ToastOptions) => {
    const { title, description, variant = "default" } = options;

    if (variant === "destructive") {
      sonnerToast.error(title, {
        description,
        dismissible: true,
      });
    } else {
      sonnerToast.success(title, {
        description,
        dismissible: true,
      });
    }
  };

  return { toast };
}
