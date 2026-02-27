/**
 * Provider Documents Tab
 * 
 * Documents tab with upload interface and document management.
 */

'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Provider } from '@/features/records/providers/types';
import { toast } from 'sonner';
import { HugeiconsIcon } from '@hugeicons/react';
import { Note02Icon, Tick02Icon } from '@hugeicons/core-free-icons';

interface ProviderDocumentsTabProps {
  provider: Provider;
}

interface Document {
  id: string;
  name: string;
  type: string;
  verified: boolean;
}

export function ProviderDocumentsTab({ provider: _provider }: Readonly<ProviderDocumentsTabProps>) {
  const [documents] = useState<Document[]>([
    {
      id: '1',
      name: 'PA Medical License',
      type: 'State License',
      verified: true,
    },
    {
      id: '2',
      name: 'NJ Medical License',
      type: 'State License',
      verified: true,
    },
    {
      id: '3',
      name: 'DEA Registration',
      type: 'DEA Certificate',
      verified: true,
    },
    {
      id: '4',
      name: 'ABIM Certificate',
      type: 'Board Certification',
      verified: true,
    },
    {
      id: '5',
      name: 'Malpractice Insurance',
      type: 'Malpractice COI',
      verified: true,
    },
    {
      id: '6',
      name: 'UPenn Medical Diploma',
      type: 'Medical Diploma',
      verified: true,
    },
    {
      id: '7',
      name: 'Current CV',
      type: 'CV',
      verified: true,
    },
  ]);

  const handleUpload = () => {
    toast.info('Upload document dialog would open here');
  };

  return (
    <Card className="border-border bg-glass-bg">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-white">Documents</h3>
          <Button
            onClick={handleUpload}
            className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 text-sm font-medium hover:bg-emerald-500/30"
            variant="ghost"
          >
            + Upload Document
          </Button>
        </div>

        {/* Document Grid */}
        <div className="grid grid-cols-3 gap-4">
          {documents.map((document) => (
            <div
              key={document.id}
              className="p-4 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/4 cursor-pointer transition-colors"
            >
              <div className="flex items-start gap-3">
                {/* Document Icon */}
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                  <HugeiconsIcon icon={Note02Icon} className="w-5 h-5 text-blue-400" />
                </div>

                {/* Document Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{document.name}</p>
                  <p className="text-xs text-white/50">{document.type}</p>

                  {/* Verified Badge */}
                  {document.verified && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-emerald-400">
                      <HugeiconsIcon icon={Tick02Icon} className="w-3 h-3" />
                      Verified
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
