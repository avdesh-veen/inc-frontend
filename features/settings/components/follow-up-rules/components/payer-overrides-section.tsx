"use client";

import { useState, useCallback } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { GlobeIcon, Mail01Icon, PrinterIcon, TelephoneIcon } from "@hugeicons/core-free-icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionCard } from "./section-card";
import { useFollowUpRulesPayersOptions } from "@/features/settings/hooks/use-follow-up-rules";
import type { CreateFollowUpRulePayerOverridePayload } from "@/features/settings/types";
import { cn } from "@/lib/utils";

const DEFAULT_CHANNEL = "__default__";
const OVERRIDE_CHANNELS = [
  { value: DEFAULT_CHANNEL, label: "Use default channel", icon: null },
  { value: "email", label: "Email", icon: Mail01Icon },
  { value: "phone", label: "Phone", icon: TelephoneIcon },
  { value: "fax", label: "Fax", icon: PrinterIcon },
  { value: "portal", label: "Portal", icon: GlobeIcon },
] as const;
const inputClass = "rounded-lg border border-border bg-background/5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 w-full";
const labelClass = "block text-xs text-muted-foreground mb-1";

export interface PayerOverridesSectionProps {
  overrides: CreateFollowUpRulePayerOverridePayload[];
  onAddOverride: (override: CreateFollowUpRulePayerOverridePayload) => void;
  onRemoveOverride: (index: number) => void;
}

type PayerOverrideRowProps = {
  override: CreateFollowUpRulePayerOverridePayload;
  payerName: string;
  onRemove: () => void;
};

function PayerOverrideRow({
  override,
  payerName,
  onRemove,
}: Readonly<PayerOverrideRowProps>) {
  const summary = [
    `${override.overrideDays} days`,
    override.overrideChannel || null,
    override.reason ? `— ${override.reason}` : null,
  ].filter(Boolean).join(" ");

  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs">
      <div className="min-w-0 flex-1">
        <span className="font-medium text-foreground">{payerName}</span>
        {summary && <span className="text-muted-foreground ml-1 truncate block">{summary}</span>}
      </div>
      <Button type="button" variant="ghost" size="icon-sm" className="shrink-0 text-muted-foreground hover:text-destructive" onClick={onRemove} aria-label="Remove payer override">
        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </Button>
    </div>
  );
}

export function PayerOverridesSection({ overrides, onAddOverride, onRemoveOverride }: Readonly<PayerOverridesSectionProps>) {
  const [modalOpen, setModalOpen] = useState(false);
  const [payerId, setPayerId] = useState("");
  const [overrideDays, setOverrideDays] = useState(14);
  const [overrideChannel, setOverrideChannel] = useState(DEFAULT_CHANNEL);
  const [reason, setReason] = useState("");
  const { options: payers } = useFollowUpRulesPayersOptions();

  const getPayerName = (id: string) => payers.find((p) => p.id === id)?.name ?? id;

  const resetForm = useCallback(() => {
    setPayerId("");
    setOverrideDays(14);
    setOverrideChannel(DEFAULT_CHANNEL);
    setReason("");
  }, []);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) resetForm();
      setModalOpen(open);
    },
    [resetForm],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!payerId.trim()) return;
      onAddOverride({
        payerId: payerId.trim(),
        overrideDays: Math.min(90, Math.max(1, overrideDays)),
        overrideChannel: overrideChannel === DEFAULT_CHANNEL ? "default" : overrideChannel.trim(),
        reason: reason.trim(),
      });
      resetForm();
      setModalOpen(false);
    },
    [payerId, overrideDays, overrideChannel, reason, onAddOverride, resetForm],
  );

  return (
    <SectionCard title="Payer Overrides" iconKey="building">
      <p className="text-xxs text-white/40 mb-3">
        Customize timing for specific payers who have different response patterns.
      </p>
      {overrides.length > 0 && (
        <ul className="space-y-2 mb-3">
          {overrides.map((override, index) => (
            <li key={`${override.payerId}-${index}`}>
              <PayerOverrideRow override={override} payerName={getPayerName(override.payerId)} onRemove={() => onRemoveOverride(index)} />
            </li>
          ))}
        </ul>
      )}
      <Button type="button" variant="outline" className="w-full py-2 rounded-lg border border-dashed border-white/20 text-white/40 text-xs hover:border-white/40 hover:text-white/60" onClick={() => setModalOpen(true)}>
        + Add Payer Override
      </Button>
      <Dialog open={modalOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader>
            <DialogTitle>Add Payer Override</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className={cn(labelClass)}>Payer <span className="text-destructive">*</span></Label>
              <Select value={payerId} onValueChange={setPayerId}>
                <SelectTrigger className={cn(inputClass, "h-9")}><SelectValue placeholder="Select Payer..." /></SelectTrigger>
                <SelectContent>
                  {payers.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className={cn(labelClass)}>Override Days <span className="text-destructive">*</span></Label>
              <Input type="number" min={1} max={90} value={overrideDays} onChange={(e) => setOverrideDays(parseInt(e.target.value, 10) || 1)} className={cn(inputClass, "h-9")} />
            </div>
            <div>
              <Label className={cn(labelClass)}>Override Channel (optional)</Label>
              <Select value={overrideChannel} onValueChange={setOverrideChannel}>
                <SelectTrigger className={cn(inputClass, "h-9")}>
                  {(() => {
                    const selected = OVERRIDE_CHANNELS.find((c) => c.value === overrideChannel);
                    return selected?.icon ? (
                      <span className="flex items-center gap-1.5">
                        <HugeiconsIcon icon={selected.icon} className="size-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
                        {selected.label}
                      </span>
                    ) : (
                      <SelectValue placeholder="Use default channel" />
                    );
                  })()}
                </SelectTrigger>
                <SelectContent>
                  {OVERRIDE_CHANNELS.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.icon && (
                        <HugeiconsIcon icon={c.icon} className="size-3.5" strokeWidth={1.5} aria-hidden />
                      )}
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className={cn(labelClass)}>Reason</Label>
              <Textarea rows={2} placeholder="e.g., Medicare has longer processing..." value={reason} onChange={(e) => setReason(e.target.value)} className={cn(inputClass, "resize-none")} />
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={!payerId.trim()}>Add</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </SectionCard>
  );
}
