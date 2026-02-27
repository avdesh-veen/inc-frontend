/**
 * Edit Provider Page
 * 
 * Full page form for editing an existing provider.
 * Route: /records/providers/[id]/edit
 */

import { ProviderFormPage } from '@/features/records/providers/components';

interface EditProviderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProviderPage({ params }: Readonly<EditProviderPageProps>) {
  const { id } = await params;
  
  return <ProviderFormPage mode="edit" providerId={id as string} />;
}
