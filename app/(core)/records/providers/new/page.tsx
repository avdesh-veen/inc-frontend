/**
 * Add New Provider Page
 * 
 * Full page form for creating a new provider.
 * Route: /records/providers/new
 */

import { ProviderFormPage } from '@/features/records/providers/components';

export default function NewProviderPage() {
  return <ProviderFormPage mode="create" />;
}
