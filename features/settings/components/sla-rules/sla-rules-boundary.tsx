import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/queries/query-client-config';
import { queryKeys } from '@/lib/queries/query-keys';
import { 
  getSLATargetsServer,
  getSLAOverridesServer,
  getSLAClientsDropdownServer,
  getSLAPayersDropdownServer,
  getEscalationRulesServer,
  getFPRMetricsServer
} from '@/features/settings/api/sla-rules/server';
import { getWorkCategoriesListServer } from '@/features/settings/api/work-categories/server';
import { getWorkTypesServer } from '@/features/settings/api/work-types/server';

type SLARulesBoundaryProps = {
  children: React.ReactNode;
};

const SLA_TARGETS_DEFAULT_REQUEST = { page: 1, limit: 10 } as const;
const SLA_OVERRIDES_DEFAULT_REQUEST = { page: 1, limit: 10 } as const;
const WORK_CATEGORIES_REQUEST = { page: 1, limit: 100 } as const;
const WORK_TYPES_REQUEST = { page: 1, limit: 100 } as const;
const DROPDOWN_REQUEST = { page: 1, limit: 100 } as const;

export async function SLARulesBoundary({ children }: Readonly<SLARulesBoundaryProps>) {
  const queryClient = getQueryClient();

  // Prefetch all SLA rules data and work categories in parallel
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.settings.slaRules.targets.list(SLA_TARGETS_DEFAULT_REQUEST as Record<string, unknown>),
      queryFn: () => getSLATargetsServer(SLA_TARGETS_DEFAULT_REQUEST),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.settings.slaRules.overrides.list(SLA_OVERRIDES_DEFAULT_REQUEST as Record<string, unknown>),
      queryFn: () => getSLAOverridesServer(SLA_OVERRIDES_DEFAULT_REQUEST),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.settings.slaRules.escalationRules(),
      queryFn: getEscalationRulesServer,
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.settings.slaRules.fprMetrics(),
      queryFn: getFPRMetricsServer,
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.workCategories.list(WORK_CATEGORIES_REQUEST as Record<string, unknown>),
      queryFn: () => getWorkCategoriesListServer(WORK_CATEGORIES_REQUEST),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.workTypes.list(WORK_TYPES_REQUEST as Record<string, unknown>),
      queryFn: () => getWorkTypesServer(WORK_TYPES_REQUEST),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.settings.slaRules.clientsDropdown(),
      queryFn: () => getSLAClientsDropdownServer(DROPDOWN_REQUEST as Record<string, unknown>),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.settings.slaRules.payersDropdown(),
      queryFn: () => getSLAPayersDropdownServer(DROPDOWN_REQUEST as Record<string, unknown>),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
