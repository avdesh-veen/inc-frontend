/**
 * Provider Affiliations Tab
 * 
 * Affiliations tab showing facility associations.
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Provider } from '@/features/records/providers/types';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlusSignIcon, Building01Icon } from '@hugeicons/core-free-icons';

interface ProviderAffiliationsTabProps {
  provider: Provider;
}

export function ProviderAffiliationsTab({ provider }: Readonly<ProviderAffiliationsTabProps>) {
  return (
    <div className="space-y-6">
      <Card className="border-white/5 bg-white/[0.02]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Facility Associations</CardTitle>
          <Button size="sm" variant="outline" className="gap-1.5">
            <HugeiconsIcon icon={PlusSignIcon} className="size-3.5" strokeWidth={2} />
            Add Association
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {provider.organizationalAffiliations.map((affiliation, index) => (
              <div key={index} className="flex items-center gap-4 rounded-lg border border-white/5 bg-white/[0.02] p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
                  <HugeiconsIcon icon={Building01Icon} className="size-6" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-foreground">{affiliation}</h4>
                  <p className="mt-0.5 text-xs text-muted-foreground">Staff Physician • Since 2023</p>
                </div>
              </div>
            ))}

            {provider.organizationalAffiliations.length === 0 && (
              <div className="rounded-lg border border-dashed border-white/10 p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No facility associations added yet
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
