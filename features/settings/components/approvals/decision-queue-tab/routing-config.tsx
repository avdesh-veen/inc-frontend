import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DefaultRoutingTable } from "./default-routing-table";

export function RoutingConfig() {
  return (
    <Card className="" >
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          <span className="font-semibold text-base">
            Default Routing Configuration
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent >
        <DefaultRoutingTable />
      </CardContent>
    </Card>
  );
}
