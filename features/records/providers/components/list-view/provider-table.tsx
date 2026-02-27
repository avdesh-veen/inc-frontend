/**
 * Provider Table Component
 * 
 * Main table displaying providers with 8 columns, sorting, and row actions.
 */

'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowUpDownIcon, ArrowUp01Icon, ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Provider, ProviderSortField } from '@/features/records/providers/types';
import { ProviderAvatar } from '../shared/provider-avatar';
import { ProviderStatusBadge } from '../shared/provider-status-badge';
import { LicenseExpirationBadge } from '../shared/license-expiration-badge';
import { getClientName, getDepartmentName, getResponsivenessColorClass } from '../../utils/helpers';
import { cn } from '@/lib/utils';

export interface ProviderTableProps {
  providers: Provider[];
  isLoading?: boolean;
  sort: {
    field: ProviderSortField;
    order: 'asc' | 'desc';
  };
}

export function ProviderTable({ providers, isLoading, sort }: ProviderTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSort = useCallback((field: ProviderSortField) => {
    const params = new URLSearchParams(searchParams);
    const currentField = params.get('sort');
    const currentOrder = params.get('order');
    
    // Toggle order if clicking the same field
    const newOrder = currentField === field && currentOrder === 'asc' ? 'desc' : 'asc';
    
    params.set('sort', field);
    params.set('order', newOrder);
    params.set('page', '1'); // Reset to page 1 on sort
    
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  const handleRowClick = useCallback((providerId: string) => {
    router.push(`/records/providers/${providerId}`);
  }, [router]);

  const handleRowKeyDown = useCallback((event: React.KeyboardEvent, providerId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleRowClick(providerId);
    }
  }, [handleRowClick]);

  const renderSortIndicator = (field: ProviderSortField) => {
    if (sort.field !== field) {
      return <HugeiconsIcon icon={ArrowUpDownIcon} className="h-3 w-3 opacity-50" strokeWidth={1.5} aria-hidden="true" />
    }
    return sort.order === 'asc' ? (
      <HugeiconsIcon icon={ArrowUp01Icon} className="h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
    ) : (
      <HugeiconsIcon icon={ArrowDown01Icon} className="h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
    );
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          Loading providers...
        </div>
        <Table aria-busy="true">
          <TableCaption>Provider list (loading...)</TableCaption>
          <TableHeader>
            <TableRow className="border-b border-white/5 bg-white/2">
              <TableHead className="px-4 py-3"><span className="text-xxs font-bold text-white/50 uppercase">Provider</span></TableHead>
              <TableHead className="px-4 py-3"><span className="text-xxs font-bold text-white/50 uppercase">Client</span></TableHead>
              <TableHead className="px-4 py-3"><span className="text-xxs font-bold text-white/50 uppercase">Specialty</span></TableHead>
              <TableHead className="px-4 py-3"><span className="text-xxs font-bold text-white/50 uppercase">Department</span></TableHead>
              <TableHead className="px-4 py-3"><span className="text-xxs font-bold text-white/50 uppercase">Status</span></TableHead>
              <TableHead className="px-4 py-3"><span className="text-xxs font-bold text-white/50 uppercase">License Exp</span></TableHead>
              <TableHead className="px-4 py-3"><span className="text-xxs font-bold text-white/50 uppercase">Response</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i} className="border-b border-white/5">
                <TableCell className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-4"><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell className="px-4 py-4"><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell className="px-4 py-4"><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell className="px-4 py-4"><Skeleton className="h-6 w-20" /></TableCell>
                <TableCell className="px-4 py-4"><Skeleton className="h-6 w-24" /></TableCell>
                <TableCell className="px-4 py-4"><Skeleton className="h-4 w-20" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (providers.length === 0) {
    return (
      <div className="w-full">
        <Table>
          <TableCaption>No providers found matching your criteria</TableCaption>
          <TableHeader>
            <TableRow className="border-b border-white/5 bg-white/2">
              <TableHead className="px-4 py-3"><span className="text-xxs font-bold text-white/50 uppercase">Provider</span></TableHead>
              <TableHead className="px-4 py-3"><span className="text-xxs font-bold text-white/50 uppercase">Client</span></TableHead>
              <TableHead className="px-4 py-3"><span className="text-xxs font-bold text-white/50 uppercase">Specialty</span></TableHead>
              <TableHead className="px-4 py-3"><span className="text-xxs font-bold text-white/50 uppercase">Department</span></TableHead>
              <TableHead className="px-4 py-3"><span className="text-xxs font-bold text-white/50 uppercase">Status</span></TableHead>
              <TableHead className="px-4 py-3"><span className="text-xxs font-bold text-white/50 uppercase">License Exp</span></TableHead>
              <TableHead className="px-4 py-3"><span className="text-xxs font-bold text-white/50 uppercase">Response</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                <p className="text-muted-foreground" role="status">No providers found</p>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-white/5 bg-white/2">
            <TableHead className="px-4 py-3">
              <button
                onClick={() => handleSort('displayName')}
                className="text-xxs font-bold text-white/50 uppercase text-left hover:text-foreground transition-colors flex items-center gap-2"
                aria-label="Sort by provider name"
                aria-sort={sort.field === 'displayName' ? (sort.order === 'asc' ? 'ascending' : 'descending') : undefined}
              >
                Provider
                {renderSortIndicator('displayName')}
              </button>
            </TableHead>
            <TableHead className="px-4 py-3">
              <span className="text-xxs font-bold text-white/50 uppercase text-left">
                Client
              </span>
            </TableHead>
            <TableHead className="px-4 py-3">
              <button
                onClick={() => handleSort('specialty')}
                className="text-xxs font-bold text-white/50 uppercase text-left hover:text-foreground transition-colors flex items-center gap-2"
                aria-label="Sort by specialty"
                aria-sort={sort.field === 'specialty' ? (sort.order === 'asc' ? 'ascending' : 'descending') : undefined}
              >
                Specialty
                {renderSortIndicator('specialty')}
              </button>
            </TableHead>
            <TableHead className="px-4 py-3">
              <button
                onClick={() => handleSort('department')}
                className="text-xxs font-bold text-white/50 uppercase text-left hover:text-foreground transition-colors flex items-center gap-2"
                aria-label="Sort by department"
                aria-sort={sort.field === 'department' ? (sort.order === 'asc' ? 'ascending' : 'descending') : undefined}
              >
                Department
                {renderSortIndicator('department')}
              </button>
            </TableHead>
            <TableHead className="px-4 py-3">
              <button
                onClick={() => handleSort('status')}
                className="text-xxs font-bold text-white/50 uppercase text-left hover:text-foreground transition-colors flex items-center gap-2"
                aria-label="Sort by status"
                aria-sort={sort.field === 'status' ? (sort.order === 'asc' ? 'ascending' : 'descending') : undefined}
              >
                Status
                {renderSortIndicator('status')}
              </button>
            </TableHead>
            <TableHead className="px-4 py-3">
              <button
                onClick={() => handleSort('licenseExpiration')}
                className="text-xxs font-bold text-white/50 uppercase text-left hover:text-foreground transition-colors flex items-center gap-2"
                aria-label="Sort by license expiration"
                aria-sort={sort.field === 'licenseExpiration' ? (sort.order === 'asc' ? 'ascending' : 'descending') : undefined}
              >
                License Exp
                {renderSortIndicator('licenseExpiration')}
              </button>
            </TableHead>
            <TableHead className="px-4 py-3">
              <span className="text-xxs font-bold text-white/50 uppercase text-left">
                Response
              </span>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {providers.map((provider) => {
            const responsiveness = provider.responsiveness || 0;
            const primaryClient = provider.clientIds?.[0];
            
            return (
              <TableRow
                key={provider.id}
                className="cursor-pointer border-b border-white/5 hover:bg-white/2"
                onClick={() => handleRowClick(provider.id)}
                onKeyDown={(e) => handleRowKeyDown(e, provider.id)}
                tabIndex={0}
                role="button"
              >
                <TableCell className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <ProviderAvatar name={provider.displayName} size="sm" />
                    <div>
                      <p className="font-medium text-foreground">{provider.displayName}</p>
                      <p className="text-xs text-white/50">{provider.credential} • NPI: {provider.npi}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-4 py-4">
                  <span className="text-white/60 text-sm">
                    {primaryClient ? getClientName(primaryClient) : '—'}
                  </span>
                </TableCell>

                <TableCell className="px-4 py-4 text-white/60">
                  {provider.primarySpecialty}
                </TableCell>

                <TableCell className="px-4 py-4">
                  <span className="text-white/60">
                    {getDepartmentName(provider.departmentId)}
                  </span>
                </TableCell>

                <TableCell className="px-4 py-4">
                  <ProviderStatusBadge status={provider.status} size="sm" />
                </TableCell>

                <TableCell className="px-4 py-4">
                  <LicenseExpirationBadge expirationDate={provider.nextLicenseExpiration || null} />
                </TableCell>

                <TableCell className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 rounded-full bg-white/10">
                      <div 
                        className={cn(
                          'h-full rounded-full',
                          getResponsivenessColorClass(responsiveness)
                        )} 
                        style={{ width: `${responsiveness}%` }}
                      />
                    </div>
                    <span className={cn(
                      'text-xs',
                      responsiveness >= 80 ? 'text-emerald-400' : responsiveness >= 60 ? 'text-amber-400' : 'text-rose-400'
                    )}>
                      {responsiveness}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
