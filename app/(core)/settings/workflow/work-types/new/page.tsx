import { WorkTypeFormWrapper } from "@/features/settings/components/work-types/work-type-form-wrapper";

export default function NewWorkTypePage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-8">
      <div className="p-6 rounded-[24px] border border-white/6 bg-white/3 backdrop-blur-2xl">
        <div className="mt-6">
          <WorkTypeFormWrapper />
        </div>
      </div>
    </div>
  );
}
