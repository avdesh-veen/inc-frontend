/**
 * Provider Overview Tab
 * 
 * Overview tab showing provider summary and key metrics.
 */

'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Provider } from '@/features/records/providers/types';
import { LicenseExpirationBadge } from '../../shared/license-expiration-badge';
import { cn } from '@/lib/utils';

interface ProviderOverviewTabProps {
  provider: Provider;
}

export function ProviderOverviewTab({ provider }: Readonly<ProviderOverviewTabProps>) {
  // Calculate days until next license expiration
  const daysUntilExpiration = useMemo(() => {
    if (!provider.nextLicenseExpiration) return null;
    return Math.floor((provider.nextLicenseExpiration.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  }, [provider.nextLicenseExpiration]);

  // Calculate verified documents (hardcoded for now, should come from provider data)
  const verifiedDocuments = 7;
  const totalDocuments = 7;

  // Responsiveness score
  const responsivenessScore = provider.responsiveness ?? 92;

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-4">
        {/* License Status */}
        <Card className="border-border bg-glass-bg">
          <CardContent className="p-5">
            <h3 className="text-xs font-bold text-white/50 uppercase mb-2">
              License Status
            </h3>
            <div className={cn(
              'text-2xl font-bold',
              daysUntilExpiration && daysUntilExpiration < 30 
                ? 'text-red-400' 
                : daysUntilExpiration && daysUntilExpiration < 90 
                ? 'text-amber-400' 
                : 'text-emerald-400'
            )}>
              {daysUntilExpiration !== null ? `${daysUntilExpiration} days` : 'N/A'}
            </div>
            <p className="text-xs text-white/50">
              Until next expiration
            </p>
          </CardContent>
        </Card>

        {/* Enrollments */}
        <Card className="border-border bg-glass-bg">
          <CardContent className="p-5">
            <h3 className="text-xs font-bold text-white/50 uppercase mb-2">
              Enrollments
            </h3>
            <div className="text-2xl font-bold text-white">
              {provider.clientIds.length}
            </div>
            <p className="text-xs text-white/50">
              Active payers
            </p>
          </CardContent>
        </Card>

        {/* Verifications */}
        <Card className="border-border bg-glass-bg">
          <CardContent className="p-5">
            <h3 className="text-xs font-bold text-white/50 uppercase mb-2">
              Verifications
            </h3>
            <div className="text-2xl font-bold text-emerald-400">
              {verifiedDocuments}/{totalDocuments}
            </div>
            <p className="text-xs text-white/50">
              Documents verified
            </p>
          </CardContent>
        </Card>

        {/* Responsiveness */}
        <Card className="border-border bg-glass-bg">
          <CardContent className="p-5">
            <h3 className="text-xs font-bold text-white/50 uppercase mb-2">
              Responsiveness
            </h3>
            <div className="flex items-center gap-2">
              <div className={cn(
                'text-2xl font-bold',
                responsivenessScore >= 90 
                  ? 'text-emerald-400' 
                  : responsivenessScore >= 70 
                  ? 'text-amber-400' 
                  : 'text-red-400'
              )}>
                {responsivenessScore}
              </div>
              <div className="flex-1 h-2 rounded-full bg-white/10">
                <div 
                  className={cn(
                    'h-full rounded-full',
                    responsivenessScore >= 90 
                      ? 'bg-emerald-500' 
                      : responsivenessScore >= 70 
                      ? 'bg-amber-500' 
                      : 'bg-red-500'
                  )}
                  style={{ width: `${responsivenessScore}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-white/50">
              Stable trend
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Client & Source and Communication Intelligence - Two Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Client & Source */}
        <Card className="border-border bg-glass-bg">
          <CardContent className="p-5">
            <h3 className="text-sm font-bold text-white/60 uppercase mb-4">
              Client & Source
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/50">Client</span>
                <span className="text-emerald-400 cursor-pointer hover:underline">
                  {provider.clientIds.length > 0 ? 'Keystone Health Partners' : 'Not assigned'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Submitted Via</span>
                <span className="px-2 py-1 rounded-lg text-xs font-medium bg-slate-500/20 text-slate-300">
                  Internal
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Locations</span>
                <span className="text-white/60 text-sm text-right">
                  {provider.locations.length > 0 
                    ? provider.locations.map(loc => loc.locationName).join(', ')
                    : 'No locations'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Communication Intelligence */}
        <Card className="border-border bg-glass-bg">
          <CardContent className="p-5">
            <h3 className="text-sm font-bold text-white/60 uppercase mb-4">
              Communication Intelligence
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/50">Best Channel</span>
                <span className="text-emerald-400 font-medium">Email (98%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Avg Response Time</span>
                <span className="text-white">4 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Success Rate</span>
                <span className="text-white">0/0 attempts</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Trend</span>
                <span className="px-2 py-1 rounded-lg text-xs font-medium bg-slate-500/20 text-slate-300">
                  Stable
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Credential Status Summary */}
      <Card className="border-border bg-glass-bg">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-white">
            Credential Status Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {provider.stateLicenses.map((license) => (
              <div 
                key={license.id} 
                className="flex items-center justify-between rounded-lg border border-white/5 bg-white/2 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                    <svg 
                      className="h-5 w-5 text-emerald-400" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {license.state} Medical License
                    </p>
                    <p className="text-xs text-white/50">
                      #{license.licenseType}-{license.licenseNumber} • {license.state}
                    </p>
                  </div>
                </div>
                <LicenseExpirationBadge expirationDate={license.expirationDate} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
