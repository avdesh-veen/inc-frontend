import { notFound } from "next/navigation";

import { Alert02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { AppLogo } from "@/components/shared/app-logo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ResetPswForm } from "@/features/auth/components/reset-psw-form";
import { validateResetToken } from "@/features/auth/api/reset/validate-token";

type Props = {
  searchParams: Promise<{ token: string }>;
};

export default async function ResetPasswordPage(props: Props) {
  const { token } = await props.searchParams;
  if (!token) return notFound();

  // Validate token server-side
  const validationResponse = await validateResetToken({ token });
  const isTokenValid = validationResponse.status && validationResponse.data?.valid;

  return (
    <div className="w-full space-y-6">
      <AppLogo />

      <Card className="bg-glass-bg border-border">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            {isTokenValid ? "Enter your new password" : "Unable to reset password"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isTokenValid ? (
            <ResetPswForm token={token} />
          ) : (
            <div className="space-y-4">
              <Alert variant="destructive">
                <HugeiconsIcon icon={Alert02Icon} className="h-4 w-4" />
                <AlertTitle>Token Expired</AlertTitle>
                <AlertDescription>
                  {validationResponse.message ||
                    "Your password reset link has expired or is invalid. Please request a new one."}
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
