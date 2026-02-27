/**
 * Escalation Rules Section Component
 * 
 * Displays 4 escalation rules with toggle switches.
 * Each rule has a trigger, action description, and enabled/disabled state.
 */

'use client';

import { Switch } from '@/components/ui/switch';
import { useUpdateEscalationRules } from '@/features/settings/hooks/use-sla-rules';
import type { EscalationRules } from '@/features/settings/types/sla-rules';
import { EscalationRulesSkeleton } from './sla-rules-skeletons';

interface EscalationRulesSectionProps {
  rules: EscalationRules[];
  isLoading?: boolean;
}

export function EscalationRulesSection({ rules, isLoading = false }: Readonly<EscalationRulesSectionProps>) {
  const updateRules = useUpdateEscalationRules();

  const handleRuleToggle = (key: string, checked: boolean) => {
    if (!rules) return;

    updateRules.mutate(
      { id: key, status: checked }
    );
  };

  if (isLoading || !rules) {
    return <EscalationRulesSkeleton />;
  }

  return (
    <div className="rounded-xl bg-glass-bg backdrop-blur-(--glass-blur) border border-glass-border p-6">
      {/* Header */}
      <h3 className="text-base font-bold text-foreground mb-4">Escalation Rules</h3>

      {/* Rules Grid */}
      <div className="space-y-3">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="flex items-center justify-between p-4 rounded-xl bg-glass-bg border border-border-5"
          >
            {/* Rule Info */}
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{rule.name}</p>
              <p className="text-xs text-text-50 mt-0.5">{rule.description}</p>
            </div>

            {/* Toggle Switch */}
            <Switch
              checked={rule.status}
              onCheckedChange={(checked) => handleRuleToggle(rule.id, checked)}
              disabled={updateRules.isPending}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
