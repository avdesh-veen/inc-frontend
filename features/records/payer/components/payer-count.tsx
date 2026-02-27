"use client";

import { usePayersList } from "@/features/records/payer/hooks/use-payers";
import type { PayerRequest } from "@/features/records/payer/types";

interface PayerCountProps {
  request: PayerRequest;
}

export function PayerCount({ request }: Readonly<PayerCountProps>) {
  const { data, isLoading } = usePayersList(request);

  const total = data?.data?.meta?.totalItems;

  if (isLoading || total == null) {
    return <span className="text-sm text-white/50">Loading…</span>;
  }

  return (
    <span className="text-sm text-white/50">
      {total} {request.search ? "matching" : ""} payer{total !== 1 ? "s" : ""} in library
    </span>
  );
}
