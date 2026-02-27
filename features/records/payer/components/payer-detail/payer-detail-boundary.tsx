import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/queries/query-client-config";
import { queryKeys } from "@/lib/queries/query-keys";
import { getPayerByIdServer } from "../../api/payers/server";

interface PayerDetailBoundaryProps {
  children: React.ReactNode;
  payerId: string;
}

export async function PayerDetailBoundary({
  children,
  payerId,
}: Readonly<PayerDetailBoundaryProps>) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.payers.detail(payerId),
    queryFn: () => getPayerByIdServer(payerId),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
