"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DebouncedSearchInput } from "@/components/shared/debounced-search-input";
import type { BusinessEntityFilters } from "../types";
import {
  getUniqueClients,
  BUSINESS_ENTITY_TYPES,
} from "@/lib/constants/mock-data/business-entity-data";

interface BusinessEntitiesFiltersProps {
  filters: BusinessEntityFilters;
  onFilterChange: (filters: BusinessEntityFilters) => void;
}

export function BusinessEntitiesFilters({
  filters,
  onFilterChange,
}: Readonly<BusinessEntitiesFiltersProps>) {
  const clients = getUniqueClients();

  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filters, search: value || undefined });
  };

  const handleClientChange = (value: string) => {
    onFilterChange({
      ...filters,
      clientId: value === "all" ? undefined : value,
    });
  };

  const handleTypeChange = (value: string) => {
    onFilterChange({
      ...filters,
      type: value === "all" ? undefined : value,
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <DebouncedSearchInput
        value={filters.search ?? null}
        onValueChange={handleSearchChange}
        placeholder="Search by name, Tax ID, or NPI-2..."
        delay={500}
      />

      <Select
        value={filters.clientId ?? "all"}
        onValueChange={handleClientChange}
      >
        <SelectTrigger variant="primary" className="w-64">
          <SelectValue placeholder="All Clients" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Clients</SelectItem>
          {clients.map((client) => (
            <SelectItem key={client.id} value={client.id}>
              {client.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.type ?? "all"} onValueChange={handleTypeChange}>
        <SelectTrigger variant="primary" className="w-56">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {BUSINESS_ENTITY_TYPES.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
