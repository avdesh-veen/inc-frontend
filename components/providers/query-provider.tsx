/**
 * Client-side Providers
 *
 * Wraps the application with necessary providers for client-side features.
 * Must be a Client Component to use React context.
 */

"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/queries/query-client-config";
import dynamic from "next/dynamic";
import { Suspense, useState } from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

const ReactQueryDevtoolsProduction = dynamic(() =>
  import("@tanstack/react-query-devtools/build/modern/production.js").then(
    (d) => ({
      default: d.ReactQueryDevtools,
    }),
  ),
);

export function QueryProvider({ children }: ProvidersProps) {
  // useState with an initializer runs getQueryClient() once on mount.
  // The singleton returned by getQueryClient() is stored in state and
  // never recreated on re-renders, making it safe to read directly in JSX.
  const [client] = useState(() => getQueryClient());

  const showDevtools = process.env.NODE_ENV === "development";


  return (
    <QueryClientProvider client={client}>
      {showDevtools && (
        <Suspense fallback={null}>
          <ReactQueryDevtoolsProduction />
        </Suspense>
      )}
      {children}
    </QueryClientProvider>
  );
}
