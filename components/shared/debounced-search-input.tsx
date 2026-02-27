"use client";

import { useState, useEffect } from "react";
import type { ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

type DebouncedSearchInputProps = {
  value: string | null;
  onValueChange: (value: string) => void;
  placeholder?: string;
  delay?: number;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
  inputProps?: Omit<
    ComponentProps<typeof Input>,
    "value" | "onChange" | "type" | "placeholder" | "disabled" | "className"
  >;
};

/**
 * Debounced search input component
 *
 * Provides a search input that debounces the value changes to avoid
 * triggering too many updates while the user is typing
 *
 * @param value - Current search value from URL params
 * @param onValueChange - Callback when debounced value changes
 * @param placeholder - Input placeholder text
 * @param delay - Debounce delay in milliseconds (default: 500ms)
 * @param className - Additional CSS classes
 * @param disabled - Whether the input is disabled
 * @param ariaLabel - Accessible label for screen readers
 * @param inputProps - Additional input props for accessibility and form attributes
 */
export function DebouncedSearchInput({
  value,
  onValueChange,
  placeholder = "Search...",
  delay = 500,
  className,
  disabled = false,
  ariaLabel,
  inputProps,
}: Readonly<DebouncedSearchInputProps>) {
  // Local state for immediate UI updates
  const [localValue, setLocalValue] = useState(value ?? "");
  const debouncedValue = useDebouncedValue(localValue, delay);

  // Sync local value when external value changes (e.g. URL param cleared)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync controlled value from parent
    setLocalValue(value ?? "");
  }, [value]);

  // Trigger callback when debounced value changes
  useEffect(() => {
    if (debouncedValue !== (value ?? "")) {
      onValueChange(debouncedValue);
    }
  }, [debouncedValue, onValueChange, value]);

  // Show loading indicator when debouncing
  const isDebouncing = localValue !== debouncedValue;

  return (
    <div className="relative flex-1">
      <Input
        variant="primary"
        type="search"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className={cn(className)}
        disabled={disabled}
        {...(ariaLabel ? { "aria-label": ariaLabel } : {})}
        {...inputProps}
      />
      {isDebouncing && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <HugeiconsIcon
            icon={Loading03Icon}
            className="w-4 h-4 text-muted-foreground animate-spin"
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}
