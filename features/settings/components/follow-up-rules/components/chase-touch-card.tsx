"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { GlobeIcon, Mail01Icon, PrinterIcon, TelephoneIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { ChaseTouch } from "@/features/settings/types";

const CHANNELS = [
  { value: "email", label: "Email", icon: Mail01Icon },
  { value: "phone", label: "Phone", icon: TelephoneIcon },
  { value: "portalCheck", label: "Portal Check", icon: GlobeIcon },
  { value: "fax", label: "Fax", icon: PrinterIcon },
] as const;
const PRIORITIES = ["low", "medium", "high", "critical"] as const;
const ASSIGN_TO = [
  { value: "case_owner", label: "Case Owner" },
  { value: "team_lead", label: "Team Lead" },
  { value: "skill_matched", label: "Skill-Matched" },
  { value: "round_robin", label: "Round Robin" },
] as const;

const inputClass =
  "rounded-lg border border-border bg-background/5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 h-7.5 text-xs py-1.5 px-2";
const touchLabelClass = "block text-[9px] text-white/40 mb-1";

export interface ChaseTouchCardProps {
  touch: ChaseTouch;
  index: number;
  onUpdate: (field: keyof ChaseTouch, value: string | number) => void;
  /** Called when the remove button is clicked. When undefined, the button is hidden. */
  onRemove?: () => void;
  /** Name of the selected trigger event for placeholder */
  triggerEventName?: string;
  /** Label for the days field (e.g. "Days after trigger") */
  daysLabel?: string;
}

export function ChaseTouchCard({
  touch,
  index,
  onUpdate,
  onRemove,
  triggerEventName,
  daysLabel = "Days",
}: ChaseTouchCardProps) {
  const taskNamePlaceholder = triggerEventName
    ? `Follow up on ${triggerEventName}`
    : "Follow up on trigger event";

  return (
    <div className="p-3 rounded-xl bg-white/3 border border-white/10 hover:border-white/20 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="size-6 rounded-full bg-amber-500/30 text-amber-300 flex items-center justify-center text-xs font-bold">
            {index + 1}
          </span>
          <span className="text-sm font-medium">Touch {index + 1}</span>
        </div>
        {onRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-6 rounded-md text-white/40 hover:text-rose-400 hover:bg-rose-500/10"
            onClick={onRemove}
            aria-label={`Remove touch ${index + 1}`}
          >
            <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className={touchLabelClass}>{daysLabel}</Label>
          <Input
            type="number"
            value={touch.daysAfterTrigger}
            onChange={(e) => {
              const num = parseInt(e.target.value, 10);
              const val = Number.isNaN(num) ? 0 : num;
              e.target.value = String(val);
              onUpdate("daysAfterTrigger", val);
            }}
            min={1}
            max={365}
            className={cn(inputClass, "")}
          />
        </div>
        <div>
          <Label className={touchLabelClass}>Channel</Label>
          <Select
            value={touch.channel}
            onValueChange={(v) => onUpdate("channel", v)}
          >
            <SelectTrigger className={cn(inputClass, "")} size="sm">
              {(() => {
                const selected = CHANNELS.find((c) => c.value === touch.channel);
                return selected ? (
                  <span className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={selected.icon} className="size-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
                    {selected.label}
                  </span>
                ) : (
                  <SelectValue />
                );
              })()}
            </SelectTrigger>
            <SelectContent>
              {CHANNELS.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  <HugeiconsIcon icon={c.icon} className="size-3.5" strokeWidth={1.5} aria-hidden />
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className={touchLabelClass}>Priority</Label>
          <Select
            value={touch.priority}
            onValueChange={(v) => onUpdate("priority", v)}
          >
            <SelectTrigger className={cn(inputClass, "")} size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITIES.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className={touchLabelClass}>Assign To</Label>
          <Select
            value={touch.assignTo}
            onValueChange={(v) => onUpdate("assignTo", v)}
          >
            <SelectTrigger className={cn(inputClass, "")} size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ASSIGN_TO.map((a) => (
                <SelectItem key={a.value} value={a.value}>
                  {a.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2">
          <Label className={touchLabelClass}>Task Name</Label>
          <Input
            value={touch.taskName}
            onChange={(e) => onUpdate("taskName", e.target.value)}
            placeholder={taskNamePlaceholder}
            maxLength={100}
            className={cn(inputClass, "")}
          />
        </div>
      </div>
    </div>
  );
}
