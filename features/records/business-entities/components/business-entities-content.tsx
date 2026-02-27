"use client";

import { useState, useMemo } from "react";
import { MOCK_BUSINESS_ENTITIES } from "@/lib/constants/mock-data/business-entity-data";
import type { BusinessEntityFilters } from "../types";
import { BusinessEntitiesSection } from "./business-entities-section";

export function BusinessEntitiesContent() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<BusinessEntityFilters>({});
  const itemsPerPage = 10;

  const filteredEntities = useMemo(() => {
    let filtered = MOCK_BUSINESS_ENTITIES;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (entity) =>
          entity.entityName.toLowerCase().includes(searchLower) ||
          entity.taxId.includes(searchLower) ||
          entity.groupNpis.some((npi) => npi.includes(searchLower))
      );
    }

    if (filters.clientId && filters.clientId !== "all") {
      filtered = filtered.filter((entity) => entity.clientId === filters.clientId);
    }

    if (filters.type && filters.type !== "all") {
      filtered = filtered.filter((entity) => entity.type === filters.type);
    }

    return filtered;
  }, [filters]);

  const paginatedEntities = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredEntities.slice(start, end);
  }, [filteredEntities, page]);

  const meta = {
    currentPage: page,
    totalPages: Math.ceil(filteredEntities.length / itemsPerPage),
    totalItems: filteredEntities.length,
    itemsPerPage,
    itemCount: paginatedEntities.length,
  };

  const handleFilterChange = (newFilters: BusinessEntityFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <BusinessEntitiesSection
      entities={paginatedEntities}
      meta={meta}
      filters={filters}
      onFilterChange={handleFilterChange}
      onPageChange={setPage}
    />
  );
}
