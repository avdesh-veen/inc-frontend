/**
 * WorkTypeFormWrapper Component
 * 
 * Wrapper for WorkTypeFormPage that handles routing.
 * Converts the modal-based form to a page-based form.
 */

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { WorkTypeFormPage } from './work-type-form-page';
import { appRoutes } from '@/lib/constants/navigation';
import type { WorkType } from '../../types/work-types';

interface WorkTypeFormWrapperProps {
  workType?: WorkType;
}

export function WorkTypeFormWrapper({ workType }: Readonly<WorkTypeFormWrapperProps>) {
  const router = useRouter();

  const handleClose = React.useCallback(() => {
    router.push(appRoutes.settings.workflow.workTypes);
  }, [router]);

  return (
    <WorkTypeFormPage
      workType={workType}
      onClose={handleClose}
    />
  );
}
