/**
 * Provider Enrollments Tab
 * 
 * Enrollments tab showing in-progress requests and enrolled payers.
 */

'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Empty, EmptyContent, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { Provider } from '@/features/records/providers/types';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlusSignIcon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

interface ProviderEnrollmentsTabProps {
  provider: Provider;
}

/**
 * Get status badge class
 */
function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'In Progress':
      return 'border-blue-500/30 text-blue-300';
    case 'Pending':
      return 'border-amber-500/30 text-amber-300';
    case 'Active':
      return 'border-emerald-500/30 text-emerald-300';
    case 'Completed':
      return 'border-slate-500/30 text-slate-400';
    default:
      return '';
  }
}

export function ProviderEnrollmentsTab({ provider: _provider }: Readonly<ProviderEnrollmentsTabProps>) {
  // Mock data - would come from API
  const inProgressRequests = [
    {
      id: 'ENR-2024-001',
      subject: 'Initial Enrollment - Medicare',
      status: 'In Progress',
      created: '5 days ago',
    },
  ];

  const enrolledPayers = [
    {
      id: '1',
      name: 'Medicare',
      category: 'Government',
      effectiveDate: '01/15/2022',
      recredDate: '01/15/2025',
      daysUntilRecred: 245,
      status: 'Active',
    },
    {
      id: '2',
      name: 'Highmark Blue Shield',
      category: 'Commercial',
      effectiveDate: '03/20/2023',
      recredDate: '03/20/2026',
      daysUntilRecred: 85,
      status: 'Active',
    },
  ];

  return (
    <div className="space-y-6">
      {/* In-Progress Requests */}
      <div className="rounded-xl border bg-card">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">
            In-Progress Enrollment Requests
          </h3>
          <Button size="default">
            <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </div>

        {inProgressRequests.length === 0 ? (
          <div className="p-12">
            <Empty>
              <EmptyContent>
                <EmptyTitle>No active enrollment requests</EmptyTitle>
                <EmptyDescription>Create a new enrollment request to get started.</EmptyDescription>
              </EmptyContent>
            </Empty>
          </div>
        ) : (
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">CASE ID</TableHead>
                  <TableHead className="w-[300px]">SUBJECT</TableHead>
                  <TableHead className="w-[140px]">STATUS</TableHead>
                  <TableHead className="w-[140px]">CREATED</TableHead>
                  <TableHead className="w-[100px] text-right">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inProgressRequests.map((request) => (
                  <TableRow key={request.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <span className="font-mono text-cyan-400">{request.id}</span>
                    </TableCell>
                    <TableCell>{request.subject}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeClass(request.status)}>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {request.created}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Enrolled Payers */}
      <div className="rounded-xl border bg-card">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">Enrolled Payers</h3>
          <Button size="default">
            <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4 mr-2" />
            New Enrollment
          </Button>
        </div>

        {enrolledPayers.length === 0 ? (
          <div className="p-12">
            <Empty>
              <EmptyContent>
                <EmptyTitle>No enrolled payers</EmptyTitle>
                <EmptyDescription>Add a new payer enrollment to get started.</EmptyDescription>
              </EmptyContent>
            </Empty>
          </div>
        ) : (
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">PAYER</TableHead>
                  <TableHead className="w-[140px]">EFFECTIVE DATE</TableHead>
                  <TableHead className="w-[140px]">RECRED DATE</TableHead>
                  <TableHead className="w-[160px]">DAYS UNTIL RECRED</TableHead>
                  <TableHead className="w-[120px]">STATUS</TableHead>
                  <TableHead className="w-[100px] text-right">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrolledPayers.map((payer) => (
                  <TableRow key={payer.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-foreground">{payer.name}</p>
                        <p className="text-xs text-muted-foreground">{payer.category}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {payer.effectiveDate}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {payer.recredDate}
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        'text-sm font-medium',
                        payer.daysUntilRecred > 180 && 'text-emerald-400',
                        payer.daysUntilRecred <= 180 && payer.daysUntilRecred > 90 && 'text-amber-400',
                        payer.daysUntilRecred <= 90 && 'text-red-400'
                      )}>
                        {payer.daysUntilRecred} days
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeClass(payer.status)}>
                        {payer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
