"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

import { AddTriggerEventModal } from "../add-trigger-event-modal";
import { TriggerEventFilters, type FilterType } from "./trigger-event-filters";
import { TriggerEventTableRow } from "./trigger-event-table-row";
import type { TriggerEvent } from "@/features/settings/types/trigger-events";
import { TablePagination } from "@/components/shared/table-pagination";
import type { PaginationMeta } from "@/lib/api/types";

interface FilterMetrics {
  total: number;
  system: number;
  manual: number;
  scheduled: number;
}

interface TriggerEventsListViewClientProps {
  events: TriggerEvent[];
  isLoading?: boolean;
  meta?: PaginationMeta | null;
  onPageChange?: (page: number) => void;
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  metrics: FilterMetrics;
}

export function TriggerEventsListViewClient({
  events,
  isLoading = false,
  meta,
  onPageChange,
  activeFilter,
  onFilterChange,
  metrics,
}: Readonly<TriggerEventsListViewClientProps>) {
  const [showModal, setShowModal] = React.useState(false);
  const [editingEventId, setEditingEventId] = React.useState<string | null>(
    null,
  );

  const handleEdit = (eventId: string) => {
    setEditingEventId(eventId);
    setShowModal(true);
  };

  const handleAddEvent = () => {
    setEditingEventId(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingEventId(null);
  };

  return (
    <>
      <AddTriggerEventModal
        open={showModal}
        onOpenChange={handleModalClose}
        editingEventId={editingEventId}
      />

      <div className="space-y-6">
        <TriggerEventFilters
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
          metrics={metrics}
          onAddClick={handleAddEvent}
        />

        {isLoading ? (
          <TriggerEventsTableSkeleton />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Fired By</TableHead>
                <TableHead className="text-center">Rules</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center hover:bg-transparent"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-muted-foreground">
                        {activeFilter === "all"
                          ? "No trigger events found"
                          : `No ${activeFilter} events found`}
                      </p>
                      {activeFilter === "all" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleAddEvent}
                        >
                          <HugeiconsIcon
                            icon={Add01Icon}
                            className="mr-1.5 size-4"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                          Add your first event
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event) => (
                  <TriggerEventTableRow
                    key={event.id}
                    event={event}
                    onEdit={handleEdit}
                  />
                ))
              )}
            </TableBody>
          </Table>
        )}

        <TablePagination
          meta={meta}
          label="trigger events"
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
}

function TriggerEventsTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event</TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Fired By</TableHead>
          <TableHead className="text-center">Rules</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRow key={`skeleton-${i}`}>
            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-16" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-28" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell className="text-center">
              <Skeleton className="h-4 w-8 mx-auto" />
            </TableCell>
            <TableCell className="text-center">
              <Skeleton className="h-6 w-16 mx-auto" />
            </TableCell>
            <TableCell className="text-center">
              <Skeleton className="h-8 w-16 mx-auto" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
