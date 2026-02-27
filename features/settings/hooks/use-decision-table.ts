import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queries/query-keys';
import { getDecisionTableClient } from '@/features/settings/api/approvals/decision-table/client';
import type { DecisionTable } from '@/features/settings/types/approvals/decision-table';
import { ApiResponse, PaginatedResponse } from '@/lib/api/types';

export function useDecisionTable() {
  return useQuery<ApiResponse<PaginatedResponse<DecisionTable>>, Error>({
    queryKey: queryKeys.settings.approvals.decisionTable(),
    queryFn: getDecisionTableClient,
  });
}
