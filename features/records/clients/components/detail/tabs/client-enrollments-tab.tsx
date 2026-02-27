
'use client';

import { useState } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';
import { PlusSignIcon } from '@hugeicons/core-free-icons';
import { ClientEnrollment } from '@/features/records/clients/types';
import { HugeiconsIcon } from '@hugeicons/react';
import { getEnrollmentTypeBadgeClass, getEnrollmentStatusBadgeClass, formatPayers } from '@/features/records/clients/utils/helpers';

interface ClientEnrollmentsTabProps {
  clientId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ClientEnrollmentsTab({ clientId }: Readonly<ClientEnrollmentsTabProps>) {
  const [enrollments] = useState<ClientEnrollment[]>([]);
  const [isLoading] = useState(false);



  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <h3 className="text-lg font-semibold">
          {enrollments.length} Enrollment Request{enrollments.length !== 1 ? 's' : ''}
        </h3>
        <Button size="default">
          <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Table */}
      
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">REQUEST ID</TableHead>
                <TableHead className="w-[200px]">PROVIDER</TableHead>
                <TableHead className="w-[180px]">TYPE</TableHead>
                <TableHead className="w-[200px]">PAYERS</TableHead>
                <TableHead className="w-[140px]">STATUS</TableHead>
                <TableHead className="w-[100px] text-right">DAYS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No enrollments yet
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
    </div>
  );
}
