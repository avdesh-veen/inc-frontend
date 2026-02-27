"use client";

import ErrorPage from "@/components/shared/error-page";

export default function AuthError({ error }: { error: Error }) {
  return <ErrorPage error={error} />;
}
