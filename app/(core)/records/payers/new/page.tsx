import { AddPayerContent } from "@/features/records/payer/components/add-payer-content";

export const dynamic = "force-dynamic";

export default function NewPayerPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <AddPayerContent />
    </div>
  );
}
