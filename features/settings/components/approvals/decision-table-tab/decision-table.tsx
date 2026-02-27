"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDecisionTable } from "@/features/settings/hooks/use-decision-table";
import { Spinner } from "@/components/ui/spinner";
import { DecisionTableRow } from "./decision-table-row";
import { DecisionTableLegend } from "./decision-table-legend";

export function DecisionTableComponent() {
  const { data: decisionTableData, isFetching } = useDecisionTable();

  const decisionTable = decisionTableData?.data?.items || [];

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Spinner className="size-4" />
      </div>
    );
  }

  if (decisionTable.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] gap-2">
        <h3 className="text-sm font-medium">No decision table rules found</h3>
        <p className="text-xs text-muted-foreground text-center max-w-md">
          Decision table rules determine routing and approval requirements based
          on work characteristics.
        </p>
      </div>
    );
  }

  const sortedRules = [...decisionTable].sort((a, b) => a.order - b.order);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead rowSpan={2} className="text-center bg-glass-bg w-12">
              #
            </TableHead>
            <TableHead
              colSpan={5}
              className="text-center text-cyan-400 bg-cyan-500/5"
            >
              INPUTS
            </TableHead>
            <TableHead
              colSpan={3}
              className="text-center text-emerald-400 bg-emerald-500/5"
            >
              OUTPUTS
            </TableHead>
          </TableRow>
          <TableRow>
            <TableHead className="text-center">Payer Type</TableHead>
            <TableHead className="text-center">Est Revenue</TableHead>
            <TableHead className="text-center">Complexity</TableHead>
            <TableHead className="text-center">Analyst Tier</TableHead>
            <TableHead className="text-center">Client Tier</TableHead>
            <TableHead className="text-center">Approval Path</TableHead>
            <TableHead className="text-center">SLA (hrs)</TableHead>
            <TableHead className="text-center">Auto-Approve</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedRules.map((rule, index) => (
            <DecisionTableRow key={rule.id} rule={rule} index={index} />
          ))}
        </TableBody>
      </Table>

      <DecisionTableLegend />
    </>
  );
}
