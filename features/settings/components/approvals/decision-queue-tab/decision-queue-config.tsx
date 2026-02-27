import { HugeiconsIcon } from "@hugeicons/react";
import { CheckCircle } from "@hugeicons/core-free-icons";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DecisionConfigForm } from "./decision-config-form";

export function DecisionQueueConfig() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          <HugeiconsIcon icon={CheckCircle} className="h-4 w-4 text-primary" />
          <span className="font-semibold text-base">
            Decision Queue Configuration
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <DecisionConfigForm />
      </CardContent>
    </Card>
  );
}
