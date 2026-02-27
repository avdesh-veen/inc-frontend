"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { usePayerById } from "@/features/records/payer/hooks/use-payers";
import { PayerDetailHeader } from "./payer-detail-header";
import { PayerDetailTabs } from "./payer-detail-tabs";
import { PayerDetailSkeleton } from "./payer-detail-skeleton";

interface PayerDetailContentProps {
  payerId: string;
  activeTab: string;
}

export function PayerDetailContent({ payerId, activeTab }: Readonly<PayerDetailContentProps>) {
  const router = useRouter();
  const { data, isLoading, isError } = usePayerById(payerId);
  const payer = data?.data;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/records/payers")}
        className="w-fit gap-2 text-muted-foreground hover:text-foreground"
        aria-label="Back to payers list"
      >
        <HugeiconsIcon
          icon={ArrowLeft01Icon}
          className="size-4"
          strokeWidth={2}
          aria-hidden="true"
        />
        Back to Payers
      </Button>

      {isLoading && <PayerDetailSkeleton />}

      {isError && (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          Failed to load payer details. Please try again.
        </div>
      )}

      {payer && (
        <>
          <PayerDetailHeader payer={payer} />
          <PayerDetailTabs payer={payer} activeTab={activeTab} />
        </>
      )}
    </div>
  );
}
