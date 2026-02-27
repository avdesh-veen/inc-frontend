import { TableCell, TableRow } from "@/components/ui/table";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { DecisionTable } from "@/features/settings/types/approvals/decision-table";
import { formatCellValue, isWildcardValue, getApprovalPathColor } from "./decision-table-helpers";

type DecisionTableRowProps = {
  rule: DecisionTable;
  index: number;
};

export function DecisionTableRow({ rule, index }: Readonly<DecisionTableRowProps>) {
  const payerType = formatCellValue(rule.payerType);
  const estRevenue = formatCellValue(rule.estRevenue);
  const complexity = formatCellValue(rule.complexity);
  const analystTier = formatCellValue(rule.analystTier);
  const clientTier = formatCellValue(rule.clientTier);

  return (
    <TableRow
      className={cn(
        'hover:bg-glass-bg/50 transition-colors',
        index % 2 === 0 ? 'bg-glass-bg/30' : 'bg-transparent'
      )}
    >
      <TableCell className="text-center text-xs text-text-70 font-mono">
        {rule.order}
      </TableCell>

      <DecisionTableInputCell value={payerType} />
      <DecisionTableInputCell value={estRevenue} />
      <DecisionTableInputCell value={complexity} />
      <DecisionTableInputCell value={analystTier} />
      <DecisionTableInputCell value={clientTier} />

      <TableCell className="text-center text-xs">
        <span className={getApprovalPathColor(rule.approvalPath)}>
          {rule.approvalPath}
        </span>
      </TableCell>

      <TableCell className="text-center text-xs text-foreground">
        {rule.slaHours}
      </TableCell>

      <TableCell className="text-center text-xs">
        {rule.autoApprove ? (
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            className="size-4 text-emerald-400 mx-auto"
          />
        ) : (
          <span className="text-text-50">—</span>
        )}
      </TableCell>
    </TableRow>
  );
}

function DecisionTableInputCell({ value }: Readonly<{ value: string }>) {
  return (
    <TableCell
      className={cn(
        'text-center text-xs',
        isWildcardValue(value) ? 'text-text-50' : 'text-foreground'
      )}
    >
      {value}
    </TableCell>
  );
}
