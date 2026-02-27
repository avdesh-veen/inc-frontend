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
import type {
  PayerContract,
  PayerContractCategory,
  PayerContractStatus,
  PayerDelegation,
} from "@/features/records/business-entities/types";

interface ContractsGridProps {
  contracts: PayerContract[];
}

function getCategoryConfig(category: PayerContractCategory) {
  switch (category) {
    case "government":
      return {
        emoji: "🏛️",
        label: "Government",
        iconBg: "bg-blue-500/20",
        iconText: "text-blue-400",
        badgeClass: "bg-blue-500/20 text-blue-400",
      };
    case "commercial":
      return {
        emoji: "🏢",
        label: "Commercial",
        iconBg: "bg-emerald-500/20",
        iconText: "text-emerald-400",
        badgeClass: "bg-emerald-500/20 text-emerald-400",
      };
  }
}

function getStatusBadge(status: PayerContractStatus) {
  switch (status) {
    case "active":
      return { label: "Active", className: "bg-emerald-500/20 text-emerald-300" };
    case "inactive":
      return { label: "Inactive", className: "bg-slate-500/20 text-slate-300" };
    case "pending":
      return { label: "Pending", className: "bg-amber-500/20 text-amber-300" };
  }
}

function getDelegationBadge(delegation: PayerDelegation) {
  switch (delegation) {
    case "delegated":
      return { label: "Delegated", className: "bg-emerald-500/20 text-emerald-300" };
    case "non-delegated":
      return { label: "Non-Delegated", className: "bg-slate-500/20 text-slate-300" };
  }
}

export function ContractsGrid({ contracts }: Readonly<ContractsGridProps>) {
  return (
    <Table variant="secondary">
      <TableHeader>
        <ContractHeaderRow />
      </TableHeader>
      <TableBody>
        {contracts.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={5}
              className="h-24 text-center hover:bg-transparent"
            >
              No payer contracts found
            </TableCell>
          </TableRow>
        ) : (
          contracts.map((contract) => (
            <ContractRow key={contract.id} contract={contract} />
          ))
        )}
      </TableBody>
    </Table>
  );
}

function ContractHeaderRow() {
  return (
    <TableRow className="border-b border-white/5 hover:bg-transparent">
      <TableHead>Payer</TableHead>
      <TableHead>Effective Date</TableHead>
      <TableHead>Renewal Date</TableHead>
      <TableHead>Delegation</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  );
}

interface ContractRowProps {
  contract: PayerContract;
}

function ContractRow({ contract }: Readonly<ContractRowProps>) {
  const categoryConfig = getCategoryConfig(contract.category);
  const statusBadge = getStatusBadge(contract.status);
  const delegationBadge = getDelegationBadge(contract.delegation);

  return (
    <TableRow className="border-b border-white/5">
      <TableCell className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl ${categoryConfig.iconBg} ${categoryConfig.iconText}`}
          >
            {categoryConfig.emoji}
          </div>
          <div>
            <p className="font-medium text-white">{contract.payerName}</p>
            <Badge className={categoryConfig.badgeClass} size="xs">
              {categoryConfig.emoji} {categoryConfig.label}
            </Badge>
          </div>
        </div>
      </TableCell>
      <TableCell className="px-4 py-4 text-white/70">
        {contract.effectiveDate}
      </TableCell>
      <TableCell className="px-4 py-4 text-white/70">
        {contract.renewalDate}
      </TableCell>
      <TableCell className="px-4 py-4">
        <Badge className={delegationBadge.className} size="xs">
          {delegationBadge.label}
        </Badge>
      </TableCell>
      <TableCell className="px-4 py-4">
        <Badge className={statusBadge.className} size="xs">
          {statusBadge.label}
        </Badge>
      </TableCell>
    </TableRow>
  );
}
