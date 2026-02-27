"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { SectionCard } from "./section-card";

const inputClass =
  "rounded-lg border border-border bg-background/5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";
const labelSmallClass = "text-xxs";

export interface AutoCloseSectionProps {
  autoCloseEnabled: boolean;
  onAutoCloseEnabledChange: (value: boolean) => void;
  autoCloseDays: number;
  onAutoCloseDaysChange: (value: number) => void;
  maxAttempts: number;
  onMaxAttemptsChange: (value: number) => void;
}

export function AutoCloseSection({
  autoCloseEnabled,
  onAutoCloseEnabledChange,
  autoCloseDays,
  onAutoCloseDaysChange,
  maxAttempts,
  onMaxAttemptsChange,
}: Readonly<AutoCloseSectionProps>) {
  return (
    <SectionCard title="Auto-Close Settings" iconKey="clock">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-foreground/70">Auto-Close on No Response</Label>
          <Switch checked={autoCloseEnabled} onCheckedChange={onAutoCloseEnabledChange} />
        </div>
        <div className={cn("grid grid-cols-2 gap-2", !autoCloseEnabled && "opacity-50 pointer-events-none")}>
          <div>
            <Label className={labelSmallClass}>After Days</Label>
            <Input
              type="number"
              value={autoCloseDays}
              onChange={(e) => {
                const num = parseInt(e.target.value, 10);
                const val = Number.isNaN(num) ? 0 : num;
                e.target.value = String(val);
                onAutoCloseDaysChange(val);
              }}
              min={1}
              max={365}
              className={cn(inputClass, "h-7 text-xs")}
            />
          </div>
          <div>
            <Label className={labelSmallClass}>Max Attempts</Label>
            <Input
              type="number"
              value={maxAttempts}
              onChange={(e) => {
                const num = parseInt(e.target.value, 10);
                const val = Number.isNaN(num) ? 0 : num;
                e.target.value = String(val);
                onMaxAttemptsChange(val);
              }}
              min={1}
              max={20}
              className={cn(inputClass, "h-7 text-xs")}
            />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
