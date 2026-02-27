import { AppLogo } from "@/components/shared/app-logo";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ForgotPswForm } from "@/features/auth/components/forgot-psw-form";

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <AppLogo />

      <Card className="p-6">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email to reset your password
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ForgotPswForm />
        </CardContent>
      </Card>
    </div>
  );
}
