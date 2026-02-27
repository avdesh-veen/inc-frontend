"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { TelephoneIcon, Mail01Icon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  MOCK_KB_ENTRIES,
  CONTACT_TYPE_STYLES,
  CONTACT_TYPE_CARD_STYLES,
  type KBEntry,
} from "@/features/records/payer/types";
import { StarRating } from "@/features/records/payer/components/shared/star-rating";
import { SuccessBadge } from "@/features/records/payer/components/shared/success-badge";
import { getInitials } from "@/features/records/payer/utils/format";

const STAT_CARDS = [
  { key: "total", label: "Total Contacts", borderColor: "border-emerald-500", labelColor: "text-emerald-400" },
  { key: "avgRating", label: "Avg Rating", borderColor: "border-amber-500", labelColor: "text-amber-400" },
  { key: "topPerformers", label: "Top Performers", borderColor: "border-blue-500", labelColor: "text-blue-400" },
  { key: "payersCovered", label: "Payers Covered", borderColor: "border-violet-500", labelColor: "text-violet-400" },
] as const;

const STATE_OPTIONS = [
  { value: "all", label: "All States" },
  { value: "PA", label: "Pennsylvania" },
  { value: "NJ", label: "New Jersey" },
  { value: "DE", label: "Delaware" },
  { value: "National", label: "National" },
];

const RATING_OPTIONS = [
  { value: "all", label: "All Ratings" },
  { value: "5", label: "5 Stars" },
  { value: "4", label: "4+ Stars" },
  { value: "3", label: "3+ Stars" },
];


function KBContactCard({ entry }: Readonly<{ entry: KBEntry }>) {
  const styles = CONTACT_TYPE_CARD_STYLES[entry.contactType] ?? {
    gradient: "from-slate-500 to-slate-600",
    hover: "hover:border-slate-500/30",
  };
  const badgeStyle =
    CONTACT_TYPE_STYLES[entry.contactType] ?? "bg-slate-500/20 text-slate-300";

  return (
    <Card
      className={cn(
        "p-5 transition-all cursor-pointer",
        styles.hover,
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm",
              styles.gradient,
            )}
          >
            {getInitials(entry.name)}
          </div>
          <div>
            <p className="font-semibold text-white">{entry.name}</p>
            <p className="text-xs text-white/50">{entry.title}</p>
          </div>
        </div>
        <StarRating rating={entry.rating} />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Badge
          variant="outline"
          className={cn("text-xs rounded-lg border-0", badgeStyle)}
        >
          {entry.contactType}
        </Badge>
        <span className="text-xs text-white/50">{entry.payerName}</span>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm">
          <HugeiconsIcon icon={TelephoneIcon} className="size-4 text-white/50" strokeWidth={2} aria-hidden="true" />
          <span className="text-white/60">{entry.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <HugeiconsIcon icon={Mail01Icon} className="size-4 text-white/50" strokeWidth={2} aria-hidden="true" />
          <span className="text-white/60 truncate">{entry.email}</span>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-white/[0.02] mb-3">
        <p className="text-xs text-white/50 line-clamp-2">{entry.notes}</p>
      </div>

      <div className="flex items-center gap-1 flex-wrap mb-3">
        {entry.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 text-white/50"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-rose-500/10 mb-3">
        <span className="text-[10px] text-rose-400 uppercase font-medium">
          Last Positive
        </span>
        <span className="text-xs text-white">
          {entry.lastPositiveDaysAgo}d ago by {entry.lastPositiveBy}
        </span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <span className="text-xs text-white/50">
          Response: <span className="text-white">{entry.responseTime}</span>
        </span>
        <div className="flex items-center gap-1">
          <span className="text-xs text-white/50">Success:</span>
          <SuccessBadge rate={entry.successRate} variant="span" />
        </div>
      </div>
    </Card>
  );
}

export function PayerKnowledgeBaseTab() {
  const [search, setSearch] = useState("");
  const [payerFilter, setPayerFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");

  const payers = useMemo(
    () => [...new Set(MOCK_KB_ENTRIES.map((e) => e.payerName))].sort(),
    [],
  );
  const types = useMemo(
    () => [...new Set(MOCK_KB_ENTRIES.map((e) => e.contactType))].sort(),
    [],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_KB_ENTRIES.filter((entry) => {
      if (
        q &&
        !entry.name.toLowerCase().includes(q) &&
        !entry.title.toLowerCase().includes(q) &&
        !entry.payerName.toLowerCase().includes(q) &&
        !entry.notes.toLowerCase().includes(q) &&
        !entry.tags.some((t) => t.toLowerCase().includes(q))
      )
        return false;
      if (payerFilter !== "all" && entry.payerName !== payerFilter) return false;
      if (stateFilter !== "all" && !entry.states.includes(stateFilter))
        return false;
      if (typeFilter !== "all" && entry.contactType !== typeFilter) return false;
      if (ratingFilter !== "all" && entry.rating < parseInt(ratingFilter, 10))
        return false;
      return true;
    });
  }, [search, payerFilter, stateFilter, typeFilter, ratingFilter]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const avgRating =
      total > 0
        ? (filtered.reduce((sum, e) => sum + e.rating, 0) / total).toFixed(1)
        : "0";
    const topPerformers = filtered.filter((e) => e.rating === 5).length;
    const payersCovered = new Set(filtered.map((e) => e.payerName)).size;
    return { total, avgRating, topPerformers, payersCovered };
  }, [filtered]);

  const statValues: Record<string, React.ReactNode> = {
    total: stats.total,
    avgRating: (
      <>
        {stats.avgRating}
        <span className="text-lg text-white/50">/5</span>
      </>
    ),
    topPerformers: stats.topPerformers,
    payersCovered: stats.payersCovered,
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="grid grid-cols-4 gap-4">
        {STAT_CARDS.map((stat) => (
          <Card key={stat.key} className={cn("p-4 border-l-4", stat.borderColor)}>
            <p
              className={cn(
                "text-xs font-semibold uppercase mb-1",
                stat.labelColor,
              )}
            >
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-white">
              {statValues[stat.key]}
            </p>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <Input
            placeholder="Search contacts, notes, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px]"
          />
          <Select value={payerFilter} onValueChange={setPayerFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Payers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payers</SelectItem>
              {payers.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={stateFilter} onValueChange={setStateFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent>
              {STATE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Ratings" />
            </SelectTrigger>
            <SelectContent>
              {RATING_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No contacts match your filters.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filtered.map((entry) => (
            <KBContactCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
