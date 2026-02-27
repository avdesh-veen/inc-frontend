"use client";

export function WorkTypeFooter() {
  return (
    <div className="rounded-xl bg-glass-bg backdrop-blur-[var(--glass-blur)] border border-glass-border p-6">
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-0.5">
        <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-foreground mb-1">Time Tracking & Productivity</h4>
        <p className="text-xs text-text-50 leading-relaxed">
          Each work item captures{' '}
          <code className="px-1.5 py-0.5 rounded bg-glass-bg border border-border-10 text-violet-300 font-mono text-xs">
            startTimestamp
          </code>{' '}
          and{' '}
          <code className="px-1.5 py-0.5 rounded bg-glass-bg border border-border-10 text-violet-300 font-mono text-xs">
            endTimestamp
          </code>{' '}
          for duration calculation. Compare actual vs. expected duration to measure analyst productivity.
        </p>
        <div className="flex items-center gap-4 mt-3 text-xs text-text-50">
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Export-ready data</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Auto-calculated durations</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Productivity benchmarks</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}