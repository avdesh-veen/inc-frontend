"use client";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDefaultRouting } from "@/features/settings/hooks/use-decision-queue";

export function DefaultRoutingTable() {
  const { data: defaultRouting } = useDefaultRouting();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>DQ Type</TableHead>
          <TableHead>Primary Approver</TableHead>
          <TableHead>Escalation</TableHead>
          <TableHead>Checklist Items</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {defaultRouting?.data?.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.type}</TableCell>
            <TableCell>
              <Badge variant="primaryLight" className="text-xs">
                {item.approver}
              </Badge>
            </TableCell>
            <TableCell>{item.escalation}</TableCell>
            <TableCell>--</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
