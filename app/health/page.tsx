import { getHealthStatus } from "@/features/health/api/server";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AppLogo } from "@/components/shared/app-logo";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default async function HealthPage() {
  const healthStatus = await getHealthStatus();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden w-full space-y-6">
      <AppLogo />

      <Card className="bg-glass-bg border-border w-full max-w-md">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl">Health Status</CardTitle>
          <CardDescription>Check the health of the application</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center justify-center">
          {healthStatus.status ? (
            <Alert variant="success" className="flex flex-col items-center justify-center">
              <AlertTitle className="flex items-center gap-2">
                <HugeiconsIcon icon={CheckCircle} className="size-6" />
                <span>Success</span>
              </AlertTitle>
              <AlertDescription className="text-center">
                Great! The application is healthy and running smoothly. There
                are no issues with the application.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="error" className="flex flex-col items-center justify-center">
              <AlertTitle className="flex items-center gap-2">
                <HugeiconsIcon icon={XCircle} className="size-6" />
                <span>Error</span>
              </AlertTitle>
              <AlertDescription className="text-center">
                Oh no! The application is not healthy and is experiencing
                issues. Please check the logs for more information.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
