"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download01Icon, Add01Icon } from "@hugeicons/core-free-icons";
import { TablePagination } from "@/components/shared/table-pagination";
import type { PaginationMeta } from "@/lib/api/types";
import type {
  BusinessEntityDetail,
  PayerContractCategory,
} from "@/features/records/business-entities/types";
import { ContractsGrid } from "./contracts-grid";

interface ContractsTabProps {
  entity: BusinessEntityDetail;
}

const ITEMS_PER_PAGE = 10;

export function ContractsTab({ entity }: Readonly<ContractsTabProps>) {
  const allContracts = entity.payerContracts ?? [];
  const [currentPage, setCurrentPage] = React.useState(1);
  const [activeFilter, setActiveFilter] =
    React.useState<PayerContractCategory | null>(null);

  const governmentCount = allContracts.filter(
    (c) => c.category === "government"
  ).length;
  const commercialCount = allContracts.filter(
    (c) => c.category === "commercial"
  ).length;

  const filteredContracts = activeFilter
    ? allContracts.filter((c) => c.category === activeFilter)
    : allContracts;

  const totalItems = filteredContracts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const paginatedContracts = filteredContracts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const meta: PaginationMeta = {
    currentPage,
    itemsPerPage: ITEMS_PER_PAGE,
    itemCount: paginatedContracts.length,
    totalItems,
    totalPages,
  };

  const handleFilterToggle = (category: PayerContractCategory) => {
    setActiveFilter((prev) => (prev === category ? null : category));
    setCurrentPage(1);
  };

  return (
    <Card className="rounded-[24px] border-white/10 bg-white/[0.02] backdrop-blur-sm">
      <CardContent className="p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Payer Contracts</h3>
          <div className="flex gap-2">
            <Button variant="muted" size="xs" className="gap-2">
              <HugeiconsIcon
                icon={Download01Icon}
                className="h-3.5 w-3.5"
                strokeWidth={2}
              />
              Export
            </Button>
            <Button variant="default" size="sm" className="gap-1">
              <HugeiconsIcon
                icon={Add01Icon}
                className="h-4 w-4"
                strokeWidth={2}
              />
              Add Contract
            </Button>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleFilterToggle("government")}
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-xs transition-colors ${
              activeFilter === "government"
                ? "bg-blue-500/30 text-blue-300"
                : "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
            }`}
          >
            🏛️ Government{" "}
            <span className="opacity-60">({governmentCount})</span>
          </button>
          <button
            type="button"
            onClick={() => handleFilterToggle("commercial")}
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-xs transition-colors ${
              activeFilter === "commercial"
                ? "bg-emerald-500/30 text-emerald-300"
                : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
            }`}
          >
            🏢 Commercial{" "}
            <span className="opacity-60">({commercialCount})</span>
          </button>
        </div>

        {/* Table */}
        <div className="rounded-md border border-white/10 overflow-auto">
          <ContractsGrid contracts={paginatedContracts} />
        </div>

        {/* Pagination */}
        <TablePagination
          meta={meta}
          label="contracts"
          onPageChange={setCurrentPage}
        />
      </CardContent>
    </Card>
  );
}
