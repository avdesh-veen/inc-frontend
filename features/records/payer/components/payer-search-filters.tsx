"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUBCATEGORY_OPTIONS } from "@/features/records/payer/types";

interface PayerSearchFiltersProps {
  filters: {
    search: string;
    category: string | null;
    subcategory: string | null;
    delegation: string | null;
    panel: string | null;
  };
}

export function PayerSearchFilters({ filters }: Readonly<PayerSearchFiltersProps>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [localSearch, setLocalSearch] = useState(filters.search);
  const [isPending, startTransition] = useTransition();

  const activeCount =
    (filters.search ? 1 : 0) +
    (filters.category ? 1 : 0) +
    (filters.subcategory ? 1 : 0) +
    (filters.delegation ? 1 : 0) +
    (filters.panel ? 1 : 0);

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    params.set("page", "1");
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const commitSearch = () => {
    const trimmed = localSearch.trim();
    if (trimmed === filters.search) return;
    updateParams({ search: trimmed || null });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") commitSearch();
  };

  const handleFilterChange = (key: string, value: string) => {
    updateParams({ [key]: value === "all" ? null : value });
  };

  const handleReset = () => {
    setLocalSearch("");
    router.push("/records/payers");
  };

  return (
    <div className={`flex items-center gap-3 transition-opacity duration-200 ${isPending ? "opacity-60 pointer-events-none" : ""}`}>
      <div className="flex-1 relative">
        <Input
          type="text"
          placeholder="Search by name, short name, or abbreviation..."
          value={localSearch}
          onChange={(e) => {
            const value = e.target.value;
            setLocalSearch(value);
            if (value === "" && filters.search) {
              updateParams({ search: null });
            }
          }}
          onKeyDown={handleKeyDown}
          className="pr-10"
        />
        <button
          type="button"
          onClick={commitSearch}
          aria-label="Search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg
            className="size-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>

      <Select
        value={filters.category ?? "all"}
        onValueChange={(v) => handleFilterChange("category", v)}
      >
        <SelectTrigger className="w-[170px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="government">Government</SelectItem>
          <SelectItem value="commercial">Commercial</SelectItem>
          <SelectItem value="workers_comp">Workers Comp</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.subcategory ?? "all"}
        onValueChange={(v) => handleFilterChange("subcategory", v)}
      >
        <SelectTrigger className="w-[190px]">
          <SelectValue placeholder="All Subcategories" />
        </SelectTrigger>
        <SelectContent>
          {SUBCATEGORY_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.delegation ?? "all"}
        onValueChange={(v) => handleFilterChange("delegation", v)}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="All Delegation" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Delegation</SelectItem>
          <SelectItem value="yes">Delegated</SelectItem>
          <SelectItem value="no">Non-Delegated</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.panel ?? "all"}
        onValueChange={(v) => handleFilterChange("panel", v)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="All Panels" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Panels</SelectItem>
          <SelectItem value="Open">Open</SelectItem>
          <SelectItem value="Closed">Closed</SelectItem>
        </SelectContent>
      </Select>

      {activeCount > 0 && (
        <Button variant="outline" onClick={handleReset}>
          Reset
          <Badge variant="secondary" className="ml-2">
            {activeCount}
          </Badge>
        </Button>
      )}
    </div>
  );
}
