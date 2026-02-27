"use client";

import { Button } from "@/components/ui/button";
import { useApplyDefaultWorkTypeRules } from "@/features/settings/hooks/use-work-type-rules";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Loading03Icon } from "@hugeicons/core-free-icons";

export function ApplyDefaultAction({
  workTypeIds,
}: Readonly<{ workTypeIds: string[] }>) {
  const { mutate: applyDefaultWorkTypeRules, isPending } =
    useApplyDefaultWorkTypeRules({ workTypeIds });

  return (
    <Button
      onClick={() => applyDefaultWorkTypeRules()}
      disabled={isPending}
      variant="outline"
    >
      {isPending ? (
        <HugeiconsIcon icon={Loading03Icon} className="size-4" />
      ) : (
        <HugeiconsIcon icon={Add01Icon} className="size-4" />
      )}

      <span className="text-sm font-medium">Apply Defaults</span>
    </Button>
  );
}
