/**
 * SLA Rules Page (Server Component)
 * 
 * Settings > Workflow > SLA Rules
 * 
 * Single view with 4 vertically stacked sections:
 * 1. SLA Targets by Request Type (inline editing table)
 * 2. SLA Override Configuration (priority hierarchy + overrides table)
 * 3. Escalation Rules (4 toggle switches)
 * 4. First Pass Rate Metrics (target rates + tracking dimensions + performance)
 */

import { SLARulesBoundary } from '@/features/settings/components/sla-rules/sla-rules-boundary';
import { SLARulesContent } from '@/features/settings/components/sla-rules/sla-rules-content';

export default async function SLARulesPage() {
  return (
    <SLARulesBoundary>
      <SLARulesContent />
    </SLARulesBoundary>
  );
}
