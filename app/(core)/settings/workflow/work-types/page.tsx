/**
 * Work Types Page (Server Component)
 * 
 * Main page for managing work type definitions, categories, and workflow stages.
 * Server component that uses boundary pattern for data fetching with Suspense.
 * Implements server-side rendering with client-side interactions for actions and filters.
 */

import { Suspense } from 'react';
import { WorkTypesBoundary } from '@/features/settings/components/work-types/work-types-boundary';
import { WorkTypesTab } from '@/features/settings/components/work-types/work-types-tab';
import { WorkTypesPageSkeleton } from '@/features/settings/components/work-types/work-types-skeleton';

interface WorkTypesPageProps {
  searchParams?: Promise<{
    search?: string;
    isActive?: string;
    categoryId?: string;
    complexityLevel?: 'low' | 'medium' | 'high';
    providerSignature?: string;
    psvRequired?: string;
    sort?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function WorkTypesPage({ searchParams }: Readonly<WorkTypesPageProps>) {
  const params = await searchParams;

  return (
    <Suspense fallback={<WorkTypesPageSkeleton />}>
      <WorkTypesBoundary searchParams={params}>
        <WorkTypesTab />
      </WorkTypesBoundary>
    </Suspense>
  );
}

