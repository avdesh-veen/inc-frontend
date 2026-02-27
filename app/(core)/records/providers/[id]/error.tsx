/**
 * Provider Detail Error State
 * 
 * Error boundary for the provider detail page.
 * Route: /records/providers/[id]
 */


"use client";

import ErrorPage from "@/components/shared/error-page";

export default function ProviderDetailError({ error }: Readonly<{ error: Error }>) {
  return <ErrorPage error={error} />;
}
