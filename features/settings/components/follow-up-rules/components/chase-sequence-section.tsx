"use client";

import { Button } from "@/components/ui/button";
import type { ChaseTouch } from "@/features/settings/types";
import { ChaseTouchCard } from "./chase-touch-card";
import { SectionCard } from "./section-card";

function PlusIcon() {
  return (
    <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

export interface ChaseSequenceSectionProps {
  touches: ChaseTouch[];
  onAddTouch: () => void;
  onRemoveTouch: (index: number) => void;
  onUpdateTouch: (index: number, field: keyof ChaseTouch, value: string | number) => void;
  /** Name of the selected trigger event (e.g. "Submitted to Payer") for labels and placeholders */
  triggerEventName?: string;
}

export function ChaseSequenceSection({
  touches,
  onAddTouch,
  onRemoveTouch,
  onUpdateTouch,
  triggerEventName,
}: Readonly<ChaseSequenceSectionProps>) {
  const lastTouch = touches[touches.length - 1];
  const afterLabel = triggerEventName
    ? `Days after "${triggerEventName}"`
    : "Days";

  return (
    <SectionCard
      title="Chase Sequence"
      iconKey="copy"
      action={
        <Button
          type="button"
          variant="secondaryMuted"
          size="xs" className="rounded-md"
          onClick={onAddTouch}
        >
          <PlusIcon />
          Add Touch
        </Button>
      }
    >
      <p className="text-xxs text-white/40 mb-4">
        {triggerEventName
          ? `Define escalating follow-up touches after "${triggerEventName}". Each touch creates a task at the specified interval.`
          : "Define escalating follow-up touches. Each touch creates a task at the specified interval."}
      </p>
      <div className="space-y-3">
        {touches.map((touch, idx) => (
          <ChaseTouchCard
            key={idx}
            touch={touch}
            index={idx}
            onUpdate={(field, value) => onUpdateTouch(idx, field, value)}
            onRemove={touches.length > 1 ? () => onRemoveTouch(idx) : undefined}
            triggerEventName={triggerEventName}
            daysLabel={afterLabel}
          />
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-xxs text-white/40 mb-2">Timeline Preview</p>
        <div className="flex items-center gap-1">
          <div className="size-3 rounded-full bg-amber-500 shrink-0" />
          <div className="flex-1 h-0.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded" />
          <div className="flex flex-col items-center">
            <div className="size-4 rounded-full bg-amber-500 flex items-center justify-center text-micro text-white font-bold">
              {touches.length}
            </div>
            <span className="text-micro text-white/40 mt-1">
              D{lastTouch?.daysAfterTrigger ?? 0}
            </span>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
