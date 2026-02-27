"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { PayerDetail } from "@/features/records/payer/types";

export function PayerContractTab({ payer }: Readonly<{ payer: PayerDetail }>) {
  return (
    <Card>
      <CardContent className="p-2">
        <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-foreground">Contract Details</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Contract terms, rates, and agreement details for {payer.name} will appear here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
