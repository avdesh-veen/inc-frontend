"use client";

import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon, UserAdd01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { usePayerStore } from "@/features/records/payer/hooks/use-payer-store";

export function PayerListHeader() {
  const router = useRouter();
  const { openContactModal } = usePayerStore();

  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Payer Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage payers, contacts, and knowledge base
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={openContactModal}
          className="gap-2"
          aria-label="Add new payer contact"
        >
          <HugeiconsIcon
            icon={UserAdd01Icon}
            className="size-4"
            strokeWidth={2}
            aria-hidden="true"
          />
          Add Contact
        </Button>
        <Button
          onClick={() => router.push("/records/payers/new")}
          className="gap-2"
          aria-label="Add new payer"
        >
          <HugeiconsIcon
            icon={PlusSignIcon}
            className="size-4"
            strokeWidth={2}
            aria-hidden="true"
          />
          Add Payer
        </Button>
      </div>
    </div>
  );
}
