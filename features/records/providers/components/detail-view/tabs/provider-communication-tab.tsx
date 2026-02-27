/**
 * Provider Communication Tab
 * 
 * Communication tab showing provider communication metrics and history.
 */

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Provider } from '@/features/records/providers/types';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  MailOpen01Icon, 
  SmartPhone01Icon, 
  Call02Icon,
  CheckmarkCircle02Icon 
} from '@hugeicons/core-free-icons';

interface ProviderCommunicationTabProps {
  provider: Provider;
}

export function ProviderCommunicationTab({ provider }: Readonly<ProviderCommunicationTabProps>) {
  const responsivenessScore = provider.responsiveness ?? 92;

  return (
    <div className="space-y-6">
      {/* Communication Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {/* Responsiveness Score */}
        <Card className="border-border bg-glass-bg">
          <CardContent className="p-5">
            <h3 className="text-xs font-bold text-white/50 uppercase mb-2">
              Responsiveness Score
            </h3>
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold text-emerald-400">
                {responsivenessScore}
              </div>
              <div className="flex-1 h-3 rounded-full bg-white/10">
                <div 
                  className="h-full rounded-full bg-emerald-500" 
                  style={{ width: `${responsivenessScore}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avg Response Time */}
        <Card className="border-border bg-glass-bg">
          <CardContent className="p-5">
            <h3 className="text-xs font-bold text-white/50 uppercase mb-2">
              Avg Response Time
            </h3>
            <div className="text-3xl font-bold text-white">
              4<span className="text-lg text-white/50 ml-1">hrs</span>
            </div>
          </CardContent>
        </Card>

        {/* Best Channel */}
        <Card className="border-border bg-glass-bg">
          <CardContent className="p-5">
            <h3 className="text-xs font-bold text-white/50 uppercase mb-2">
              Best Channel
            </h3>
            <div className="text-2xl font-bold text-emerald-400">Email</div>
            <p className="text-xs text-white/50">98% response rate</p>
          </CardContent>
        </Card>

        {/* Contact Success */}
        <Card className="border-border bg-glass-bg">
          <CardContent className="p-5">
            <h3 className="text-xs font-bold text-white/50 uppercase mb-2">
              Contact Success
            </h3>
            <div className="text-3xl font-bold text-white">
              0<span className="text-lg text-white/50">/0</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Methods and Additional Info - Two Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Contact Methods */}
        <Card className="border-border bg-glass-bg">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white/60 uppercase">Contact Methods</h3>
              <Button 
                size="sm" 
                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-medium hover:bg-emerald-500/30"
                variant="ghost"
              >
                + Add
              </Button>
            </div>
            
            <div className="space-y-3">
              {/* Email - Primary */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/2 border border-emerald-500/30">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <HugeiconsIcon icon={MailOpen01Icon} className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-white">Email</p>
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-3 h-3 text-emerald-400" />
                    <span className="px-1.5 py-0.5 rounded text-xxs font-medium bg-emerald-500/20 text-emerald-300">
                      PRIMARY
                    </span>
                  </div>
                  <p className="text-sm text-white/50 truncate">{provider.email}</p>
                </div>
                <div className="text-right text-xs shrink-0">
                  <span className="text-white/50">Rank #1</span>
                </div>
              </div>

              {/* Cell Phone */}
              {provider.phone && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/2">
                  <div className="w-10 h-10 rounded-xl bg-slate-500/20 flex items-center justify-center shrink-0">
                    <HugeiconsIcon icon={SmartPhone01Icon} className="w-5 h-5 text-white/40" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white">Cell</p>
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-3 h-3 text-emerald-400" />
                    </div>
                    <p className="text-sm text-white/50">{provider.phone}</p>
                  </div>
                  <div className="text-right text-xs shrink-0">
                    <span className="text-white/50">Rank #2</span>
                  </div>
                </div>
              )}

              {/* Office Phone */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/2">
                <div className="w-10 h-10 rounded-xl bg-slate-500/20 flex items-center justify-center shrink-0">
                  <HugeiconsIcon icon={Call02Icon} className="w-5 h-5 text-white/40" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-white">Office</p>
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-3 h-3 text-emerald-400" />
                  </div>
                  <p className="text-sm text-white/50">(610) 988-8100</p>
                </div>
                <div className="text-right text-xs shrink-0">
                  <span className="text-white/50">Rank #3</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Best Contact Times & Alternate Contacts */}
        <div className="space-y-6">
          {/* Best Contact Times */}
          <Card className="border-border bg-glass-bg">
            <CardContent className="p-5">
              <h3 className="text-sm font-bold text-white/60 uppercase mb-4">
                Best Contact Times
              </h3>
              <div className="space-y-2">
                <p className="text-xs text-white/50">Timezone: America/New_York</p>
                <p className="text-xs text-white/50">
                  Prefers email. Best reached early morning before clinic.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Alternate Contacts */}
          <Card className="border-border bg-glass-bg">
            <CardContent className="p-5">
              <h3 className="text-sm font-bold text-white/60 uppercase mb-4">
                Alternate Contacts
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white/2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-white">Jennifer Adams</p>
                    <span className="px-2 py-0.5 rounded text-xxs font-medium bg-violet-500/20 text-violet-300">
                      Credentialing Director
                    </span>
                  </div>
                  <p className="text-xs text-white/50">
                    (610) 988-8050 • jadams@keystonehealth.com
                  </p>
                  <p className="text-xs text-emerald-400/60 mt-1">Full authority</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Communication Log */}
      <Card className="border-border bg-glass-bg">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white/60 uppercase">Recent Communication Log</h3>
            <Button 
              size="sm" 
              className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 text-xs font-medium hover:bg-blue-500/30"
              variant="ghost"
            >
              + Log Contact
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-white/5 hover:bg-transparent">
                  <TableHead className="px-3 py-2 text-left text-xxs font-bold text-white/50 uppercase">
                    Date/Time
                  </TableHead>
                  <TableHead className="px-3 py-2 text-left text-xxs font-bold text-white/50 uppercase">
                    Channel
                  </TableHead>
                  <TableHead className="px-3 py-2 text-left text-xxs font-bold text-white/50 uppercase">
                    Purpose
                  </TableHead>
                  <TableHead className="px-3 py-2 text-left text-xxs font-bold text-white/50 uppercase">
                    Result
                  </TableHead>
                  <TableHead className="px-3 py-2 text-left text-xxs font-bold text-white/50 uppercase">
                    Response
                  </TableHead>
                  <TableHead className="px-3 py-2 text-left text-xxs font-bold text-white/50 uppercase">
                    Analyst
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b border-white/5 hover:bg-white/2">
                  <TableCell className="px-3 py-2 text-white/60 text-xs">05/12/2024</TableCell>
                  <TableCell className="px-3 py-2">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-blue-300">
                      Text
                    </span>
                  </TableCell>
                  <TableCell className="px-3 py-2 text-white/60 text-xs">License Renewal Reminder</TableCell>
                  <TableCell className="px-3 py-2">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-300">
                      Delivered
                    </span>
                  </TableCell>
                  <TableCell className="px-3 py-2 text-white/50 text-xs">2h</TableCell>
                  <TableCell className="px-3 py-2 text-white/50 text-xs">Kajal Arora</TableCell>
                </TableRow>
                <TableRow className="border-b border-white/5 hover:bg-white/2">
                  <TableCell className="px-3 py-2 text-white/60 text-xs">01/28/2024</TableCell>
                  <TableCell className="px-3 py-2">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-violet-500/20 text-violet-300">
                      Email
                    </span>
                  </TableCell>
                  <TableCell className="px-3 py-2 text-white/60 text-xs">Document request</TableCell>
                  <TableCell className="px-3 py-2">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-300">
                      Responded
                    </span>
                  </TableCell>
                  <TableCell className="px-3 py-2 text-white/50 text-xs">4h</TableCell>
                  <TableCell className="px-3 py-2 text-white/50 text-xs">J. Smith</TableCell>
                </TableRow>
                <TableRow className="border-b border-white/5 hover:bg-white/2">
                  <TableCell className="px-3 py-2 text-white/60 text-xs">01/26/2024</TableCell>
                  <TableCell className="px-3 py-2">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-500/20 text-amber-300">
                      Phone
                    </span>
                  </TableCell>
                  <TableCell className="px-3 py-2 text-white/60 text-xs">License verification</TableCell>
                  <TableCell className="px-3 py-2">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-300">
                      Completed
                    </span>
                  </TableCell>
                  <TableCell className="px-3 py-2 text-white/50 text-xs">1h</TableCell>
                  <TableCell className="px-3 py-2 text-white/50 text-xs">M. Chen</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Escalation Rules */}
      <Card className="border-border bg-glass-bg">
        <CardContent className="p-5">
          <h3 className="text-sm font-bold text-white/60 uppercase mb-4">Escalation Rules</h3>
          <div className="flex items-center gap-4">
            {/* 7 Days - Alternate Contact */}
            <div className="flex-1 p-3 rounded-xl bg-white/2 text-center">
              <p className="text-2xl font-bold text-amber-400">7</p>
              <p className="text-xs text-white/50">days → Alternate Contact</p>
            </div>
            
            {/* Arrow */}
            <svg className="w-6 h-6 text-white/20 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            
            {/* 14 Days - Client Contact */}
            <div className="flex-1 p-3 rounded-xl bg-white/2 text-center">
              <p className="text-2xl font-bold text-orange-400">14</p>
              <p className="text-xs text-white/50">days → Client Contact</p>
            </div>
            
            {/* Arrow */}
            <svg className="w-6 h-6 text-white/20 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            
            {/* 21 Days - Manager Escalation */}
            <div className="flex-1 p-3 rounded-xl bg-white/2 text-center">
              <p className="text-2xl font-bold text-rose-400">21</p>
              <p className="text-xs text-white/50">days → Manager Escalation</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
