"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionCard } from "./section-card";

const TASK_TYPES = [
  { value: "follow_up", label: "Follow-Up" },
  { value: "outreach", label: "Outreach" },
  { value: "verification", label: "Verification" },
  { value: "review", label: "Review" },
] as const;
const TASK_VARS = ["provider_name", "payer_name", "work_order_id", "days_waiting", "touch_number", "trigger_event"] as const;

const inputClass =
  "rounded-lg border border-border bg-background/5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";
const labelSmallClass = "block text-[10px] text-muted-foreground mb-1";

export interface TaskDefaultsSectionProps {
  taskType: string;
  onTaskTypeChange: (value: string) => void;
  estMins: number;
  onEstMinsChange: (value: number) => void;
}

export function TaskDefaultsSection({
  taskType,
  onTaskTypeChange,
  estMins,
  onEstMinsChange,
}: Readonly<TaskDefaultsSectionProps>) {
  return (
    <SectionCard title="Task Defaults" iconKey="checklist">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className={labelSmallClass}>Task Type</Label>
            <Select value={taskType} onValueChange={onTaskTypeChange}>
              <SelectTrigger className={cn(inputClass, "h-7 text-xs")} size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TASK_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className={labelSmallClass}>Est. Minutes</Label>
            <Input
              type="number"
              value={estMins}
              onChange={(e) => {
                const num = parseInt(e.target.value, 10);
                const val = Number.isNaN(num) ? 0 : num;
                e.target.value = String(val);
                onEstMinsChange(val);
              }}
              min={1}
              max={1440}
              className={cn(inputClass, "h-7 text-xs")}
            />
          </div>
        </div>
        <div className="p-2 rounded-lg bg-muted/50">
          <p className="text-xxs text-white/40 mb-1">Available Variables for Task Names:</p>
          <div className="flex flex-wrap gap-1">
            {TASK_VARS.map((v) => (
              <code
                key={v}
                className="px-1.5 py-0.5 rounded bg-primary/20 text-primary text-tiny cursor-pointer hover:bg-primary/30"
              >
                {"{" + v + "}"}
              </code>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
