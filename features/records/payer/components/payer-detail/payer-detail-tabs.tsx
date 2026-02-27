"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { PayerDetail } from "@/features/records/payer/types";
import { usePayerContacts } from "@/features/records/payer/hooks/use-payer-contacts";
import { PayerOverviewTab } from "./tabs/payer-overview-tab";
import { PayerContactsDetailTab } from "./tabs/payer-contacts-detail-tab";
import { PayerContractTab } from "./tabs/payer-contract-tab";
import { PayerProvidersEnrolledTab } from "./tabs/payer-providers-enrolled-tab";
import { PayerSubmissionTab } from "./tabs/payer-submission-tab";
import { PayerProcessTab } from "./tabs/payer-process-tab";

const VALID_TABS = ["overview", "contacts", "contract", "providers", "submission", "process"] as const;
type PayerDetailTab = (typeof VALID_TABS)[number];

interface PayerDetailTabsProps {
  payer: PayerDetail;
  activeTab: string;
}

export function PayerDetailTabs({ payer, activeTab }: Readonly<PayerDetailTabsProps>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const validTab: PayerDetailTab = (VALID_TABS as readonly string[]).includes(activeTab)
    ? (activeTab as PayerDetailTab)
    : "overview";

  const { data: contactsData } = usePayerContacts(payer.id);
  const contactsCount = contactsData?.data?.meta?.totalItems ?? 0;

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams);
    if (tab === "overview") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <Tabs value={validTab} onValueChange={handleTabChange}>
      <TabsList className="h-auto p-1 flex-wrap">
        <TabsTrigger value="overview">Overview</TabsTrigger>

        <TabsTrigger value="contacts" className="gap-1.5">
          Contacts
          {contactsCount > 0 && (
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/30 text-emerald-300">
              {contactsCount}
            </span>
          )}
        </TabsTrigger>

        <TabsTrigger value="contract">Contract Details</TabsTrigger>
        <TabsTrigger value="providers">Enrolled Providers</TabsTrigger>
        <TabsTrigger value="submission">Submission Info</TabsTrigger>

        <TabsTrigger value="process" className="gap-1.5">
          {"Process Guide"}
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/30 text-emerald-300">
            ✓
          </span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        <PayerOverviewTab payer={payer} />
      </TabsContent>

      <TabsContent value="contacts" className="mt-6">
        <PayerContactsDetailTab payer={payer} />
      </TabsContent>

      <TabsContent value="contract" className="mt-6">
        <PayerContractTab payer={payer} />
      </TabsContent>

      <TabsContent value="providers" className="mt-6">
        <PayerProvidersEnrolledTab payer={payer} />
      </TabsContent>

      <TabsContent value="submission" className="mt-6">
        <PayerSubmissionTab payer={payer} />
      </TabsContent>

      <TabsContent value="process" className="mt-6">
        <PayerProcessTab payer={payer} />
      </TabsContent>
    </Tabs>
  );
}
