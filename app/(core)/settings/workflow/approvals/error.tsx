"use client";

import ErrorPage from "@/components/shared/error-page";

export default function ApprovalsError({ error }: Readonly<{ error: Error }>) {
  return <ErrorPage error={error} />;
}
