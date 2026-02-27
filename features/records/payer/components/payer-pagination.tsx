"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { PayerRequest } from "@/features/records/payer/types";
import { usePayersList } from "@/features/records/payer/hooks/use-payers";

interface PayerPaginationProps {
  request: PayerRequest;
}

export function PayerPagination({ request }: Readonly<PayerPaginationProps>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data, isLoading } = usePayersList(request);

  const page = request.page ?? 1;
  const limit = request.limit ?? 10;

  const meta = data?.data?.meta;
  const total = meta?.totalItems ?? 0;
  const totalPages = meta?.totalPages ?? 1;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    router.push(`?${params.toString()}`);
  };

  const handleLimitChange = (newLimit: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("limit", newLimit);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const getPageNumbers = (): (number | "ellipsis")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "ellipsis")[] = [1];
    if (page > 3) pages.push("ellipsis");
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (page < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);
    return pages;
  };

  const start = total > 0 ? (page - 1) * limit + 1 : 0;
  const end = total > 0 ? Math.min(page * limit, total) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-9 w-64" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-muted-foreground">
        {total === 0 ? (
          "No payers found"
        ) : (
          <>
            Showing <span className="font-medium text-foreground">{start}</span> to{" "}
            <span className="font-medium text-foreground">{end}</span> of{" "}
            <span className="font-medium text-foreground">{total}</span> payers
          </>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <Select value={String(limit)} onValueChange={handleLimitChange}>
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(page - 1)}
                  className={cn(page <= 1 && "pointer-events-none opacity-50", "cursor-pointer")}
                  aria-disabled={page <= 1}
                />
              </PaginationItem>

              {getPageNumbers().map((pn, idx) =>
                pn === "ellipsis" ? (
                  <PaginationItem key={`e-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={pn}>
                    <PaginationLink
                      onClick={() => handlePageChange(pn)}
                      isActive={page === pn}
                      className="cursor-pointer"
                    >
                      {pn}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(page + 1)}
                  className={cn(page >= totalPages && "pointer-events-none opacity-50", "cursor-pointer")}
                  aria-disabled={page >= totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
