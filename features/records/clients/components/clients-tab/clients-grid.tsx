/**
 * Clients Grid
 * 
 * Main data table for displaying clients with sortable columns.
 * Uses TanStack Query for data fetching and URL params for filtering/sorting.
 */

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Spinner } from '@/components/ui/spinner';
import { TablePagination } from '@/components/shared/table-pagination';
import { ClientTier, ClientRequest } from '@/features/records/clients/types';
import {
  getTierBadgeClass,
  getTierLabel,
  getHealthScoreColorClass,
  getClientInitials,
} from '@/features/records/clients/utils/helpers';
import { cn } from '@/lib/utils';
import { useClients } from '../../api/clients-tab/client';
import { useSearchParamsManager } from '@/hooks/use-search-params';
import { Button } from '@/components/ui/button';
import { useHasPermission } from '@/features/auth/hooks';
import { RESOURCES, PERMISSIONS } from '@/features/auth/utils/permission-constants';

export function ClientsGrid(request?: ClientRequest) {
  const router = useRouter();
  const { updateParams } = useSearchParamsManager();
  
  const { hasPermission: canViewAll } = useHasPermission(
    RESOURCES.CLIENTS,
    PERMISSIONS.CLIENTS_VIEW_ALL
  );
  const { hasPermission: canViewDetails } = useHasPermission(
    RESOURCES.CLIENTS,
    PERMISSIONS.CLIENTS_VIEW_DETAILS
  );

  const canViewClient = canViewAll || canViewDetails;
  
  const { data: clientsResponse, isLoading, isFetching } = useClients(request);

  const clients = clientsResponse?.data?.items ?? [];
  const pagination = clientsResponse?.data?.meta;

  const isLoadingOrPending = isLoading || isFetching;

  const sort = request?.sort || '';

  const currentSortField = React.useMemo(() => {
    return sort.startsWith('-') ? sort.slice(1) : sort;
  }, [sort]);

  const isDesc = React.useMemo(() => {
    return sort.startsWith('-');
  }, [sort]);

  const handleSort = React.useCallback(
    (field: string) => {
      let newSort = field;

      if (currentSortField === field) {
        newSort = isDesc ? field : `-${field}`;
      }

      updateParams({ sort: newSort });
    },
    [currentSortField, isDesc, updateParams]
  );

  const handleRowClick = React.useCallback(
    (clientId: string) => {
      router.push(`/records/clients/${clientId}`);
    },
    [router]
  );

  const getSortIcon = React.useCallback(
    (field: string) => {
      if (currentSortField !== field) {
        return (
          <svg
            className="w-3 h-3 ml-1 inline-block text-text-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
            />
          </svg>
        );
      }

      return isDesc ? (
        <svg
          className="w-3 h-3 ml-1 inline-block text-violet-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      ) : (
        <svg
          className="w-3 h-3 ml-1 inline-block text-violet-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      );
    },
    [currentSortField, isDesc]
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="relative rounded-lg border border-white/5 overflow-hidden bg-glass-bg">
        {isLoadingOrPending && (
          <div className="absolute inset-0 bg-background/20 backdrop-blur-sm z-10 flex flex-col justify-center items-center gap-2">
            <Spinner className="h-8 w-8" />
            <p className="text-sm font-medium text-foreground">
              Updating results...
            </p>
          </div>
        )}

        <div className={isLoadingOrPending ? "blur-[2px] pointer-events-none overflow-x-auto" : "overflow-x-auto"}>
          <table className="w-full text-sm sortable-table">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                <th
                  onClick={() => handleSort('organizationName')}
                  className="px-4 py-3 text-left text-xxs font-bold text-white/50 uppercase cursor-pointer hover:text-white"
                >
                  Client {getSortIcon('organizationName')}
                </th>
                <th
                  onClick={() => handleSort('accountTier')}
                  className="px-4 py-3 text-left text-xxs font-bold text-white/50 uppercase cursor-pointer hover:text-white"
                >
                  Tier {getSortIcon('accountTier')}
                </th>
                <th
                  onClick={() => handleSort('provider')}
                  className="px-4 py-3 text-left text-xxs font-bold text-white/50 uppercase cursor-pointer hover:text-white"
                >
                  Providers {getSortIcon('provider')}
                </th>
                <th
                  onClick={() => handleSort('estimatedRevenue')}
                  className="px-4 py-3 text-left text-xxs font-bold text-white/50 uppercase cursor-pointer hover:text-white"
                >
                  Est. Revenue {getSortIcon('estimatedRevenue')}
                </th>
                <th
                  onClick={() => handleSort('avgTat')}
                  className="px-4 py-3 text-left text-xxs font-bold text-white/50 uppercase cursor-pointer hover:text-white"
                >
                  Avg TAT {getSortIcon('avgTat')}
                </th>
                <th
                  onClick={() => handleSort('portalAccess')}
                  className="px-4 py-3 text-left text-xxs font-bold text-white/50 uppercase cursor-pointer hover:text-white"
                >
                  Portal {getSortIcon('portalAccess')}
                </th>
                <th
                  onClick={() => handleSort('healthScore')}
                  className="px-4 py-3 text-left text-xxs font-bold text-white/50 uppercase cursor-pointer hover:text-white"
                >
                  Health {getSortIcon('healthScore')}
                </th>
                {
                  canViewClient &&
                  <th className="px-4 py-3 text-left text-xxs font-bold text-white/50 uppercase">
                    Actions
                  </th>
                }
              </tr>
            </thead>

            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No clients found
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr
                    key={client.id}
                    className="clickable-row border-b border-white/5 cursor-pointer"
                    tabIndex={0}
                    onClick={() => handleRowClick(client.id)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleRowClick(client.id);
                    }}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 rounded-xl shrink-0">
                          <AvatarFallback className="bg-cyan-400/20 text-cyan-300 rounded-xl text-xs font-semibold border border-cyan-400">
                            {getClientInitials(client.organizationName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-white hover:text-emerald-400 cursor-pointer">
                            {client.organizationName}
                          </p>
                          <p className="text-xs text-white/50">
                            {client.type} • {client.state.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <Badge variant="outline" className={cn('px-2.5 py-1 rounded-lg text-xs font-bold', getTierBadgeClass(client.accountTier as ClientTier))}>
                        {getTierLabel(client.accountTier)}
                      </Badge>
                    </td>

                    <td className="px-4 py-4 text-white font-medium">
                      -
                    </td>

                    <td className="px-4 py-4 text-white/60">
                      -
                    </td>

                    <td className="px-4 py-4 text-white/60">
                      {client.avgTat} days
                    </td>

                    <td className="px-4 py-4">
                      <span className={cn(
                        'flex items-center gap-1.5 text-xs font-medium',
                        client.portalAccess ? 'text-emerald-400' : 'text-white/50'
                      )}>
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          {client.portalAccess ? (
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          ) : (
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          )}
                        </svg>
                        {client.portalAccess ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-white/10 overflow-hidden">
                          <Progress
                            value={client.healthScore ?? 20}
                            className={cn('h-full rounded-full', getHealthScoreColorClass(client.healthScore))}
                          />
                        </div>
                        <span className={cn('text-xs font-medium', getHealthScoreColorClass(client.healthScore))}>
                          {client.healthScore ?? 20}
                        </span>
                      </div>
                    </td>

                    {
                      canViewClient &&
                      <td className="px-4 py-4">
                        <Button
                          variant="ghost-primary"
                          onClick={(e) => {
                            handleRowClick(client.id);
                          }}
                        >
                          View
                        </Button>
                      </td>
                    }

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TablePagination
        meta={pagination}
        label="clients"
        onPageChange={(page) => updateParams({ page: page.toString() }, { resetPage: false })}
      />
    </div>
  );
}
