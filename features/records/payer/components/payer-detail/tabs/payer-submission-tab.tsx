"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MOCK_KB_ENTRIES, type PayerDetail } from "@/features/records/payer/types";

export function PayerSubmissionTab({ payer }: Readonly<{ payer: PayerDetail }>) {
  const payerKey = payer.name.split(" ")[0].toLowerCase();

  const primaryContact = MOCK_KB_ENTRIES.find((e) =>
    e.payerName.toLowerCase().includes(payerKey),
  );

  const portalUrl = payer.portalUrl ?? `https://www.${payer.name
    .split(" ")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")}-solutions.com`;

  const isGovernment = payer.type?.toLowerCase() === "government";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* ── Submission Methods ── */}
      <Card>
        <CardContent className="p-2">
          <h3 className="text-base font-bold text-foreground mb-4">Submission Methods</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-start gap-4">
              <span className="text-sm text-muted-foreground shrink-0">Primary Method</span>
              <span className="text-sm text-foreground text-right">
                {isGovernment ? "PECOS + CMS-855" : "Provider Portal / CAQH"}
              </span>
            </div>

            <div className="flex justify-between items-start gap-4">
              <span className="text-sm text-muted-foreground shrink-0">Provider Portal</span>
              <a
                href={portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-emerald-400 hover:text-emerald-300 break-all text-right"
              >
                {portalUrl}
              </a>
            </div>

            <div className="flex justify-between items-start gap-4">
              <span className="text-sm text-muted-foreground shrink-0">CAQH Required</span>
              <span className="text-sm text-foreground">
                {payer.isDelegated ? "Yes" : "No"}
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="mt-6 w-full"
            onClick={() => window.open(portalUrl, "_blank")}
          >
            Open Provider Portal
          </Button>
        </CardContent>
      </Card>

      {/* ── Provider Relations ── */}
      <Card>
        <CardContent className="p-2">
          <h3 className="text-base font-bold text-foreground mb-4">Provider Relations</h3>

          <div className="space-y-4">
            <div>
              <span className="text-sm text-muted-foreground block mb-1">Contact Name</span>
              <span className="text-sm text-foreground">
                {primaryContact?.name ?? "Provider Enrollment"}
              </span>
            </div>

            <div>
              <span className="text-sm text-muted-foreground block mb-1">Phone</span>
              <span className="text-sm text-foreground">
                {primaryContact?.phone ?? "—"}
              </span>
            </div>

            <div>
              <span className="text-sm text-muted-foreground block mb-1">Email</span>
              {primaryContact?.email ? (
                <a
                  href={`mailto:${primaryContact.email}`}
                  className="text-sm text-emerald-400 hover:text-emerald-300 break-all"
                >
                  {primaryContact.email}
                </a>
              ) : (
                <span className="text-sm text-foreground">—</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
