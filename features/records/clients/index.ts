/**
 * Client Feature Exports
 * 
 * Central export point for all client-related components, types, and utilities.
 */

// Types
export * from './types';

// Hooks
export * from './hooks/use-client-store';

// Utils
export * from './utils/helpers';

// Validations
export { createClientSchema, updateClientSchema } from '@/features/records/clients/validations/schemas';

// API
export * from './api/clients-tab/client';
export * from './api/clients-tab/actions';

// Components - Clients Tab
export { ClientsTab } from './components/clients-tab/clients-tab';
export { ClientsBoundary } from './components/clients-tab/clients-boundary';
export { ClientsGrid } from './components/clients-tab/clients-grid';
export { ClientsFilters } from './components/clients-tab/clients-filters';
export { ClientListHeader } from './components/clients-tab/client-list-header';

// Components - Client Form
export { ClientFormModal } from './components/client-form/client-form-modal';

// Components - Pagination
export { ClientPagination } from './components/client-pagination';

// Components - Detail
export { ClientDetailBoundary } from './components/client-detail/client-detail-boundary';
export { ClientDetailContent } from './components/client-detail/client-detail-content';
export { ClientDetailHeader } from './components/detail/client-detail-header';
export { ClientDetailTabs } from './components/detail/client-detail-tabs';
export { ClientMetricCards } from './components/detail/client-metric-cards';

// Components - Tabs
export { ClientOverviewTab } from './components/detail/tabs/client-overview-tab';
export { ClientProvidersTab } from './components/detail/tabs/client-providers-tab';
export { ClientEnrollmentsTab } from './components/detail/tabs/client-enrollments-tab';
export { ClientDocumentsTab } from './components/detail/tabs/client-documents-tab';
export { ClientPortalUsersTab } from './components/detail/tabs/client-portal-users-tab';
export { ClientBusinessEntitiesTab } from './components/detail/tabs/client-business-entities-tab';
export { ClientActivityTab } from './components/detail/tabs/client-activity-tab';
