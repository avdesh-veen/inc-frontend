"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SectionCard } from "./section-card";

export interface NotificationsSectionProps {
  notifyOnCreate: boolean;
  onNotifyOnCreateChange: (value: boolean) => void;
  notifyOnEscalation: boolean;
  onNotifyOnEscalationChange: (value: boolean) => void;
  notifyClient: boolean;
  onNotifyClientChange: (value: boolean) => void;
}

export function NotificationsSection({
  notifyOnCreate,
  onNotifyOnCreateChange,
  notifyOnEscalation,
  onNotifyOnEscalationChange,
  notifyClient,
  onNotifyClientChange,
}: NotificationsSectionProps) {
  return (
    <SectionCard title="Notifications" iconKey="bell">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-foreground/70">Notify on Task Creation</Label>
          <Switch size="sm" checked={notifyOnCreate} onCheckedChange={onNotifyOnCreateChange} />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs text-foreground/70">Notify on Escalation</Label>
          <Switch size="sm" checked={notifyOnEscalation} onCheckedChange={onNotifyOnEscalationChange} />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs text-foreground/70">Notify Client Contact</Label>
          <Switch size="sm" checked={notifyClient} onCheckedChange={onNotifyClientChange} />
        </div>
      </div>
    </SectionCard>
  );
}
