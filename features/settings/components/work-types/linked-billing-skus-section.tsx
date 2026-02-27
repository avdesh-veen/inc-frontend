/**
 * LinkedBillingSKUsSection Component
 * 
 * Section for selecting billing SKUs that can generate this work type.
 */

'use client';

import * as React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { BILLING_SKUS } from '../../types/work-types';

interface LinkedBillingSKUsSectionProps {
  onToggle: (sku: string) => void;
}

export function LinkedBillingSKUsSection({ onToggle }: Readonly<LinkedBillingSKUsSectionProps>) {
  return (
    <div className="rounded-xl bg-glass-bg backdrop-blur-[var(--glass-blur)] border border-glass-border p-6">
      <h3 className="text-sm font-semibold text-rose-400 uppercase tracking-wider mb-4 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Linked Billing SKUs
      </h3>
      <p className="text-sm text-text-70 mb-4">
        Select which billing SKUs can generate this work type
      </p>
      <div className="grid grid-cols-4 gap-3">
        {BILLING_SKUS.map((sku) => (
          <label key={sku} className="flex items-center gap-2 cursor-pointer">
            <Checkbox onCheckedChange={() => onToggle(sku)} />
            <span className="text-sm text-text-70">{sku}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
