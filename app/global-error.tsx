"use client";

import ErrorPage from "@/components/shared/error-page";

export default function GlobalError({ error }: Readonly<{ error: Error }>) {
  return (
    <html lang="en">
      <body>
        <ErrorPage error={error} />
      </body>
    </html>
  );
}
