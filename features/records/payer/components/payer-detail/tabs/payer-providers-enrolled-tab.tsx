"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PayerDetail } from "@/features/records/payer/types";
import { getInitials } from "@/features/records/payer/utils/format";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_ENROLLED_PROVIDERS = [
  { id: "PRV001",  name: "Dr. Jennifer Chen, MD",        specialty: "Internal Medicine",     npi: "1234567890", effectiveDate: "2022-03-15", recredDate: "2025-03-15", daysUntilRecred: 185 },
  { id: "PRV003",  name: "Dr. Michael Torres, DO",       specialty: "Cardiology",             npi: "9876543210", effectiveDate: "2012-08-01", recredDate: "2025-08-01", daysUntilRecred: 35  },
  { id: "PRV004",  name: "Dr. Emily Rodriguez, MD",      specialty: "Pediatrics",             npi: "5555555555", effectiveDate: "2015-10-01", recredDate: "2025-10-01", daysUntilRecred: 320 },
  { id: "PRV006",  name: "Sarah Thompson, FNP-C",        specialty: "Family Medicine",        npi: "1357924680", effectiveDate: "2018-09-15", recredDate: "2025-09-15", daysUntilRecred: 420 },
  { id: "EUC001",  name: "Dr. James Morrison, MD",       specialty: "Emergency Medicine",     npi: "1122334401", effectiveDate: "2024-02-01", recredDate: "2027-02-01", daysUntilRecred: 380 },
  { id: "EUC002",  name: "Dr. Sarah Chen, MD",           specialty: "Family Medicine",        npi: "1122334402", effectiveDate: "2024-02-01", recredDate: "2027-02-01", daysUntilRecred: 520 },
  { id: "EUC003",  name: "Dr. Michael Torres, DO",       specialty: "Internal Medicine",      npi: "1122334403", effectiveDate: "2024-01-15", recredDate: "2027-01-15", daysUntilRecred: 290 },
  { id: "EUC004",  name: "Dr. Lisa Patel, MD",           specialty: "Emergency Medicine",     npi: "1122334404", effectiveDate: "2024-03-01", recredDate: "2027-03-01", daysUntilRecred: 445 },
  { id: "EUC005",  name: "Marcus Williams, PA-C",        specialty: "Urgent Care",            npi: "1122334405", effectiveDate: "2023-08-01", recredDate: "2026-08-01", daysUntilRecred: 280 },
  { id: "EUC006",  name: "Jessica Martinez, PA-C",       specialty: "Urgent Care",            npi: "1122334406", effectiveDate: "2022-05-01", recredDate: "2025-05-01", daysUntilRecred: 340 },
  { id: "EUC007",  name: "Brian Thompson, PA-C",         specialty: "Urgent Care",            npi: "1122334407", effectiveDate: "2024-03-01", recredDate: "2027-03-01", daysUntilRecred: 200 },
  { id: "EUC010",  name: "Ryan Garcia, PA-C",            specialty: "Urgent Care",            npi: "1122334410", effectiveDate: "2024-08-01", recredDate: "2027-08-01", daysUntilRecred: 700 },
  { id: "EUC011",  name: "Patricia Lewis, CRNP",         specialty: "Family Medicine",        npi: "1122334411", effectiveDate: "2020-06-01", recredDate: "2026-06-01", daysUntilRecred: 450 },
  { id: "EUC012",  name: "Michelle Carter, CRNP",        specialty: "Adult-Gerontology",      npi: "1122334412", effectiveDate: "2019-06-01", recredDate: "2025-06-01", daysUntilRecred: 72  },
  { id: "EUC013",  name: "Stephanie Wong, CRNP",         specialty: "Family Medicine",        npi: "1122334413", effectiveDate: "2022-10-01", recredDate: "2025-10-01", daysUntilRecred: 591 },
  { id: "EUC014",  name: "Rebecca Hall, CRNP",           specialty: "Adult Medicine",         npi: "1122334414", effectiveDate: "2021-09-01", recredDate: "2024-09-01", daysUntilRecred: 180 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function recredDaysColor(days: number): string {
  if (days < 90)  return "text-rose-400";
  if (days < 180) return "text-amber-400";
  return "text-emerald-400";
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PayerProvidersEnrolledTab({ payer: _payer }: Readonly<{ payer: PayerDetail }>) {
  return (
    <Card>
      <CardContent className="p-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-foreground">Enrolled Providers</h3>
          <Button
            variant="ghost"
            size="sm"
            className="px-4 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 hover:text-emerald-200"
          >
            + New Enrollment
          </Button>
        </div>

        {/* Provider list */}
        <div className="space-y-3">
          {MOCK_ENROLLED_PROVIDERS.map((provider) => (
            <button
              type="button"
              key={provider.id}
              className="flex items-center justify-between w-full p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] cursor-pointer transition-colors text-left"
              aria-label={`View provider ${provider.name}`}
            >
              {/* Left: avatar + info */}
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm shrink-0"
                  aria-hidden="true"
                >
                  {getInitials(provider.name)}
                </div>
                <div>
                  <p className="font-medium text-foreground">{provider.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {provider.specialty} &bull; NPI: {provider.npi}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Effective: {provider.effectiveDate} &bull; Recred: {provider.recredDate}
                  </p>
                </div>
              </div>

              {/* Right: status + days */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="px-2 py-1 rounded-lg text-xs font-medium bg-emerald-500/20 text-emerald-300">
                  Active
                </span>
                <span className={cn("text-sm font-medium", recredDaysColor(provider.daysUntilRecred))}>
                  {provider.daysUntilRecred} days
                </span>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
