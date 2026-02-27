/**
 * Provider Credentials Tab
 * 
 * Credentials tab with licenses and certifications.
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Provider } from '@/features/records/providers/types';
import { Badge } from '@/components/ui/badge';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  PlusSignIcon, 
  Tick02Icon,
  CheckmarkBadge02Icon,
} from '@hugeicons/core-free-icons';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';

interface ProviderCredentialsTabProps {
  provider: Provider;
}

type SubTabType = 'licenses' | 'insurance';

interface LicenseCardProps {
  license: {
    id: string;
    state: string;
    licenseType: string;
    licenseNumber: string;
    status: string;
    issueDate?: Date;
    expirationDate?: Date;
    verifiedBy?: string;
    verifiedDate?: Date;
  };
}

interface InsuranceCardProps {
  insurance: {
    id: string;
    type: string;
    provider: string;
    policyNumber: string;
    coverageAmount: string;
    effectiveDate?: Date;
    expirationDate?: Date;
    verifiedBy?: string;
    verifiedDate?: Date;
  };
}

function getDaysUntilExpiration(expirationDate: Date): number {
  return differenceInDays(expirationDate, new Date());
}

function LicenseCard({ license }: Readonly<LicenseCardProps>) {
  const daysRemaining = license.expirationDate ? getDaysUntilExpiration(license.expirationDate) : null;
  
  return (
    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-semibold text-white">{license.state} {license.licenseType} License</h4>
          <p className="text-sm text-white/50 mt-0.5">{license.state}</p>
        </div>
        {daysRemaining !== null && (
          <Badge 
            variant="outline"
            className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border-emerald-500/20"
          >
            {daysRemaining} days
          </Badge>
        )}
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-white/50">License #</span>
          <span className="text-white font-mono">{license.licenseNumber}</span>
        </div>
        {license.issueDate && (
          <div className="flex justify-between">
            <span className="text-white/50">Issued</span>
            <span className="text-white">{format(license.issueDate, 'yyyy-MM-dd')}</span>
          </div>
        )}
        {license.expirationDate && (
          <div className="flex justify-between">
            <span className="text-white/50">Expires</span>
            <span className="text-emerald-400 font-medium">
              {format(license.expirationDate, 'yyyy-MM-dd')}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-white/50">Status</span>
          <span className="text-white">{license.status}</span>
        </div>
        
        {license.verifiedBy && license.verifiedDate && (
          <div className="pt-2 mt-2 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <HugeiconsIcon icon={Tick02Icon} className="w-3 h-3" strokeWidth={2} />
              Verified by {license.verifiedBy} on {format(license.verifiedDate, 'yyyy-MM-dd')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InsuranceCard({ insurance }: Readonly<InsuranceCardProps>) {
  const daysRemaining = insurance.expirationDate ? getDaysUntilExpiration(insurance.expirationDate) : null;
  
  return (
    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-semibold text-white">{insurance.type}</h4>
          <p className="text-sm text-white/50 mt-0.5">{insurance.provider}</p>
        </div>
        {daysRemaining !== null && (
          <Badge 
            variant="outline"
            className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border-blue-500/20"
          >
            {daysRemaining} days
          </Badge>
        )}
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-white/50">Policy #</span>
          <span className="text-white font-mono">{insurance.policyNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/50">Coverage</span>
          <span className="text-white font-medium">{insurance.coverageAmount}</span>
        </div>
        {insurance.effectiveDate && (
          <div className="flex justify-between">
            <span className="text-white/50">Effective</span>
            <span className="text-white">{format(insurance.effectiveDate, 'yyyy-MM-dd')}</span>
          </div>
        )}
        {insurance.expirationDate && (
          <div className="flex justify-between">
            <span className="text-white/50">Expires</span>
            <span className="text-blue-400 font-medium">
              {format(insurance.expirationDate, 'yyyy-MM-dd')}
            </span>
          </div>
        )}
        
        {insurance.verifiedBy && insurance.verifiedDate && (
          <div className="pt-2 mt-2 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <HugeiconsIcon icon={Tick02Icon} className="w-3 h-3" strokeWidth={2} />
              Verified by {insurance.verifiedBy} on {format(insurance.verifiedDate, 'yyyy-MM-dd')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function ProviderCredentialsTab({ provider: _provider }: Readonly<ProviderCredentialsTabProps>) {
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>('licenses');

  const mockLicenses = [
    {
      id: '1',
      state: 'PA',
      licenseType: 'Medical',
      licenseNumber: 'MD-445521',
      status: 'Active',
      issueDate: new Date('2008-06-15'),
      expirationDate: new Date('2026-06-30'),
      verifiedBy: 'David Kim',
      verifiedDate: new Date('2024-12-01'),
    },
    {
      id: '2',
      state: 'NJ',
      licenseType: 'Medical',
      licenseNumber: '25MD12345600',
      status: 'Active',
      issueDate: new Date('2015-09-01'),
      expirationDate: new Date('2025-08-31'),
      verifiedBy: 'Amanda Thompson',
      verifiedDate: new Date('2024-12-10'),
    },
  ];

  const mockInsurance = [
    {
      id: '1',
      type: 'Professional Liability Insurance',
      provider: 'Healthcare Providers Service Organization',
      policyNumber: 'HPSO-2024-987654',
      coverageAmount: '$1,000,000 / $3,000,000',
      effectiveDate: new Date('2024-01-01'),
      expirationDate: new Date('2025-12-31'),
      verifiedBy: 'Sarah Johnson',
      verifiedDate: new Date('2024-11-15'),
    },
    {
      id: '2',
      type: 'General Liability Insurance',
      provider: 'The Doctors Company',
      policyNumber: 'TDC-2024-123456',
      coverageAmount: '$2,000,000 / $4,000,000',
      effectiveDate: new Date('2024-01-01'),
      expirationDate: new Date('2025-12-31'),
      verifiedBy: 'Michael Chen',
      verifiedDate: new Date('2024-11-20'),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Button
          onClick={() => setActiveSubTab('licenses')}
          variant="ghost"
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
            activeSubTab === 'licenses'
              ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
              : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10"
          )}
        >
          <HugeiconsIcon icon={CheckmarkBadge02Icon} className="w-4 h-4" strokeWidth={1.5} />
          Licenses & Certifications
        </Button>
        
        <Button
          onClick={() => setActiveSubTab('insurance')}
          variant="ghost"
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
            activeSubTab === 'insurance'
              ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
              : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10"
          )}
        >
          <HugeiconsIcon icon={CheckmarkBadge02Icon} className="w-4 h-4" strokeWidth={1.5} />
          Malpractice Insurance
        </Button>
      </div>

      <Card className="border-white/5 bg-white/[0.02]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold text-white">
            {activeSubTab === 'licenses' ? 'Licenses & Certifications' : 'Malpractice Insurance'}
          </CardTitle>
          <Button 
            size="sm" 
            className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 text-sm font-medium hover:bg-emerald-500/30"
          >
            <HugeiconsIcon icon={PlusSignIcon} className="size-3.5 mr-1.5" strokeWidth={2} />
            {activeSubTab === 'licenses' ? 'Add License' : 'Add Insurance'}
          </Button>
        </CardHeader>
        
        <CardContent>
          {activeSubTab === 'licenses' ? (
            <div className="grid grid-cols-2 gap-4">
              {mockLicenses.map((license) => (
                <LicenseCard key={license.id} license={license} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {mockInsurance.map((insurance) => (
                <InsuranceCard key={insurance.id} insurance={insurance} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
