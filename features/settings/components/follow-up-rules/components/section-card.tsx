"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const SECTION_ICONS: Record<string, { className: string; d: string }> = {
  tag: {
    className: "text-violet-500",
    d: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
  },
  lightning: {
    className: "text-amber-500",
    d: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  copy: {
    className: "text-cyan-500",
    d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  },
  checklist: {
    className: "text-emerald-500",
    d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  },
  trend: {
    className: "text-rose-500",
    d: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  },
  clock: {
    className: "text-slate-500",
    d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  building: {
    className: "text-blue-500",
    d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  },
  bell: {
    className: "text-amber-500",
    d: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  },
};

export type SectionIconKey = keyof typeof SECTION_ICONS;

function SectionIcon({ name }: { name: SectionIconKey }) {
  const { className, d } = SECTION_ICONS[name];
  return (
    <svg
      className={cn("size-4", className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={d}
      />
    </svg>
  );
}

export interface SectionCardProps {
  title: string;
  iconKey: SectionIconKey;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  iconKey,
  action,
  children,
}: SectionCardProps) {
  return (
    <Card className="p-4 gap-0">
      <div className="flex items-center justify-between mb-3">
        {" "}
        <h3 className="text-sm font-bold text-white/70 flex items-center gap-2">
          <SectionIcon name={iconKey} />
          {title}
        </h3>
        {action}
      </div>{" "}
      {children}
    </Card>
  );
}
