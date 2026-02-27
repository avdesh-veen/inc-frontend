/**
 * Assignment Page (Server Component)
 * 
 * Configure assignment modes, routing rules, skill sets, and capacity.
 * Uses server/client component separation with boundary pattern for data fetching.
 */

import { Suspense } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

// Assignment Mode
import { AssignmentModeBoundary } from '@/features/settings/components/assignment/assignment-mode/assignment-mode-boundary';
import { AssignmentModeTab } from '@/features/settings/components/assignment/assignment-mode/assignment-mode-tab';

// Capacity
import { CapacityBoundary } from '@/features/settings/components/assignment/capacity/capacity-boundary';
import { CapacityTab } from '@/features/settings/components/assignment/capacity/capacity-tab';

// Routing Rules
import { RoutingRulesBoundary } from '@/features/settings/components/assignment/routing-rules/routing-rules-boundary';
import { RoutingRulesTab } from '@/features/settings/components/assignment/routing-rules/routing-rules-tab';

// Skill Sets
import { SkillSetsBoundary } from '@/features/settings/components/assignment/skill-sets/skill-sets-boundary';
import { SkillSetsTab } from '@/features/settings/components/assignment/skill-sets/skill-sets-tab';

// Tab configuration
const tabs = [
  { value: 'mode', label: 'Assignment Mode' },
  { value: 'routing', label: 'Routing Rules (DMN)' },
  { value: 'skills', label: 'Skill Sets' },
  { value: 'capacity', label: 'Capacity' },
] as const;

type TabValue = (typeof tabs)[number]['value'];

type Props = {
  searchParams: Promise<{
    tab?: TabValue;
  }>;
};

export default async function AssignmentPage(props: Readonly<Props>) {
  const searchParams = await props.searchParams;
  const currentTab = searchParams.tab ?? 'mode';

  return (
    <Tabs defaultValue={currentTab} className="space-y-6 cursor-pointer">
      {/* Client-side tabs navigation */}
      <TabsList variant="glass" className="cursor-pointer">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Assignment Mode Tab */}
      <TabsContent value="mode">
        <Suspense fallback={<TabLoadingSkeleton />}>
          <AssignmentModeBoundary>
            <AssignmentModeTab />
          </AssignmentModeBoundary>
        </Suspense>
      </TabsContent>

      {/* Routing Rules Tab */}
      <TabsContent value="routing">
        <Suspense fallback={<TabLoadingSkeleton />}>
          <RoutingRulesBoundary>
            <RoutingRulesTab />
          </RoutingRulesBoundary>
        </Suspense>
      </TabsContent>

      {/* Skill Sets Tab */}
      <TabsContent value="skills">
        <Suspense fallback={<TabLoadingSkeleton />}>
          <SkillSetsBoundary>
            <SkillSetsTab />
          </SkillSetsBoundary>
        </Suspense>
      </TabsContent>

      {/* Capacity Tab */}
      <TabsContent value="capacity">
        <Suspense fallback={<TabLoadingSkeleton />}>
          <CapacityBoundary>
            <CapacityTab />
          </CapacityBoundary>
        </Suspense>
      </TabsContent>
    </Tabs>
  );
}

function TabLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-48 rounded-xl" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}
