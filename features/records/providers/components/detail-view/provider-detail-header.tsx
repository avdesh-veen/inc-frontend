/**
 * Provider Detail Header
 * 
 * Header component showing provider info, avatar, and action buttons.
 */

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Provider } from '@/features/records/providers/types';
import { ProviderAvatar } from '../shared/provider-avatar';
import { ProviderStatusBadge } from '../shared/provider-status-badge';

interface ProviderDetailHeaderProps {
  provider: Provider;
}

function getClientName(_clientIds: string[]): string {
  return 'Keystone Health Partners';
}

function getSubmittedVia(): string {
  return 'Internal';
}

export function ProviderDetailHeader({ provider }: Readonly<ProviderDetailHeaderProps>) {
  const secondarySpecialtiesText = provider.secondarySpecialties.length > 0 
    ? provider.secondarySpecialties.join(' • ')
    : null;

  return (
    <div className="rounded-xl border bg-glass-bg border-border p-6">
      <div className="flex items-center gap-6">
        {/* Avatar */}
        <ProviderAvatar name={provider.displayName} size="xl" />
        
        {/* Main Info */}
        <div className="flex-1">
          {/* Provider Name */}
          <h2 className="text-2xl font-bold text-white">
            {provider.displayName}
          </h2>
          
          {/* Specialties */}
          <p className="text-white/50 mt-0.5">
            {provider.primarySpecialty}
            {secondarySpecialtiesText && (
              <>
                {' '}
                <span className="text-white/30">|</span>
                {' '}
                <span className="text-violet-400">{secondarySpecialtiesText}</span>
              </>
            )}
          </p>
          
          {/* Identifiers & Client */}
          <div className="flex items-center gap-4 mt-2 text-sm text-white/50">
            {provider.taxId && (
              <>
                <span>
                  Tax ID: <span className="font-mono text-white/70">{provider.taxId}</span>
                </span>
                <span>•</span>
              </>
            )}
            <span>
              NPI: <span className="font-mono text-white/70">{provider.npi}</span>
            </span>
            {provider.caqhId && (
              <>
                <span>•</span>
                <span>
                  CAQH ID: <span className="font-mono text-white/70">{provider.caqhId}</span>
                </span>
              </>
            )}
            {provider.clientIds.length > 0 && (
              <>
                <span>•</span>
                <span className="text-emerald-400 cursor-pointer hover:underline">
                  {getClientName(provider.clientIds)}
                </span>  
              </>
            )}
          </div>
        </div>

        {/* Right Side: Status & Actions */}
        <div className="flex flex-col items-end gap-2">
          {/* Badges */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-500/20 text-slate-300">
              {getSubmittedVia()}
            </span>
            <ProviderStatusBadge status={provider.status} size="md" />
          </div>
          
          {/* Edit Button */}
          <Button asChild variant="outline" size="default">
            <Link href={`/records/providers/${provider.id}/edit`}>
              Edit
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
