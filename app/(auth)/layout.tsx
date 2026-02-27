import * as React from "react";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/api/login/server";
import { appRoutes } from "@/lib/constants/navigation";
import { CardLoadingContent } from "@/components/shared/loading-content";

type LayoutProps = {
  children: React.ReactNode;
};

export default async function AuthLayout(props: LayoutProps) {
  const { children } = props;

  const { data: userData } = await getCurrentUser();
  if (userData?.id) redirect(appRoutes.myWork.dashboard);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" /> */}
      {/* <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" /> */}
      {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-muted/20 rounded-full blur-3xl" /> */}
      {/* <div className="absolute inset-0 opacity-[0.02]" /> */}
      <div className="w-full max-w-md">
        <Suspense fallback={<CardLoadingContent />}>{children}</Suspense>
      </div>
    </div>
  );
}
