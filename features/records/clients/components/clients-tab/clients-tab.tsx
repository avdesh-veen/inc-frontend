"use client";

import { ClientListHeader } from "./client-list-header";
import { ClientsFilters } from "./clients-filters";
import { ClientsGrid } from "./clients-grid";
import { ClientRequest } from "../../types";

export function ClientsTab(request?: ClientRequest) {
  return (
    <div className="space-y-6">
      <ClientListHeader />
      <ClientsFilters />
      <ClientsGrid {...request} />
    </div>
  );
}
