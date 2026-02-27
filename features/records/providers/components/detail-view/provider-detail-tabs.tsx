/**
 * Provider Detail Tabs
 * 
 * Tab navigation with 9 tabs and URL-based state management.
 */

'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Provider } from '@/features/records/providers/types';
import { ProviderOverviewTab } from './tabs/provider-overview-tab';
import { ProviderProfileTab } from './tabs/provider-profile-tab';
import { ProviderCredentialsTab } from './tabs/provider-credentials-tab';
import { ProviderDocumentsTab } from './tabs/provider-documents-tab';
import { ProviderAffiliationsTab } from './tabs/provider-affiliations-tab';
import { ProviderEnrollmentsTab } from './tabs/provider-enrollments-tab';
import { ProviderCommunicationTab } from './tabs/provider-communication-tab';
import { ProviderNotificationsTab } from './tabs/provider-notifications-tab';
import { ProviderActivityTab } from './tabs/provider-activity-tab';

interface ProviderDetailTabsProps {
  provider: Provider;
}

export function ProviderDetailTabs({ provider }: Readonly<ProviderDetailTabsProps>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get('tab') || 'overview';

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);
    router.push(`?${params.toString()}`);
  };

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange} className="flex-1">
      <TabsList className="bg-glass-bg rounded-full p-1 h-auto">
        <TabsTrigger 
          value="overview"
          className="rounded-full px-5 py-2 text-sm font-medium"
        >
          Overview
        </TabsTrigger>
        <TabsTrigger 
          value="profile"
          className="rounded-full px-5 py-2 text-sm font-medium"
        >
          Profile
        </TabsTrigger>
        <TabsTrigger 
          value="credentials"
          className="rounded-full px-5 py-2 text-sm font-medium"
        >
          Credentials
        </TabsTrigger>
        <TabsTrigger 
          value="documents"
          className="rounded-full px-5 py-2 text-sm font-medium"
        >
          Documents
        </TabsTrigger>
        <TabsTrigger 
          value="affiliations"
          className="rounded-full px-5 py-2 text-sm font-medium"
        >
          Affiliations
        </TabsTrigger>
        <TabsTrigger 
          value="enrollments"
          className="rounded-full px-5 py-2 text-sm font-medium"
        >
          Enrollments
        </TabsTrigger>
        <TabsTrigger 
          value="communication"
          className="rounded-full px-5 py-2 text-sm font-medium"
        >
          Communication
        </TabsTrigger>
        <TabsTrigger 
          value="notifications"
          className="rounded-full px-5 py-2 text-sm font-medium"
        >
          Notifications
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
          <ProviderOverviewTab provider={provider} />
        </TabsContent>

        <TabsContent value="profile" className="m-0">
          <ProviderProfileTab provider={provider} />
        </TabsContent>

        <TabsContent value="credentials" className="m-0">
          <ProviderCredentialsTab provider={provider} />
        </TabsContent>

        <TabsContent value="documents" className="m-0">
          <ProviderDocumentsTab provider={provider} />
        </TabsContent>

        <TabsContent value="affiliations" className="m-0">
          <ProviderAffiliationsTab provider={provider} />
        </TabsContent>

        <TabsContent value="enrollments" className="m-0">
          <ProviderEnrollmentsTab provider={provider} />
        </TabsContent>

        <TabsContent value="communication" className="m-0">
          <ProviderCommunicationTab provider={provider} />
        </TabsContent>

        <TabsContent value="notifications" className="m-0">
          <ProviderNotificationsTab provider={provider} />
        </TabsContent>

        <TabsContent value="activity" className="m-0">
          <ProviderActivityTab provider={provider} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
