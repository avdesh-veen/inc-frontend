"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download01Icon, UserAdd01Icon } from "@hugeicons/core-free-icons";
import { TablePagination } from "@/components/shared/table-pagination";
import type { PaginationMeta } from "@/lib/api/types";
import type { BusinessEntityDetail } from "@/features/records/business-entities/types";
import { ProvidersGrid } from "./providers-grid";

interface ProvidersTabProps {
  entity: BusinessEntityDetail;
}

const ITEMS_PER_PAGE = 10;

export function ProvidersTab({ entity }: Readonly<ProvidersTabProps>) {
  const allProviders = entity.affiliatedProviders ?? [];
  const [currentPage, setCurrentPage] = React.useState(1);

  const totalItems = allProviders.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const paginatedProviders = allProviders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const meta: PaginationMeta = {
    currentPage,
    itemsPerPage: ITEMS_PER_PAGE,
    itemCount: paginatedProviders.length,
    totalItems,
    totalPages,
  };

  return (
    <Card className="rounded-[24px] border-white/10 bg-white/[0.02] backdrop-blur-sm">
      <CardContent className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">
            Affiliated Providers
          </h3>
          <div className="flex gap-2">
            <Button variant="muted" size="xs" className="gap-2">
              <HugeiconsIcon
                icon={Download01Icon}
                className="h-3.5 w-3.5"
                strokeWidth={2}
              />
              Export Roster
            </Button>
            <Button
              variant="tertiary"
              size="sm"
              className="gap-1"
            >
              <HugeiconsIcon
                icon={UserAdd01Icon}
                className="h-4 w-4"
                strokeWidth={2}
              />
              Add Provider
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border border-white/10 overflow-auto">
          <ProvidersGrid providers={paginatedProviders} />
        </div>

        {/* Pagination */}
        <TablePagination
          meta={meta}
          label="providers"
          onPageChange={setCurrentPage}
        />
      </CardContent>
    </Card>
  );
}
