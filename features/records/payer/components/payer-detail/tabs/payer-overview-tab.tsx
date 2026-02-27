"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { MOCK_KB_ENTRIES, type PayerDetail } from "@/features/records/payer/types";
import { useClientAffiliations } from "@/features/records/payer/hooks/use-client-affiliations";
import { AddClientAffiliationModal } from "../add-client-affiliation-modal";

// ─── Component ────────────────────────────────────────────────────────────────

export function PayerOverviewTab({ payer }: Readonly<{ payer: PayerDetail }>) {
  const [affiliationModalOpen, setAffiliationModalOpen] = useState(false);

  const primaryContact = MOCK_KB_ENTRIES.find((e) =>
    e.payerName.toLowerCase().includes(payer.name.split(" ")[0].toLowerCase()),
  );

  const {
    data: affiliationsData,
    isLoading: affiliationsLoading,
  } = useClientAffiliations(payer.id, { limit: 10, page: 1 });

  const affiliations = affiliationsData?.data?.items ?? [];
  const totalEnrolled = affiliations.reduce(
    (sum, c) => sum + (c.enrolledProvidersCount ?? 0),
    0,
  );

  return (
    <div className="space-y-6">
      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard label="TAT" value={String(payer.tatDays)} unit="Days turnaround" />
        <StatCard
          label="Enrolled"
          value={String(totalEnrolled)}
          unit="Providers"
          valueClass="text-blue-400"
        />
        <StatCard
          label="Delegation"
          value={payer.isDelegated ? "Yes" : "No"}
          unit="Status"
          valueClass="text-slate-400"
        />
        <StatCard
          label="Panel"
          value={payer.panelStatus ? "Open" : "Closed"}
          unit="Current status"
          valueClass={payer.panelStatus ? "text-emerald-400" : "text-rose-400"}
        />
      </div>

      {/* ── Client Affiliations ── */}
      <Card>
        <CardContent className="p-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-foreground">
              Client Affiliations
              {affiliations.length > 0 && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({affiliations.length})
                </span>
              )}
            </h3>
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1"
              onClick={() => setAffiliationModalOpen(true)}
            >
              + Add Client
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Delegation status may vary by client based on individual agreements
          </p>

          <div className="space-y-2">
            {affiliationsLoading && (
              <>
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-28" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-24 rounded-lg" />
                  </div>
                ))}
              </>
            )}

            {!affiliationsLoading && affiliations.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">
                No client affiliations found.
              </p>
            )}

            {affiliations.map((affiliation) => {
              const initials = affiliation.clientName
                .split(" ")
                .slice(0, 2)
                .map((w) => w[0])
                .join("")
                .toUpperCase();
              const isDelegated = affiliation.delegationStatus?.toLowerCase() === "delegated";

              return (
                <div
                  key={affiliation.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {affiliation.clientName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {affiliation.enrolledProvidersCount} providers enrolled
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs rounded-lg border-0",
                        isDelegated
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-slate-500/20 text-slate-300",
                      )}
                    >
                      {isDelegated ? "Delegated" : "Non-Delegated"}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ── Payer Info + Contact Info ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-2">
            <h3 className="text-base font-bold text-foreground mb-4">Payer Information</h3>
            <dl className="space-y-3">
              <InfoRow label="Payer Name" value={payer.name} />
              <InfoRow
                label="Type"
                value={[payer.type, payer.subCategory].filter(Boolean).join(" — ") || "—"}
              />
              <InfoRow
                label="States Covered"
                value={payer.states.length > 0 ? payer.states.map((s) => s.code).join(", ") : "—"}
              />
              <InfoRow
                label="Submission Method"
                value={payer.submissionMethod ?? "—"}
              />
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-2">
            <h3 className="text-base font-bold text-foreground mb-4">Contact Information</h3>
            <dl className="space-y-3">
              <InfoRow label="Contact" value={primaryContact?.name ?? "Provider Enrollment"} />
              <InfoRow label="Phone" value={primaryContact?.phone ?? "—"} />
              <InfoRow label="Email" value={primaryContact?.email ?? "—"} />
              <InfoRow
                label="Portal"
                value={payer.portalUrl ?? payer.portalName ?? "—"}
                isLink={!!payer.portalUrl}
              />
            </dl>
          </CardContent>
        </Card>
      </div>

      <AddClientAffiliationModal
        open={affiliationModalOpen}
        onOpenChange={setAffiliationModalOpen}
        payerId={payer.id}
      />
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  unit,
  valueClass,
}: Readonly<{ label: string; value: string; unit: string; valueClass?: string }>) {
  return (
    <Card>
      <CardContent className="p-2">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-4">
          {label}
        </h3>
        <p className={cn("text-3xl font-bold", valueClass ?? "text-foreground")}>{value}</p>
        <p className="text-sm text-muted-foreground mt-1">{unit}</p>
      </CardContent>
    </Card>
  );
}

function InfoRow({
  label,
  value,
  isLink,
}: Readonly<{ label: string; value: string; isLink?: boolean }>) {
  return (
    <div className="flex justify-between items-start gap-4">
      <dt className="text-sm text-muted-foreground shrink-0">{label}</dt>
      {isLink ? (
        <dd className="text-sm text-emerald-400 text-right break-all">{value}</dd>
      ) : (
        <dd className="text-sm text-foreground text-right">{value}</dd>
      )}
    </div>
  );
}
