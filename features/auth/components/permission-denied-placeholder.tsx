import { HugeiconsIcon } from "@hugeicons/react";
import { LockIcon } from "@hugeicons/core-free-icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PermissionDeniedPlaceholderProps {
  title?: string;
  message?: string;
}

/**
 * Inline placeholder shown when content is permission-restricted
 *
 * This component displays a muted alert with a lock icon to indicate
 * that the user doesn't have permission to view the content.
 *
 * @param title - Optional custom title (default: "Access Restricted")
 * @param message - Optional custom message (default: "You don't have permission to view this content.")
 *
 * @example
 * // Default usage
 * <PermissionDeniedPlaceholder />
 *
 * @example
 * // Custom title and message
 * <PermissionDeniedPlaceholder
 *   title="Feature Locked"
 *   message="This feature requires additional permissions. Contact your administrator."
 * />
 */
export function PermissionDeniedPlaceholder({
  title = "Access Restricted",
  message = "You don't have permission to view this content.",
}: Readonly<PermissionDeniedPlaceholderProps>) {
  return (
    <Alert className="border-muted">
      <HugeiconsIcon icon={LockIcon} strokeWidth={2} className="size-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="text-muted-foreground">
        {message}
      </AlertDescription>
    </Alert>
  );
}
