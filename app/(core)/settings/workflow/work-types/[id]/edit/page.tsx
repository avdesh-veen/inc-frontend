/**
 * Work Type Edit Page (Server Component)
 * 
 * Page for editing an existing work type definition.
 * Server component that fetches work type data and passes it to the form.
 */

import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { WorkTypeFormWrapper } from '@/features/settings/components/work-types/work-type-form-wrapper';
import { getWorkTypeByIdServer } from '@/features/settings/api/work-types/server';
import { appRoutes } from '@/lib/constants/navigation';

interface EditWorkTypePageProps {
  params: Promise<{
    id: string;
  }>;
}

function EditWorkTypeLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-8">
      <div className="p-6 rounded-[24px] border border-white/6 bg-white/3 backdrop-blur-2xl">
        <div className="mt-6 space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-glass-bg rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-glass-bg rounded w-2/3 mb-8"></div>
            <div className="space-y-4">
              <div className="h-10 bg-glass-bg rounded"></div>
              <div className="h-10 bg-glass-bg rounded"></div>
              <div className="h-10 bg-glass-bg rounded"></div>
              <div className="h-32 bg-glass-bg rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function EditWorkTypePage(props: Readonly<EditWorkTypePageProps>) {
  const { id } = await props.params;

  if (!id) {
    redirect(appRoutes.settings.workflow.workTypes);
  }

  const response = await getWorkTypeByIdServer(id);
  
  if (!response.data) {
    redirect(appRoutes.settings.workflow.workTypes);
  }

  const workType = response.data;

  return (
    <Suspense fallback={<EditWorkTypeLoading />}>
      <div className="flex flex-1 flex-col gap-6 p-8">
        <div className="p-6 rounded-[24px] border border-white/6 bg-white/3 backdrop-blur-2xl">
          <div className="mt-6">
            <WorkTypeFormWrapper workType={workType} />
          </div>
        </div>
      </div>
    </Suspense>
  );
}
