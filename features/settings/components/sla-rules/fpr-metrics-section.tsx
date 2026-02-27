/**
 * First Pass Rate Metrics Section Component
 * 
 * Displays FPR configuration with:
 * - Target rates (3 metrics with number inputs)
 * - Tracking dimensions (6 checkboxes)
 */

'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { useUpdateFPRMetrics } from '@/features/settings/hooks/use-sla-rules';
import type { FPRMetricsSectionProps, LocalTrackingDimensions } from '@/features/settings/types/sla-rules';
import { FPRMetricsSkeleton } from './sla-rules-skeletons';
import * as React from 'react';


export function FPRMetricsSection({ metrics, isLoading = false }: Readonly<FPRMetricsSectionProps>) {
  const updateMetrics = useUpdateFPRMetrics();

  const [targetRates, setTargetRates] = React.useState({
    documentVerification: '',
    applicationBuild: '',
    payerSubmission: '',
  });

  React.useEffect(() => {
    if (metrics) {
      setTargetRates({
        documentVerification: String(metrics.documentVerificationFprTarget ?? 0),
        applicationBuild: String(metrics.applicationBuildFprTarget ?? 0),
        payerSubmission: String(metrics.payerSubmissionFprTarget ?? 0),
      });
    }
  }, [metrics]);

  const handleTargetChange = (
    field: keyof typeof targetRates,
    value: string
  ) => {
    if (value === '') {
      setTargetRates(prev => ({ ...prev, [field]: value }));
      return;
    }
    
    let sanitizedValue = value;
    
    if (value.startsWith('0') && value.length > 1 && value[1] !== '.') {
      sanitizedValue = value.replace(/^0+/, '');
    }
    
    if (/^\d*\.?\d{0,2}$/.test(sanitizedValue)) {
      const numValue = parseFloat(sanitizedValue);
      if (!isNaN(numValue) && numValue <= 100) {
        setTargetRates(prev => ({ ...prev, [field]: sanitizedValue }));
      }
    }
  };

  const handleTrackingDimensionChange = (
    dimension: keyof LocalTrackingDimensions,
    checked: boolean
  ) => {
    if (!metrics?.id) return;

    updateMetrics.mutate({
      id: metrics.id,
      data: {
        [`trackBy${dimension.charAt(0).toUpperCase() + dimension.slice(1)}`]: checked,
      },
    });
  };

  const handleSaveTargetRates = () => {
    if (!metrics?.id) return;
    
    updateMetrics.mutate({
      id: metrics.id,
      data: {
        documentVerificationFprTarget: parseFloat(targetRates.documentVerification) || 0,
        applicationBuildFprTarget: parseFloat(targetRates.applicationBuild) || 0,
        payerSubmissionFprTarget: parseFloat(targetRates.payerSubmission) || 0,
      },
    });
  };

  const overallFpr = Number(
    (
      ((metrics?.documentVerificationFprTarget ?? 0) +
        (metrics?.applicationBuildFprTarget ?? 0) +
        (metrics?.payerSubmissionFprTarget ?? 0)) / 3
    ).toFixed(2)
  );

  if (isLoading || !metrics) {
    return <FPRMetricsSkeleton />;
  }

  return (
    <div className="rounded-xl bg-glass-bg backdrop-blur-(--glass-blur) border border-glass-border p-6">
      {/* Header */}
      <h3 className="text-base font-bold text-foreground mb-4">First Pass Rate Metrics</h3>
      <p className="text-sm text-text-50 mb-4">
        Track application quality by measuring documents/enrollments completed without rejection or rework
      </p>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Target Rates */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Target Rates</h4>
          <div className="space-y-3">
            {/* Document Verification FPR */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-glass-bg border border-border-5">
              <span className="text-sm text-foreground">Document Verification FPR</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="decimal"
                  value={targetRates.documentVerification}
                  onChange={(e) => handleTargetChange('documentVerification', e.target.value)}
                  className="w-16 px-2 py-1 rounded-lg bg-glass-bg border border-border-10 text-emerald-400 text-center text-sm focus:border-violet-500 focus:outline-none"
                  placeholder="0"
                />
                <span className="text-text-50">%</span>
              </div>
            </div>

            {/* Application Build FPR */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-glass-bg border border-border-5">
              <span className="text-sm text-foreground">Application Build FPR</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="decimal"
                  value={targetRates.applicationBuild}
                  onChange={(e) => handleTargetChange('applicationBuild', e.target.value)}
                  className="w-16 px-2 py-1 rounded-lg bg-glass-bg border border-border-10 text-emerald-400 text-center text-sm focus:border-violet-500 focus:outline-none"
                  placeholder="0"
                />
                <span className="text-text-50">%</span>
              </div>
            </div>

            {/* Payer Submission FPR */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-glass-bg border border-border-5">
              <span className="text-sm text-foreground">Payer Submission FPR</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="decimal"
                  value={targetRates.payerSubmission}
                  onChange={(e) => handleTargetChange('payerSubmission', e.target.value)}
                  className="w-16 px-2 py-1 rounded-lg bg-glass-bg border border-border-10 text-emerald-400 text-center text-sm focus:border-violet-500 focus:outline-none"
                  placeholder="0"
                />
                <span className="text-text-50">%</span>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveTargetRates}
              disabled={updateMetrics.isPending}
              className="w-full px-4 py-2 rounded-lg bg-violet-500 text-white text-sm font-medium hover:bg-violet-600 disabled:opacity-50 transition-colors"
            >
              {updateMetrics.isPending ? 'Saving...' : 'Save Target Rates'}
            </button>
          </div>
        </div>

        {/* Right Column - Track By */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Track By</h4>
          <div className="space-y-2">
            {/* Analyst */}
            <label className="flex items-center gap-3 p-3 rounded-xl bg-glass-bg border border-border-5 cursor-pointer">
              <Checkbox
                checked={metrics.trackByAnalyst ?? false}
                onCheckedChange={(checked) =>
                  handleTrackingDimensionChange('analyst', checked as boolean)
                }
                disabled={updateMetrics.isPending}
              />
              <span className="text-sm text-foreground">Analyst (who created/processed)</span>
            </label>

            {/* Auditor */}
            <label className="flex items-center gap-3 p-3 rounded-xl bg-glass-bg border border-border-5 cursor-pointer">
              <Checkbox
                checked={metrics.trackByAuditor ?? false}
                onCheckedChange={(checked) =>
                  handleTrackingDimensionChange('auditor', checked as boolean)
                }
                disabled={updateMetrics.isPending}
              />
              <span className="text-sm text-foreground">Auditor (who verified)</span>
            </label>

            {/* Location */}
            <label className="flex items-center gap-3 p-3 rounded-xl bg-glass-bg border border-border-5 cursor-pointer">
              <Checkbox
                checked={metrics.trackByLocation ?? false}
                onCheckedChange={(checked) =>
                  handleTrackingDimensionChange('location', checked as boolean)
                }
                disabled={updateMetrics.isPending}
              />
              <span className="text-sm text-foreground">Location (facility)</span>
            </label>

            {/* Client */}
            <label className="flex items-center gap-3 p-3 rounded-xl bg-glass-bg border border-border-5 cursor-pointer">
              <Checkbox
                checked={metrics.trackByClient ?? false}
                onCheckedChange={(checked) =>
                  handleTrackingDimensionChange('client', checked as boolean)
                }
                disabled={updateMetrics.isPending}
              />
              <span className="text-sm text-foreground">Client</span>
            </label>

            {/* Work Type */}
            <label className="flex items-center gap-3 p-3 rounded-xl bg-glass-bg border border-border-5 cursor-pointer">
              <Checkbox
                checked={metrics.trackByWorkType ?? false}
                onCheckedChange={(checked) =>
                  handleTrackingDimensionChange('workType', checked as boolean)
                }
                disabled={updateMetrics.isPending}
              />
              <span className="text-sm text-foreground">Work Type</span>
            </label>

            {/* Payer */}
            <label className="flex items-center gap-3 p-3 rounded-xl bg-glass-bg border border-border-5 cursor-pointer">
              <Checkbox
                checked={metrics.trackByPayer ?? false}
                onCheckedChange={(checked) =>
                  handleTrackingDimensionChange('payer', checked as boolean)
                }
                disabled={updateMetrics.isPending}
              />
              <span className="text-sm text-foreground">Payer</span>
            </label>
          </div>
        </div>
      </div>
      <div className="mt-6 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-cyan-300">Current Performance (Last 30 Days)</h4>
          <button className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
            View Full Report
            {/* <HugeiconsIcon icon={ArrowRight01} size={12} /> */}
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-300">
              {metrics.documentVerificationFprTarget}%
            </div>
            <div className="text-xs text-text-50 mt-1">Doc Verification</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-300">
              {metrics.applicationBuildFprTarget}%
            </div>
            <div className="text-xs text-text-50 mt-1">App Build</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-300">
              {metrics.payerSubmissionFprTarget}%
            </div>
            <div className="text-xs text-text-50 mt-1">Payer Submission</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-300">
              {overallFpr}%
            </div>
            <div className="text-xs text-text-50 mt-1">Overall FPR</div>
          </div>
        </div>
      </div>
    </div>
  );
}
