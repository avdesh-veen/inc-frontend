"use client";

import { cn } from "@/lib/utils";

type FormSectionHeaderProps = Readonly<{
  title: string;
  className?: string;
}>;

export function FormSectionHeader({ title, className }: FormSectionHeaderProps) {
  return (
    <h2
      className={cn(
        "text-sm font-semibold uppercase tracking-wider mb-4",
        className,
      )}
    >
      {title}
    </h2>
  );
}
