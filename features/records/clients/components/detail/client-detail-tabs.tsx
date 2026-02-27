/**
 * Client Detail Tabs
 * 
 * Tab navigation and content for client detail page.
 * Includes: Overview, Providers, Business Entities, Enrollments, Documents, Portal Users, Activity
 */

'use client';

import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Client } from '@/features/records/clients/types';
import { ClientOverviewTab } from './tabs/client-overview-tab';
import { ClientProvidersTab } from './tabs/client-providers-tab';
import { ClientBusinessEntitiesTab } from './tabs/client-business-entities-tab';
import { ClientEnrollmentsTab } from './tabs/client-enrollments-tab';
import { ClientDocumentsTab } from './tabs/client-documents-tab';
import { ClientPortalUsersTab } from './tabs/client-portal-users-tab';
import { ClientActivityTab } from './tabs/client-activity-tab';

interface ClientDetailTabsProps {
  client: Client;
  activeTab: string;
}

export function ClientDetailTabs({ client, activeTab }: Readonly<ClientDetailTabsProps>) {
  const router = useRouter();

  const handleTabChange = (value: string) => {
    router.push(`/records/clients/${client.id}?tab=${value}`);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1">
      <TabsList className="bg-glass-bg rounded-full p-1 h-auto">
        <TabsTrigger 
          value="overview"
          className="rounded-full px-5 py-2 text-sm font-medium"
        >
          Overview
        </TabsTrigger>
        <TabsTrigger 
          value="providers"
          className="rounded-full px-5 py-2 text-sm font-medium"
        >
          Providers
        </TabsTrigger>
        <TabsTrigger 
          value="business-entities"
          className="rounded-full px-5 py-2 text-sm font-medium"
        >
          Business Entities
        </TabsTrigger>
        <TabsTrigger 
          value="enrollments"
          className="rounded-full px-5 py-2 text-sm font-medium"
        >
          Enrollments
        </TabsTrigger>
        <TabsTrigger 
          value="documents"
          className="rounded-full px-5 py-2 text-sm font-medium"
        >
          Documents
        </TabsTrigger>
        <TabsTrigger 
          value="portal-users"
          className="rounded-full px-5 py-2 text-sm font-medium"
        >
          Portal Users
        </TabsTrigger>
        <TabsTrigger 
          value="activity"
          className="rounded-full px-5 py-2 text-sm font-medium"
        >
          Activity
        </TabsTrigger>
      </TabsList>

      <div className="mt-6">
        <TabsContent value="overview" className="m-0">
          <ClientOverviewTab client={client} />
        </TabsContent>

        <TabsContent value="providers" className="m-0">
          <ClientProvidersTab clientId={client.id} />
        </TabsContent>

        <TabsContent value="business-entities" className="m-0">
          <ClientBusinessEntitiesTab clientId={client.id} />
        </TabsContent>

        <TabsContent value="enrollments" className="m-0">
          <ClientEnrollmentsTab clientId={client.id} />
        </TabsContent>

        <TabsContent value="documents" className="m-0">
          <ClientDocumentsTab clientId={client.id} />
        </TabsContent>

        <TabsContent value="portal-users" className="m-0">
          <ClientPortalUsersTab clientId={client.id} />
        </TabsContent>

        <TabsContent value="activity" className="m-0">
          <ClientActivityTab clientId={client.id} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
