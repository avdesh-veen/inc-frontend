import * as React from "react";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";

interface SettingsHeaderProps {
  title: string;
  description: string;
  onAddClick?: () => void;
  addButtonLabel?: string;
  rightSlot?: React.ReactNode;
}

export function SettingsHeader({
  title,
  description,
  onAddClick,
  addButtonLabel = "Add Trigger Event",
  rightSlot,
}: Readonly<SettingsHeaderProps>) {
  let rightContent: React.ReactNode = null;
  if (rightSlot) {
    rightContent = (
      <div className="flex items-center justify-end gap-2">{rightSlot}</div>
    );
  } else if (onAddClick) {
    rightContent = (
      <Button onClick={onAddClick} variant='tertiaryMuted'>
        <HugeiconsIcon
          icon={Add01Icon}
          className="size-4"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        {addButtonLabel}
      </Button>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-lg font-bold text-foreground">{title}</h1>
          <p className="text-sm text-white/50">{description}</p>
        </div>
        {rightContent}
      </div>
    </>
  );
}
