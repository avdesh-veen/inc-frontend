/**
 * Provider Profile Tab
 * 
 * Profile tab showing comprehensive personal and professional information.
 */

'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Provider } from '@/features/records/providers/types';
import { format } from 'date-fns';
import { EyeIcon, ViewOffIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@/components/ui/button';

interface ProviderProfileTabProps {
  provider: Provider;
}

/**
 * Format address from provider location data
 */
function formatAddress(provider: Provider): string {
  const primaryLocation = provider.locations.find((loc) => loc.isPrimary) || provider.locations[0];
  if (!primaryLocation) return 'Not provided';
  
  const parts = [
    primaryLocation.addressLine1,
    primaryLocation.addressLine2,
    `${primaryLocation.city}, ${primaryLocation.state} ${primaryLocation.zip}`,
  ].filter(Boolean);
  
  return parts.join(', ');
}

/**
 * Get taxonomy code
 */
function getTaxonomyCode(specialty: string): string {
  // Mock taxonomy codes - replace with actual mapping when available
  const taxonomyMap: Record<string, string> = {
    'Internal Medicine': '207R00000X',
    'Cardiology': '207RC0000X',
    'Family Medicine': '207Q00000X',
    'Pediatrics': '208000000X',
  };
  return taxonomyMap[specialty] || '207R00000X';
}

/**
 * Get Medicare number
 */
function getMedicareNumber(_provider: Provider): string {
  // Mock - replace with actual field when available
  return 'MC1234567890';
}

/**
 * Get initial credentialing date
 */
function getInitialCredentialingDate(): string {
  // Mock - replace with actual field when available
  return '2018-03-15';
}

/**
 * Get recred cycle dates
 */
function getRecredCycleDates(): string {
  // Mock - replace with actual field when available
  return '2024-03-15 → 2027-03-15';
}

/**
 * Get client name from ID
 */
function getClientName(_clientIds: string[]): string {
  // Mock - replace with actual client lookup when available
  return 'Keystone Health Partners';
}

/**
 * Get submission method
 */
function getSubmittedVia(): string {
  // Mock - replace with actual field when available
  return 'Internal';
}

export function ProviderProfileTab({ provider }: Readonly<ProviderProfileTabProps>) {
  const [showDob, setShowDob] = useState(false);
  const [showSsn, setShowSsn] = useState(false);

  // Format DOB
  const dobFormatted = provider.dateOfBirth ? format(provider.dateOfBirth, 'yyyy-MM-dd') : '••/••/••••';
  const dobDisplay = showDob && provider.dateOfBirth ? dobFormatted : '••/••/••••';

  // Format SSN (last 4 digits)
  const ssnLast4 = provider.ssn ? provider.ssn.slice(-4) : '••••';
  const ssnDisplay = showSsn ? `•••• ${ssnLast4}` : '•••• ••••';

  // Format full name with credential
  const fullName = [
    provider.firstName,
    provider.middleName,
    provider.lastName,
    provider.suffix,
  ]
    .filter(Boolean)
    .join(' ') + `, ${provider.credential}`;

  // Secondary specialty
  const secondarySpecialty = provider.secondarySpecialties.length > 0 
    ? provider.secondarySpecialties[0] 
    : 'None';

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Personal Information */}
      <Card className="border-border bg-glass-bg">
        <CardContent className="p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            Personal Information
            <span className="px-2 py-0.5 rounded-lg text-xxs bg-emerald-500/20 text-emerald-300 font-normal">
              🔒 PII Protected
            </span>
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-white/50">Full Name</span>
              <span className="text-white">{fullName}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-white/50">Date of Birth</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-mono">{dobDisplay}</span>
                <Button
                  onClick={() => setShowDob(!showDob)}
                  className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white"
                  title="Toggle visibility"
                >
                  <HugeiconsIcon 
                    icon={showDob ? ViewOffIcon : EyeIcon} 
                    className="w-4 h-4" 
                  />
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-white/50">Last 4 SSN</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-mono">{ssnDisplay}</span>
                <button
                  onClick={() => setShowSsn(!showSsn)}
                  className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white"
                  title="Toggle visibility"
                >
                  <HugeiconsIcon 
                    icon={showSsn ? ViewOffIcon : EyeIcon} 
                    className="w-4 h-4" 
                  />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between">
              <span className="text-white/50">Gender</span>
              <span className="text-white">{provider.gender || 'Not specified'}</span>
            </div>
            
            <div className="flex justify-between items-start">
              <span className="text-white/50">Languages</span>
              <span className="text-white text-right">
                English <span className="text-white/40">(Fluent)</span>
                <br />
                Mandarin <span className="text-white/40">(Fluent)</span>
              </span>
            </div>
          </div>

          <h4 className="text-sm font-semibold text-white/70 mt-6 mb-3 pt-4 border-t border-white/10">
            Contact Information
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-white/50">Email</span>
              <span className="text-white">{provider.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Phone</span>
              <span className="text-white">{provider.phone || 'Not provided'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Address</span>
              <span className="text-white text-right max-w-xs">{formatAddress(provider)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card className="border-border bg-glass-bg">
        <CardContent className="p-6">
          <h3 className="text-base font-bold text-white mb-4">
            Professional Information
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-white/50">Tax ID</span>
              <span className="text-white font-mono">{provider.taxId || 'Not provided'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">NPI-1</span>
              <span className="text-white font-mono">{provider.npi}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">CAQH ID</span>
              <span className="text-white font-mono">{provider.caqhId || 'Not provided'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Medicare #</span>
              <span className="text-white font-mono">{getMedicareNumber(provider)}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-white/50">Medicaid #</span>
              <span className="text-white text-right">
                <span className="font-mono">PA-MD-445521</span>{' '}
                <span className="text-white/40">(PA)</span>
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Primary Specialty</span>
              <span className="text-white">{provider.primarySpecialty}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Secondary Specialty</span>
              <span className="text-white">{secondarySpecialty}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Taxonomy Code</span>
              <span className="text-white font-mono">{getTaxonomyCode(provider.primarySpecialty)}</span>
            </div>
          </div>

          <h4 className="text-sm font-semibold text-white/70 mt-6 mb-3 pt-4 border-t border-white/10">
            Credentialing Status
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-white/50">Initial Credentialing</span>
              <span className="text-white">{getInitialCredentialingDate()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Recred Cycle</span>
              <span className="text-white">{getRecredCycleDates()}</span>
            </div>
          </div>

          <h4 className="text-sm font-semibold text-white/70 mt-6 mb-3 pt-4 border-t border-white/10">
            Client Association
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-white/50">Client</span>
              <span className="text-emerald-400 cursor-pointer hover:underline">
                {getClientName(provider.clientIds)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Submitted Via</span>
              <span className="text-white">{getSubmittedVia()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
