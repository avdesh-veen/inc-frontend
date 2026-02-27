/**
 * Routing Rules Content Component (Client)
 *
 * Displays DMN routing decision table and assignment trigger events.
 * Uses shadcn/ui components for table and dialogs.
 */

'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon, AlertCircleIcon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RoutingRulesTable } from './routing-rules-table';
import { TriggerEventsDisplay } from './trigger-events-display';
import { RoutingRuleFormDrawer } from './routing-rule-form-dialog';
import { useAssignmentStore } from '@/features/settings/hooks/use-assignment-store';
import { useRoutingRules } from '@/features/settings/hooks/use-assignment';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export function RoutingRulesContent() {
  const { openRoutingRuleForm } = useAssignmentStore();
  const [page, setPage] = React.useState(DEFAULT_PAGE);

  const { data: routingRulesResponse, isLoading, isFetching } = useRoutingRules({
    page,
    limit: DEFAULT_LIMIT,
  });

  const rules = routingRulesResponse?.data?.items ?? [];
  const meta = routingRulesResponse?.data?.meta;

  const handleAddRule = () => {
    openRoutingRuleForm();
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
        <div className="flex items-start gap-3">
          <HugeiconsIcon
            icon={AlertCircleIcon}
            className="w-5 h-5 text-cyan-400 mt-0.5"
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-medium text-cyan-300">DMN Routing Decision Table</p>
            <p className="text-xs text-text-70 mt-1">
              This table determines how new cases are routed to analysts. Rules are evaluated
              using PRIORITY hit policy (all matching rules, priority ordered). Factors are
              combined for final scoring.
            </p>
          </div>
        </div>
      </div>

      {/* Decision Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-foreground">Case Routing Decision Table</h3>
            <p className="text-xs text-text-50">
              Hit Policy: <code className="text-cyan-400">PRIORITY</code> (All matching rules,
              combined scoring)
            </p>
          </div>
          <Button
            onClick={handleAddRule}
            variant="outline"
            size="sm"
            className="gap-2 cursor-pointer"
          >
            <HugeiconsIcon icon={Add01Icon} className="w-4 h-4" />
            Add Rule
          </Button>
        </div>

        {/* Routing Rules Table */}
        <RoutingRulesTable
          onAddRule={handleAddRule}
          rules={rules}
          isLoading={isLoading}
          isFetching={isFetching}
          meta={meta}
          onPageChange={setPage}
        />
      </Card>

      {/* Assignment Trigger Events */}
      <TriggerEventsDisplay />

      {/* Routing Rule Form Drawer */}
      <RoutingRuleFormDrawer />
    </div>
  );
}
