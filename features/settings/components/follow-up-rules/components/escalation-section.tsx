"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { SectionCard } from "./section-card";

const ESCALATE_TO = [
  { value: "team_lead", label: "Team Lead" },
  { value: "team_manager", label: "Team Manager" },
  { value: "client_contact", label: "Client Contact" },
  { value: "operations_manager", label: "Operations Manager" },
] as const;

const inputClass =
  "rounded-lg border border-border bg-background/5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";
const labelSmallClass = "text-xxs";

export interface EscalationSectionProps {
  escalationEnabled: boolean;
  onEscalationEnabledChange: (value: boolean) => void;
  escalateAfter: string;
  onEscalateAfterChange: (value: string) => void;
  escalateTo: string;
  onEscalateToChange: (value: string) => void;
  requiresApproval: boolean;
  onRequiresApprovalChange: (value: boolean) => void;
}

export function EscalationSection({
  escalationEnabled,
  onEscalationEnabledChange,
  escalateAfter,
  onEscalateAfterChange,
  escalateTo,
  onEscalateToChange,
  requiresApproval,
  onRequiresApprovalChange,
}: EscalationSectionProps) {
  return (
    <SectionCard title="Escalation Path" iconKey="trend">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-foreground/70">Enable Auto-Escalation</Label>
          <Switch checked={escalationEnabled} onCheckedChange={onEscalationEnabledChange} />
        </div>
        <div className={cn("space-y-3", !escalationEnabled && "opacity-50 pointer-events-none")}>
          <div>
            <Label className={labelSmallClass}>Escalate After # Touches</Label>
            <Select value={escalateAfter} onValueChange={onEscalateAfterChange}>
              <SelectTrigger className={cn(inputClass, "h-7 text-xs")} size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[2, 3, 4, 5].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} touches
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className={labelSmallClass}>Escalate To</Label>
            <Select value={escalateTo} onValueChange={onEscalateToChange}>
              <SelectTrigger className={cn(inputClass, "h-7 text-xs")} size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ESCALATE_TO.map((e) => (
                  <SelectItem key={e.value} value={e.value}>
                    {e.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label className={cn(labelSmallClass, "mb-0")}>Requires Approval to Close</Label>
            <Switch size="sm" checked={requiresApproval} onCheckedChange={onRequiresApprovalChange} />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
