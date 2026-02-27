import { AppLogo } from "@/components/shared/app-logo";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CardLoadingContent() {
  return (
    <div className="space-y-6">
      <AppLogo />

      <Card className="bg-glass-bg border-border">
        <CardHeader className="text-center pb-6 space-y-2">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>

          <Skeleton className="h-10 w-full mt-6" />

          <Skeleton className="h-4 w-40 mx-auto" />
        </CardContent>
      </Card>
    </div>
  );
}
