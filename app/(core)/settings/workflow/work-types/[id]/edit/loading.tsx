/**
 * Loading state for work type edit page
 */

export default function EditWorkTypeLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-8">
      <div className="p-6 rounded-[24px] border border-white/6 bg-white/3 backdrop-blur-2xl">
        <div className="mt-6 space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-glass-bg rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-glass-bg rounded w-2/3 mb-8"></div>
            <div className="space-y-4">
              <div className="h-10 bg-glass-bg rounded"></div>
              <div className="h-10 bg-glass-bg rounded"></div>
              <div className="h-10 bg-glass-bg rounded"></div>
              <div className="h-32 bg-glass-bg rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
