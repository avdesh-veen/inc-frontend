"use client";

import { AppLogo } from "./app-logo";
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function ErrorPage({ error }: Readonly<{ error: Error }>) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-6 min-h-96 max-w-xl mx-auto">
      <AppLogo />
      <h1 className="text-2xl font-bold text-primary text-center">
        Oh no! Something went wrong. Please try again later.
      </h1>
      <p className="text-muted-foreground text-center text-sm">{error.message || "An error occurred"}</p>
    </div>
  );
}
