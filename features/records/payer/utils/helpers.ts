import type { Payer, PayerSortField } from "../types";

export interface PayerFilterParams {
  search?: string;
  category?: string | null;
  subcategory?: string | null;
  delegation?: string | null;
  panel?: string | null;
  sortBy?: PayerSortField;
  sortOrder?: "asc" | "desc";
}

export function applyPayerFilters(
  payers: Payer[],
  params: PayerFilterParams,
): Payer[] {
  let result = [...payers];

  if (params.search) {
    const q = params.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortName?.toLowerCase().includes(q) ||
        p.abbreviation?.toLowerCase().includes(q),
    );
  }

  if (params.category) {
    result = result.filter((p) => p.categoryCode === params.category);
  }

  if (params.subcategory) {
    result = result.filter((p) => p.subcategoryCode === params.subcategory);
  }

  if (params.delegation) {
    const delegated = params.delegation === "yes";
    result = result.filter((p) => p.isDelegated === delegated);
  }

  if (params.panel) {
    result = result.filter((p) => p.panelStatus === params.panel);
  }

  if (params.sortBy) {
    const dir = params.sortOrder === "desc" ? -1 : 1;
    result.sort((a, b) => {
      const field = params.sortBy!;
      const aVal = a[field];
      const bVal = b[field];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return aVal.localeCompare(bVal) * dir;
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return (aVal - bVal) * dir;
      }
      if (typeof aVal === "boolean" && typeof bVal === "boolean") {
        return (Number(aVal) - Number(bVal)) * dir;
      }
      return 0;
    });
  }

  return result;
}

export function paginatePayerResults(
  payers: Payer[],
  page: number,
  limit: number,
) {
  const total = payers.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const items = payers.slice(start, start + limit);

  return {
    items,
    pagination: { page, limit, total, totalPages },
  };
}
