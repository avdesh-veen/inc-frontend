/**
 * Error boundary for work type edit page
 */

'use client';

import ErrorPage from '@/components/shared/error-page';

export default function EditWorkTypeError({ error }: Readonly<{ error: Error }>) {
  return <ErrorPage error={error} />;
}
