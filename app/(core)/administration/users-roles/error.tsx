"use client";

import ErrorPage from "@/components/shared/error-page";

export default function UsersRolesError({ error }: { error: Error }) {
  return <ErrorPage error={error} />;
}
