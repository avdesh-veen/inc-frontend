'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TablePagination } from '@/components/shared/table-pagination';
import { cn } from '@/lib/utils';
import type { PaginationMeta } from '@/lib/api/types';
import { PayerType, ClientTier, type AssignmentRule } from '@/features/settings/types/assignment';
import {
  getPayerTypeLabel,
  getClientTierLabel,
  getRoutingSkillsLabel,
  getMinProficiencyLabel,
  getAssignmentModeLabel,
  ASSIGNMENT_MODE_COLORS,
} from './routing-rule-helpers';

type RoutingRulesTableProps = {
  onAddRule: () => void;
  rules: AssignmentRule[];
  isLoading: boolean;
  isFetching: boolean;
  meta?: PaginationMeta;
  onPageChange: (page: number) => void;
};

export function RoutingRulesTable({ onAddRule, rules, isLoading, isFetching, meta, onPageChange }: Readonly<RoutingRulesTableProps>) {
  const sortedRules = [...rules].sort((a, b) => a.rulePriority - b.rulePriority);

  if (isLoading) {
    return <Skeleton className="h-96 rounded-xl" />;
  }

  return (
    <>
      <div className="relative rounded-md border">
        {isFetching && !isLoading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex flex-col justify-center items-center gap-2 rounded-md">
            <Spinner className="h-6 w-6" />
            <p className="text-sm font-medium text-foreground">Updating results...</p>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead rowSpan={2} className="text-center bg-glass-bg w-16">
                Pri
              </TableHead>
              <TableHead colSpan={4} className="text-center text-cyan-400 bg-cyan-500/5">
                CONDITIONS
              </TableHead>
              <TableHead colSpan={3} className="text-center text-emerald-400 bg-emerald-500/5">
                ROUTING OUTPUT
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead className="text-center bg-cyan-500/5">Work Type</TableHead>
              <TableHead className="text-center bg-cyan-500/5">Payer Type</TableHead>
              <TableHead className="text-center bg-cyan-500/5">Client Tier</TableHead>
              <TableHead className="text-center bg-cyan-500/5">Is Urgent</TableHead>
              <TableHead className="text-center bg-emerald-500/5">Required Skills</TableHead>
              <TableHead className="text-center bg-emerald-500/5">Min Proficiency</TableHead>
              <TableHead className="text-center bg-emerald-500/5">Assignment Mode</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedRules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-sm text-text-50">No routing rules defined yet</p>
                    <Button onClick={onAddRule} variant="outline" size="sm">
                      Add your first rule
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sortedRules.map((rule, index) => {
                // Get display values
                const workType = rule.workCategory?.code || '*';
                const payerType = rule.payerType === PayerType.ANY ? '*' : getPayerTypeLabel(rule.payerType);
                const clientTier = rule.clientTier === ClientTier.ANY ? '*' : getClientTierLabel(rule.clientTier);
                const isUrgent = rule.isUrgent ? 'Yes' : '*';
                const requiredSkills = getRoutingSkillsLabel(rule.routingSkills);
                const minProficiency = getMinProficiencyLabel(rule.minProficiency);
                const assignmentMode = getAssignmentModeLabel(rule.assignmentMode);

                return (
                  <TableRow
                    key={rule.id}
                    className={cn(
                      'cursor-pointer hover:bg-glass-bg/50 transition-colors',
                      index % 2 === 0 ? 'bg-glass-bg/30' : 'bg-transparent'
                    )}
                  >
                    {/* Priority */}
                    <TableCell className="text-center text-xs text-text-70 font-mono">
                      {rule.rulePriority}
                    </TableCell>

                    {/* Work Type */}
                    <TableCell
                      className={cn(
                        'text-center text-xs',
                        workType === '*' ? 'text-text-50' : 'text-foreground'
                      )}
                    >
                      {workType}
                    </TableCell>

                    {/* Payer Type */}
                    <TableCell
                      className={cn(
                        'text-center text-xs',
                        payerType === '*' ? 'text-text-50' : 'text-foreground'
                      )}
                    >
                      {payerType}
                    </TableCell>

                    {/* Client Tier */}
                    <TableCell
                      className={cn(
                        'text-center text-xs',
                        clientTier === '*' ? 'text-text-50' : 'text-foreground'
                      )}
                    >
                      {clientTier}
                    </TableCell>

                    {/* Is Urgent */}
                    <TableCell
                      className={cn(
                        'text-center text-xs',
                        isUrgent === '*' ? 'text-text-50' : 'text-foreground'
                      )}
                    >
                      {isUrgent}
                    </TableCell>

                    {/* Required Skills */}
                    <TableCell className="text-center text-xs text-cyan-400">
                      {requiredSkills}
                    </TableCell>

                    {/* Min Proficiency */}
                    <TableCell className="text-center text-xs text-foreground">
                      {minProficiency}
                    </TableCell>

                    {/* Assignment Mode */}
                    <TableCell
                      className={cn(
                        'text-center text-xs font-medium',
                        ASSIGNMENT_MODE_COLORS[assignmentMode] || 'text-foreground'
                      )}
                    >
                      {assignmentMode}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-border-10">
        <p className="text-xs text-text-50 mb-2">Legend:</p>
        <div className="flex flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-text-50">*</span>
            <span className="text-text-50">= Any value</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-violet-400">Dedicated</span>
            <span className="text-text-50">= Assigned team only</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-emerald-400">Skill Match</span>
            <span className="text-text-50">= By skill + load</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-amber-400">Least Busy</span>
            <span className="text-text-50">= Fastest available</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-blue-400">Load Balanced</span>
            <span className="text-text-50">= Even distribution</span>
          </div>
        </div>
      </div>

      <TablePagination meta={meta} label="rules" onPageChange={onPageChange} />
    </>
  );
}
