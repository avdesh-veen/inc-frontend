"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Building06Icon,
  Download04Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { appRoutes } from "@/lib/constants/navigation";
import { TablePagination } from "@/components/shared/table-pagination";
import type { PaginationMeta } from "@/lib/api/types";
import type { BusinessEntity, BusinessEntityFilters } from "../types";
import { BusinessEntitiesFilters } from "./business-entities-filters";
import { AddBusinessEntityModal } from "./add-business-entity";

interface BusinessEntitiesSectionProps {
  entities: BusinessEntity[];
  meta: PaginationMeta;
  filters: BusinessEntityFilters;
  onFilterChange: (filters: BusinessEntityFilters) => void;
  onPageChange: (page: number) => void;
}

export function BusinessEntitiesSection({
  entities,
  meta,
  filters,
  onFilterChange,
  onPageChange,
}: Readonly<BusinessEntitiesSectionProps>) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleExport = () => {
    console.log("Export business entities");
  };

  const handleAddEntity = () => {
    setIsAddModalOpen(true);
  };

  const handleAddModalClose = (open: boolean) => {
    if (!open) setIsAddModalOpen(false);
  };

  const handleAddSuccess = () => {
    // TODO: refresh entity list when API is integrated
    setIsAddModalOpen(false);
  };

  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.02] backdrop-blur-sm overflow-hidden">
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">All Business Entities</h3>
          <div className="flex items-center gap-2">
            <Button onClick={handleAddEntity}>
              <HugeiconsIcon icon={Add01Icon} className="size-4" strokeWidth={2} aria-hidden="true" />
              Add Business Entity
            </Button>
            <button
              onClick={handleExport}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60 hover:text-white hover:bg-white/10 flex items-center gap-2 transition-colors"
            >
              <HugeiconsIcon
                icon={Download04Icon}
                className="w-3.5 h-3.5"
                strokeWidth={2}
                aria-hidden="true"
              />
              Export
            </button>
          </div>
        </div>

        <BusinessEntitiesFilters filters={filters} onFilterChange={onFilterChange} />
      </div>

      <AddBusinessEntityModal
        open={isAddModalOpen}
        onOpenChange={handleAddModalClose}
        onSuccess={handleAddSuccess}
      />

      <div className="relative">
        <Table variant="secondary">
          <TableHeader>
            <EntityHeaderRow />
          </TableHeader>
          <TableBody>
            {entities.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center hover:bg-transparent"
                >
                  No business entities found
                </TableCell>
              </TableRow>
            ) : (
              entities.map((entity) => (
                <EntityRow key={entity.id} entity={entity} />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="p-5 border-t border-white/5">
        <TablePagination meta={meta} label="entities" onPageChange={onPageChange} />
      </div>
    </div>
  );
}

function EntityHeaderRow() {
  return (
    <TableRow>
      <TableHead>Client</TableHead>
      <TableHead>Entity Name</TableHead>
      <TableHead>Type</TableHead>
      <TableHead>Tax ID</TableHead>
      <TableHead>Group NPIs</TableHead>
      <TableHead>Providers</TableHead>
      <TableHead>Contracts</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  );
}

interface EntityRowProps {
  entity: BusinessEntity;
}

function EntityRow({ entity }: Readonly<EntityRowProps>) {
  return (
    <TableRow className="cursor-pointer hover:bg-white/[0.02]">
      <TableCell>
        <Link
          href={appRoutes.records.businessEntityDetails(entity.id)}
          className="text-white/70 text-sm hover:text-white transition-colors"
        >
          {entity.clientName}
        </Link>
      </TableCell>
      <TableCell>
        <Link
          href={appRoutes.records.businessEntityDetails(entity.id)}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shrink-0">
            <HugeiconsIcon
              icon={Building06Icon}
              className="w-5 h-5 text-white"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </div>
          <div>
            <p className="font-medium text-white">{entity.entityName}</p>
            <p className="text-xs text-white/50">{entity.location}</p>
          </div>
        </Link>
      </TableCell>
      <TableCell>
        <Badge variant="secondaryLight" className="text-xs">
          {entity.type}
        </Badge>
      </TableCell>
      <TableCell>
        <span className="font-mono text-xs text-white/50">{entity.taxId}</span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="text-white font-medium">{entity.groupNpis.length}</span>
          <span className="text-white/30 text-xs">
            {entity.groupNpis.length === 1 ? "NPI-2" : "NPI-2s"}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-white font-medium">{entity.providerCount}</span>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {entity.activeContractsCount > 0 && (
            <Badge variant="tertiaryLight" className="text-[10px]">
              {entity.activeContractsCount} Active
            </Badge>
          )}
          {entity.inProcessContractsCount > 0 && (
            <Badge variant="secondaryLight" className="text-[10px]">
              {entity.inProcessContractsCount} In Process
            </Badge>
          )}
          {entity.endedContractsCount > 0 && (
            <Badge variant="destructiveLight" className="text-[10px]">
              {entity.endedContractsCount} Ended
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant={entity.status === "active" ? "tertiaryLight" : "secondaryLight"}
          className="text-xs"
        >
          {entity.status === "active" ? "Active" : "Inactive"}
        </Badge>
      </TableCell>
    </TableRow>
  );
}
