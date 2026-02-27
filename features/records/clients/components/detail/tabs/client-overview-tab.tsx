/**
 * Client Overview Tab
 * 
 * Displays client overview information in a 3-column layout:
 * - Column 1: Primary Contact, Billing Contact
 * - Column 2: Address, Contract Details, Portal Settings
 * - Column 3: Recent Activity, Notes
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Client, ClientBillingContact } from '@/features/records/clients/types';
import { Skeleton } from '@/components/ui/skeleton';
import { HugeiconsIcon } from '@hugeicons/react';
import { Mail01Icon, Call02Icon } from '@hugeicons/core-free-icons';
import { formatDate } from '@/features/records/clients/utils/helpers';

interface ClientOverviewTabProps {
  client: Client;
}

export function ClientOverviewTab({ client }: Readonly<ClientOverviewTabProps>) {
  const [isLoading] = useState(false);
  const billingContact = client.contacts.find(contact => contact.contactType === ClientBillingContact.BILLING);
  const primaryContact = client.contacts.find(contact => contact.contactType === ClientBillingContact.PRIMARY);

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Column 1: Contacts */}
      <div className="space-y-6">
        {/* Primary Contact */}
        <Card className="bg-glass-bg border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-bold text-white/60 uppercase">
              Primary Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-white font-medium">{primaryContact?.contactName || 'Not specified'}</p>
            {primaryContact?.title && (
              <p className="text-white/50 text-sm">{primaryContact.title}</p>
            )}
            <div className="flex items-center gap-2 text-sm">
              <HugeiconsIcon 
                icon={Mail01Icon}
                className="w-4 h-4 text-white/50"
              />
              <span className="text-white/60">{primaryContact?.email || 'N/A'}</span>
            </div>
            {primaryContact?.phone && (
              <div className="flex items-center gap-2 text-sm">
                <HugeiconsIcon 
                  icon={Call02Icon}
                  className="w-4 h-4 text-white/50"
                />
                <span className="text-white/60">{primaryContact.phone}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Billing Contact */}
        <Card className="bg-glass-bg border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-bold text-white/60 uppercase">
              Billing Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {billingContact ? (
              <>
                <p className="text-white font-medium">{billingContact.contactName}</p>
                {billingContact.title && (
                  <p className="text-white/50 text-sm">{billingContact.title}</p>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <HugeiconsIcon 
                    icon={Mail01Icon}
                    className="w-4 h-4 text-white/50"
                  />
                  <span className="text-white/60">{billingContact.email}</span>
                </div>
                {billingContact.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <HugeiconsIcon 
                      icon={Call02Icon}
                      className="w-4 h-4 text-white/50"
                    />
                    <span className="text-white/60">{billingContact.phone}</span>
                  </div>
                )}
              </>
            ) : (
              <p className="text-white/50 text-sm">No billing contact specified</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Column 2: Address, Contract, Portal */}
      <div className="space-y-6">
        {/* Address */}
        <Card className="bg-glass-bg border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-bold text-white/60 uppercase">
              Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-white/60">
            <p>{client.address.streetAddress}</p>
            <p>
              {client.address?.city}, {client.address?.state} {client.address?.zip}
            </p>
          </CardContent>
        </Card>

        {/* Contract Details */}
        <Card className="bg-glass-bg border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-bold text-white/60 uppercase">
              Contract Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white/50">Start Date</span>
              <span className="text-white">{formatDate(client.contractStartDate ? new Date(client.contractStartDate) : null)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">End Date</span>
              <span className="text-white">{formatDate(client.contractEndDate ? new Date(client.contractEndDate) : null)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Tier</span>
              <span className="text-white">{client.accountTier}</span>
            </div>
          </CardContent>
        </Card>

        {/* Portal Settings */}
        <Card className="bg-glass-bg border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-bold text-white/60 uppercase">
              Portal Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/50">Portal Access</span>
              <Badge
                variant="outline"
                className={`px-2 py-1 rounded-lg text-xs font-medium ${
                  client.portalAccess
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-600'
                    : 'bg-rose-500/20 text-rose-300 border-rose-600'
                }`}
              >
                {client.portalAccess ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Column 3: Activity and Notes */}
      <div className="space-y-6">
        {/* Recent Activity */}
        <Card className="bg-glass-bg border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-bold text-white/60 uppercase">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <p className="text-white/50 text-sm">No recent activity</p>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="bg-glass-bg border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-bold text-white/60 uppercase">
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {client.internalNotes ? (
              <p className="text-white/60 text-sm">{client.internalNotes}</p>
            ) : (
              <p className="text-white/50 text-sm">No notes</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
