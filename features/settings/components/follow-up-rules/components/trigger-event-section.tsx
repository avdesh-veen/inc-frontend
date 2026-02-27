"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useFollowUpRulesPayersOptions,
  useFollowUpRulesTriggerEventsOptions,
  useFollowUpRulesStatesOptions,
} from "@/features/settings/hooks/use-follow-up-rules";
import { cn } from "@/lib/utils";
import { SectionCard } from "./section-card";

function ChevronIcon({ open }: { open?: boolean }) {
  return (
    <svg
      className={cn("size-3 transition-transform", open && "rotate-90")}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}

export interface TriggerEventSectionProps {
  triggerEvent: string;
  onTriggerEventChange: (value: string) => void;
  payerType: string;
  onPayerTypeChange: (value: string) => void;
  state: string;
  onStateChange: (value: string) => void;
  manageEventsHref?: string;
}

export function TriggerEventSection({
  triggerEvent,
  onTriggerEventChange,
  payerType,
  onPayerTypeChange,
  state,
  onStateChange,
  manageEventsHref = "/settings/workflow/trigger-events",
}: Readonly<TriggerEventSectionProps>) {
  const [conditionsOpen, setConditionsOpen] = useState(false);
  const { options: triggerEvents, isLoading: isLoadingTriggerEvents } =
    useFollowUpRulesTriggerEventsOptions();
  const { options: payers } = useFollowUpRulesPayersOptions();
  const { options: states } = useFollowUpRulesStatesOptions();
  const payerOptions = [{ id: "all", name: "All Payers" }, ...payers];
  const stateOptions = [{ id: "all", name: "All States" }, ...states];

  return (
    <SectionCard title="Trigger Event" iconKey="lightning">
      <div className="space-y-3">
        <div>
          <Label>
            When this happens *{" "}
            <Link
              href={manageEventsHref}
              className="text-blue-400 hover:text-blue-300"
            >
              Manage Events
            </Link>
          </Label>
          {isLoadingTriggerEvents ? (
            <Skeleton className="h-10 w-full rounded-md" />
          ) : (
            <Select value={triggerEvent} onValueChange={onTriggerEventChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select trigger event..." />
              </SelectTrigger>
              <SelectContent>
                {triggerEvents.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="text-xxs text-blue-300">
            <strong>Tip:</strong> For expiration-based triggers, use negative
            days in the sequence (e.g., -30 = 30 days before)
          </div>
        </div>
        <Collapsible open={conditionsOpen} onOpenChange={setConditionsOpen}>
          <CollapsibleTrigger className="flex items-center text-left gap-2 cursor-pointer text-xs text-white/50 hover:text-white w-full">
            <ChevronIcon open={conditionsOpen} />
            Additional Conditions (optional)
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-3 space-y-2 pl-5">
              <div>
                <Label className="text-xxs">Filter by Payer Type</Label>
                <Select value={payerType} onValueChange={onPayerTypeChange}>
                  <SelectTrigger size="xs">
                    <SelectValue placeholder="All Payers" />
                  </SelectTrigger>
                  <SelectContent>
                    {payerOptions.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xxs">Filter by State</Label>
                <Select value={state} onValueChange={onStateChange}>
                  <SelectTrigger size="xs">
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent>
                    {stateOptions.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </SectionCard>
  );
}
