"use client";

import { useRouter } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BusinessEntityDetail } from "@/features/records/business-entities/types";
import { appRoutes } from "@/lib/constants/navigation";
import { OverviewTab } from "../overview-tab/overview-tab";
import { GroupNpisTab } from "../group-npis-tab/group-npis-tab";
import { LocationsTab } from "../locations-tab/locations-tab";
import { ProvidersTab } from "../providers-tab/providers-tab";
import { ContractsTab } from "../contracts-tab/contracts-tab";
import { ActivityTab } from "../activity-tab/activity-tab";

const TAB_VALUES = [
  { value: "overview", label: "Overview" },
  { value: "groupnpis", label: "Group NPIs" },
  { value: "locations", label: "Locations" },
  { value: "providers", label: "Affiliated Providers" },
  { value: "contracts", label: "Payer Contracts" },
  { value: "activity", label: "Activity" },
] as const;

export type TabValue = (typeof TAB_VALUES)[number]["value"];

interface BusinessEntityDetailTabsProps {
  entity: BusinessEntityDetail;
  activeTab: TabValue;
}

export function BusinessEntityDetailTabs({
  entity,
  activeTab,
}: Readonly<BusinessEntityDetailTabsProps>) {
  const router = useRouter();

  const handleTabChange = (value: string) => {
    router.push(appRoutes.records.businessEntityDetails(entity.id, value));
  };

  const currentTab = TAB_VALUES.some((t) => t.value === activeTab)
    ? activeTab
    : "overview";

  return (
    <Tabs
      value={currentTab}
      onValueChange={handleTabChange}
      className="flex-1"
    >
      <TabsList
        variant="default"
        className="flex flex-wrap gap-1 rounded-2xl border border-white/5 bg-white/[0.02] p-1"
      >
        {TAB_VALUES.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="rounded-xl px-4 py-2.5 text-sm font-medium"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="mt-6">
        <TabsContent value="overview" className="m-0">
          <OverviewTab entity={entity} />
        </TabsContent>
        <TabsContent value="groupnpis" className="m-0">
          <GroupNpisTab entity={entity} />
        </TabsContent>
        <TabsContent value="locations" className="m-0">
          <LocationsTab entity={entity} />
        </TabsContent>
        <TabsContent value="providers" className="m-0">
          <ProvidersTab entity={entity} />
        </TabsContent>
        <TabsContent value="contracts" className="m-0">
          <ContractsTab entity={entity} />
        </TabsContent>
        <TabsContent value="activity" className="m-0">
          <ActivityTab entity={entity} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
