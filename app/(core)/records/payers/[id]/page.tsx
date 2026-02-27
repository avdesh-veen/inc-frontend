import { PayerDetailBoundary } from "@/features/records/payer/components/payer-detail/payer-detail-boundary";
import { PayerDetailContent } from "@/features/records/payer/components/payer-detail/payer-detail-content";

interface PayerDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function PayerDetailPage({
  params,
  searchParams,
}: Readonly<PayerDetailPageProps>) {
  const { id } = await params;
  const { tab = "overview" } = await searchParams;

  return (
    <PayerDetailBoundary payerId={id}>
      <PayerDetailContent payerId={id} activeTab={tab} />
    </PayerDetailBoundary>
  );
}
