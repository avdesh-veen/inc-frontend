"use client";

import { useRouter } from "next/navigation";

import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { appRoutes } from "@/lib/constants/navigation";
import type { BusinessEntityDetail } from "@/features/records/business-entities/types";
import { BusinessEntityDetailHeader } from "./detail/business-entity-detail-header";
import {
  BusinessEntityDetailTabs,
  type TabValue,
} from "./detail/business-entity-detail-tabs";

interface BusinessEntityDetailContentProps {
  entity: BusinessEntityDetail;
  activeTab: TabValue;
}

export function BusinessEntityDetailContent({
  entity,
  activeTab,
}: Readonly<BusinessEntityDetailContentProps>) {
  const router = useRouter();

  const handleBack = () => {
    router.push(appRoutes.records.businessEntities);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBack}
        className="mb-4 w-fit gap-2 text-sm text-white/50 hover:text-white"
      >
        <HugeiconsIcon
          icon={ArrowLeft01Icon}
          className="h-4 w-4"
          strokeWidth={2}
        />
        Back to Business Entities
      </Button>

      <BusinessEntityDetailHeader entity={entity} />

      <BusinessEntityDetailTabs entity={entity} activeTab={activeTab} />
    </div>
  );
}
