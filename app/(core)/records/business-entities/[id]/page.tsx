import { notFound } from "next/navigation";

import { getBusinessEntityDetailById } from "@/lib/constants/mock-data/business-entity-data";
import { BusinessEntityDetailContent } from "@/features/records/business-entities/components/business-entity-detail-content";
import type { TabValue } from "@/features/records/business-entities/components/detail/business-entity-detail-tabs";

const VALID_TABS: readonly TabValue[] = [
  "overview",
  "groupnpis",
  "locations",
  "providers",
  "contracts",
  "activity",
];

interface BusinessEntityDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function BusinessEntityDetailPage(
  props: Readonly<BusinessEntityDetailPageProps>
) {
  const { id } = await props.params;
  const { tab: tabParam } = await props.searchParams;

  const tab = (tabParam && VALID_TABS.includes(tabParam as TabValue))
    ? (tabParam as TabValue)
    : "overview";

  const entity = getBusinessEntityDetailById(id);
  if (!entity) notFound();

  return (
    <BusinessEntityDetailContent entity={entity} activeTab={tab} />
  );
}
