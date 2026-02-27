"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { LockIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

/**
 * Full 403 Forbidden page for permission-denied route access
 *
 * This component displays a full-page error state when a user tries to access
 * a route they don't have permission for. It includes navigation options to
 * go home or go back to the previous page.
 *
 * @example
 * // Use in a page or error boundary
 * export default function ForbiddenPage() {
 *   return <PermissionDeniedPage />;
 * }
 *
 * @example
 * // Use in an error boundary
 * if (error.status === 403) {
 *   return <PermissionDeniedPage />;
 * }
 */
export function PermissionDeniedPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="text-center space-y-6 max-w-md px-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-muted p-6">
            <HugeiconsIcon
              icon={LockIcon}
              className="size-12 text-muted-foreground"
            />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            403 - Access Denied
          </h1>
          <p className="text-muted-foreground">
            You don&apos;t have permission to view this page.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            If you believe you should have access, please contact your manager
            or system administrator.
          </p>

          <div className="flex gap-3 justify-center">
            <Button onClick={() => router.push("/")} variant="default">
              Go to Home
            </Button>
            <Button onClick={() => router.back()} variant="outline">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
