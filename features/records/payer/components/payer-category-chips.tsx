"use client";

import { useMemo, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PAYER_CATEGORY_CONFIG, MOCK_PAYERS } from "@/features/records/payer/types";

interface PayerCategoryChipsProps {
  activeCategory: string | null;
}

const CATEGORY_TO_CODE: Record<string, string> = {
  Government: "government",
  Commercial: "commercial",
  "Workers Comp": "workers_comp",
};

export function PayerCategoryChips({ activeCategory }: Readonly<PayerCategoryChipsProps>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const payer of MOCK_PAYERS) {
      counts[payer.category] = (counts[payer.category] || 0) + 1;
    }
    return counts;
  }, []);

  const categories = Object.entries(PAYER_CATEGORY_CONFIG).filter(
    ([cat]) => categoryCounts[cat],
  );

  const handleClick = (categoryCode: string) => {
    const params = new URLSearchParams(searchParams);
    if (activeCategory === categoryCode) {
      params.delete("category");
    } else {
      params.set("category", categoryCode);
    }
    params.set("page", "1");
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <div className={`flex items-center gap-2 transition-opacity duration-200 ${isPending ? "opacity-60 pointer-events-none" : ""}`}>
      {categories.map(([cat, config]) => {
        const code = CATEGORY_TO_CODE[cat];
        const isActive = activeCategory === code;
        return (
          <Button
            key={cat}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleClick(code)}
            className={cn(
              "gap-1.5 px-3 py-1.5 rounded-lg transition-all h-auto",
              config.bgClass,
              isActive && "ring-1 ring-white/20",
            )}
          >
            <span>{config.icon}</span>
            <span className={cn("text-xs", config.colorClass)}>{cat}</span>
            <span className={cn("text-xs font-bold", config.colorClass)}>
              {categoryCounts[cat]}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
