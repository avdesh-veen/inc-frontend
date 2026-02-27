import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SLAByTypeTable } from "./sla-by-type-table";

export function SLAByType() {
  
  return (
    <Card>
    <CardHeader>
      <CardTitle className="flex gap-2 items-center">
        <span className="font-semibold text-base">
          SLA By Type
        </span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <SLAByTypeTable />
    </CardContent>
  </Card>
  );
}