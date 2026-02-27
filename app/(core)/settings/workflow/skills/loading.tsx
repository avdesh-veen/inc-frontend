import { Skeleton } from "@/components/ui/skeleton";

const CARD_IDS = ["card-a", "card-b", "card-c"] as const;

export default function SkillsLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex gap-2">
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-8 w-64" />
          {CARD_IDS.map((id) => (
            <Skeleton key={id} className="h-48 w-full rounded-[24px]" />
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-36 w-full rounded-[24px]" />
          <Skeleton className="h-48 w-full rounded-[24px]" />
        </div>
      </div>
    </div>
  );
}
