"use client";

import { useMemo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChartIncreaseIcon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MOCK_KB_ENTRIES, type KBEntry } from "@/features/records/payer/types";
import { StarRating } from "@/features/records/payer/components/shared/star-rating";
import { getInitials } from "@/features/records/payer/utils/format";

function TopContactCard({ entry }: Readonly<{ entry: KBEntry }>) {
  return (
    <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
          {getInitials(entry.name)}
        </div>
        <div>
          <p className="font-medium text-white">{entry.name}</p>
          <p className="text-xs text-white/50">{entry.payerName}</p>
        </div>
      </div>
      <p className="text-xs text-white/50 mb-2 line-clamp-2">
        {entry.notes}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-emerald-400">
          {entry.successRate}% success
        </span>
        <StarRating rating={entry.rating} showEmpty={false} />
      </div>
    </div>
  );
}

const PRO_TIPS = [
  { icon: "\uD83C\uDFE5", payer: "Medicare/Novitas", tip: "Call early (7-8 AM ET) to avoid 30+ min hold times. Have PTAN ready before calling." },
  { icon: "\uD83D\uDC99", payer: "Highmark", tip: "Email is fastest for delegated clients. Amanda Wilson responds within 24 hrs for Keystone Medical." },
  { icon: "\uD83D\uDD34", payer: "United Healthcare", tip: "Panel mostly CLOSED. For exceptions, need detailed member access justification + network adequacy data." },
  { icon: "\u2B50", payer: "UPMC", tip: "Best delegation support. Use secure portal for rosters - processed same day before 2 PM." },
  { icon: "\uD83D\uDD35", payer: "Independence Blue Cross", tip: "NaviNet required for most submissions. Contact David Park for Philadelphia region questions." },
] as const;

const BEST_TIMES = [
  { time: "7-8 AM ET", desc: "Best for call centers - shortest wait times", payers: "Medicare, UHC, Aetna", color: "emerald" },
  { time: "10 AM - 2 PM ET", desc: "Best for individual contacts", payers: "Highmark, IBX, UPMC", color: "blue" },
  { time: "4-5 PM ET", desc: "Second best for call centers", payers: "All national payers", color: "amber" },
  { time: "Tuesday-Thursday", desc: "Best days for escalations", payers: "All payers", color: "violet" },
] as const;

const TIME_COLOR_MAP: Record<string, { border: string; text: string; bg: string }> = {
  emerald: { border: "border-emerald-500/20", text: "text-emerald-400", bg: "bg-emerald-500/5" },
  blue: { border: "border-blue-500/20", text: "text-blue-400", bg: "bg-blue-500/5" },
  amber: { border: "border-amber-500/20", text: "text-amber-400", bg: "bg-amber-500/5" },
  violet: { border: "border-violet-500/20", text: "text-violet-400", bg: "bg-violet-500/5" },
};

function EscalationCard({ entry }: Readonly<{ entry: KBEntry }>) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-500/5 border border-rose-500/20">
      <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center shrink-0">
        <HugeiconsIcon
          icon={ChartIncreaseIcon}
          className="size-4 text-rose-400"
          strokeWidth={2}
          aria-hidden="true"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-white text-sm">{entry.payerName}</p>
        <p className="text-xs text-white/60">
          {entry.name} - {entry.title}
        </p>
        <p className="text-xs text-white/50 mt-1 line-clamp-2">
          {entry.notes}
        </p>
      </div>
    </div>
  );
}

export function PayerInsightsTab() {
  const topContacts = useMemo(
    () =>
      [...MOCK_KB_ENTRIES]
        .sort((a, b) => b.successRate - a.successRate || b.rating - a.rating)
        .slice(0, 6),
    [],
  );

  const escalationContacts = useMemo(
    () =>
      MOCK_KB_ENTRIES.filter(
        (e) =>
          e.contactType === "Escalation" ||
          e.contactType === "Executive Escalation",
      ),
    [],
  );

  return (
    <div className="space-y-6 mt-4">
      <Card className="p-5">
        <h3 className="text-base font-bold text-white mb-4">
          Top Rated Contacts (Go-To People)
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {topContacts.map((entry) => (
            <TopContactCard key={entry.id} entry={entry} />
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="text-base font-bold text-white mb-4">
            Pro Tips by Payer
          </h3>
          <div className="space-y-4">
            {PRO_TIPS.map((tip) => (
              <div
                key={tip.payer}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02]"
              >
                <span className="text-xl shrink-0">{tip.icon}</span>
                <div>
                  <p className="font-medium text-white text-sm">{tip.payer}</p>
                  <p className="text-xs text-white/50">{tip.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-base font-bold text-white mb-4">
            Escalation Paths
          </h3>
          <div className="space-y-4">
            {escalationContacts.map((entry) => (
              <EscalationCard key={entry.id} entry={entry} />
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="text-base font-bold text-white mb-4">
          Best Times to Contact
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {BEST_TIMES.map((slot) => {
            const colors = TIME_COLOR_MAP[slot.color];
            return (
              <div
                key={slot.time}
                className={cn(
                  "p-4 rounded-xl border",
                  colors.bg,
                  colors.border,
                )}
              >
                <p className={cn("font-bold mb-1", colors.text)}>
                  {slot.time}
                </p>
                <p className="text-sm text-white mb-2">{slot.desc}</p>
                <p className="text-xs text-white/50">{slot.payers}</p>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="flex justify-center">
        <Button variant="outline" size="lg" className="gap-2">
          <HugeiconsIcon
            icon={PlusSignIcon}
            className="size-5"
            strokeWidth={2}
            aria-hidden="true"
          />
          Add New Tip or Insight
        </Button>
      </div>
    </div>
  );
}
