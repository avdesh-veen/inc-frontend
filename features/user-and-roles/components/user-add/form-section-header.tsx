import { cn } from "@/lib/utils";
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react";

export function FormSectionHeader({
  title,
  icon,
  className,
}: Readonly<{
  title: string;
  icon: IconSvgElement;
  className?: string;
}>) {
  return (
    <div
      className={cn(
        "text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2",
        className,
      )}
    >
      <HugeiconsIcon icon={icon} className="size-4" />
      <h2 className="text-sm">{title}</h2>
    </div>
  );
}
