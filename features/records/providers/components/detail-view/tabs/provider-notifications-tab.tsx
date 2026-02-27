/**
 * Provider Notifications Tab
 * 
 * Notifications tab showing sent notifications and templates.
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Provider } from '@/features/records/providers/types';
import { HugeiconsIcon } from '@hugeicons/react';
import { Mail01Icon } from '@hugeicons/core-free-icons';

interface ProviderNotificationsTabProps {
  provider: Provider;
}

export function ProviderNotificationsTab({ provider: _provider }: ProviderNotificationsTabProps) {
  return (
    <div className="space-y-6">
      {/* Notification Metrics */}
      <div className="grid grid-cols-4 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-white/5 bg-white/[0.02]">
          <CardContent className="p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-white/50">
              Total Sent
            </p>
            <p className="mt-1 text-2xl font-bold text-white">1</p>
          </CardContent>
        </Card>
        
        <Card className="border-white/5 bg-white/[0.02]">
          <CardContent className="p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-white/50">
              Delivered
            </p>
            <p className="mt-1 text-2xl font-bold text-emerald-400">1</p>
          </CardContent>
        </Card>
        
        <Card className="border-white/5 bg-white/[0.02]">
          <CardContent className="p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-white/50">
              Opened
            </p>
            <p className="mt-1 text-2xl font-bold text-cyan-400">1</p>
          </CardContent>
        </Card>
        
        <Card className="border-white/5 bg-white/[0.02]">
          <CardContent className="p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-white/50">
              Open Rate
            </p>
            <p className="mt-1 text-2xl font-bold text-violet-400">100%</p>
          </CardContent>
        </Card>
      </div>

      {/* Notification History */}
      <Card className="border-white/5 bg-white/[0.02]">
        <CardHeader className="p-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-white">
              Notification History
            </CardTitle>
            <Button
              size="sm"
              className="flex items-center gap-2 rounded-xl bg-violet-500/20 px-4 py-2 text-sm font-medium text-violet-300 hover:bg-violet-500/30"
            >
              <HugeiconsIcon icon={Mail01Icon} className="size-4" strokeWidth={2} />
              Send Notification
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table variant="secondary">
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Date Sent</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Opened</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <span className="flex items-center gap-2">
                    <span>📨</span>
                    <span className="text-white">Initial Receipt</span>
                  </span>
                </TableCell>
                <TableCell className="text-white/60">
                  28/11/2024
                  <br />
                  <span className="text-xs text-white/40">14:30</span>
                </TableCell>
                <TableCell>
                  <Badge className="rounded-lg bg-blue-500/20 px-2 py-1 text-xs text-blue-300">
                    Email
                  </Badge>
                </TableCell>
                <TableCell className="text-white/60">
                  Dr. Sarah Johnson
                  <br />
                  <span className="text-xs text-white/40">
                    sarah.johnson@keystonemedical.org
                  </span>
                </TableCell>
                <TableCell className="text-xs text-white/60">
                  Application Receipt Acknowledgment
                </TableCell>
                <TableCell>
                  <Badge className="rounded-lg bg-emerald-500/20 px-2 py-1 text-xs text-emerald-300">
                    Delivered
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-white/60">
                  28/11/2024 15:45
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded bg-white/10 px-2 py-1 text-xs text-white/60 hover:bg-white/20"
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-2 rounded bg-violet-500/20 px-2 py-1 text-xs text-violet-300 hover:bg-violet-500/30"
                  >
                    Resend
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Send Templates */}
      <Card className="border-white/5 bg-white/[0.02]">
        <CardHeader>
          <CardTitle className="text-base">Quick Send Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Application Receipt', description: 'Confirm application received' },
              { title: 'Additional Info Request', description: 'Request missing documents' },
              { title: 'Approval Notice', description: 'Notify provider of approval' },
              { title: 'Recredentialing Reminder', description: 'Remind of upcoming recred' },
            ].map((template, index) => (
              <button
                key={index}
                className="rounded-lg border border-white/5 bg-white/[0.02] p-4 text-left transition-colors hover:bg-white/[0.03]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 mb-3">
                  <HugeiconsIcon icon={Mail01Icon} className="size-5" strokeWidth={2} />
                </div>
                <h4 className="text-sm font-medium text-foreground">{template.title}</h4>
                <p className="mt-1 text-xs text-muted-foreground">{template.description}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
