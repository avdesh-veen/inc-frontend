"use client";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination";
  import { useSearchParamsManager } from "@/hooks/use-search-params";

export function GridPagination({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    label = "items",
  }: Readonly<{
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    label?: string;
  }>) {
    const { updateParams } = useSearchParamsManager();
  
    const handlePageChange = (page: number) => {
      updateParams({ page: page.toString() }, { resetPage: false });
    };
  
    const handlePrevious = () => {
      if (currentPage > 1) {
        handlePageChange(currentPage - 1);
      }
    };
  
    const handleNext = () => {
      if (currentPage < totalPages) {
        handlePageChange(currentPage + 1);
      }
    };
  
    // Generate page numbers to display
    const getPageNumbers = () => {
      const pages: (number | string)[] = [];
      const maxVisiblePages = 5;
  
      if (totalPages <= maxVisiblePages) {
        // Show all pages if total is small
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Always show first page
        pages.push(1);
  
        if (currentPage > 3) {
          pages.push("...");
        }
  
        // Show pages around current page
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
  
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
  
        if (currentPage < totalPages - 2) {
          pages.push("...");
        }
  
        // Always show last page
        pages.push(totalPages);
      }
  
      return pages;
    };
  
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
    return (
      <div className="flex items-center justify-between">
        <p className="flex-1 text-sm text-muted-foreground">
          Showing <span className="font-medium">{startItem}</span> to{" "}
          <span className="font-medium">{endItem}</span> of{" "}
          <span className="font-medium">{totalItems}</span> {label}
        </p>
  
        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={handlePrevious}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
  
              {getPageNumbers().map((page, index) => (
                <PaginationItem key={`page-${page}-${index}`}>
                  {page === "..." ? (
                    <span className="px-4 py-2">...</span>
                  ) : (
                    <PaginationLink
                      onClick={() => handlePageChange(page as number)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
  
              <PaginationItem>
                <PaginationNext
                  onClick={handleNext}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    );
  }