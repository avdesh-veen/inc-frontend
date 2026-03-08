/**
 * Client Providers Tab
 *
 * Displays list of providers associated with the client.
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import {
  ClientProvider,
  ProviderStatus,
} from "@/features/records/clients/types";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  getClientInitials,
  getAvatarColor,
  getStatusBadgeClass,
  getResponsivenessColorClass,
} from "@/features/records/clients/utils/helpers";

interface ClientProvidersTabProps {
  clientId: string;
}

const mockProviders: ClientProvider[] = [
  {
    id: "prov-001",
    name: "Dr. Sarah Johnson",
    credential: "MD",
    specialty: "Family Medicine",
    status: ProviderStatus.ACTIVE,
    responsiveness: 92,
  },
  {
    id: "prov-002",
    name: "Dr. Michael Chen",
    credential: "DO",
    specialty: "Internal Medicine",
    status: ProviderStatus.ACTIVE,
    responsiveness: 78,
  },
  {
    id: "prov-003",
    name: "Dr. Emily Williams",
    credential: "NP",
    specialty: "Pediatrics",
    status: ProviderStatus.PENDING,
    responsiveness: 0,
  },
  {
    id: "prov-004",
    name: "Dr. James Martinez",
    credential: "MD",
    specialty: "Cardiology",
    status: ProviderStatus.INACTIVE,
    responsiveness: 45,
  },
];

export function ClientProvidersTab({
  clientId,
}: Readonly<ClientProvidersTabProps>) {
  const [providers] = useState<ClientProvider[]>(mockProviders);
  const [isLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <h3 className="text-lg font-semibold">
          {providers.length} Provider{providers.length !== 1 ? "s" : ""}
        </h3>
        <Button size="default">
          <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4 mr-2" />
          Add Provider
        </Button>
      </div>

      {/* Table */}
      {providers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <HugeiconsIcon
              icon={PlusSignIcon}
              className="w-8 h-8 text-white/30"
            />
          </div>
          <h4 className="text-lg font-medium text-white/80 mb-2">
            No providers yet
          </h4>
          <p className="text-sm text-white/50 mb-6 max-w-md">
            Get started by adding providers to this client. Providers will
            appear here once added.
          </p>
          <Button size="default">
            <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4 mr-2" />
            Add Provider
          </Button>
        </div>
      ) : (
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-white/5">
                <TableHead className="w-[250px] text-white/60 font-medium">
                  PROVIDER
                </TableHead>
                <TableHead className="w-[180px] text-white/60 font-medium">
                  SPECIALTY
                </TableHead>
                <TableHead className="w-[120px] text-white/60 font-medium">
                  STATUS
                </TableHead>
                <TableHead className="w-[200px] text-white/60 font-medium">
                  RESPONSIVENESS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers.map((provider) => (
                <TableRow
                  key={provider.id}
                  className="hover:bg-white/5 border-white/5"
                >
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback
                          className={getAvatarColor(provider.name)}
                        >
                          {getClientInitials(provider.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-white">
                          {provider.name}
                        </p>
                        <p className="text-sm text-white/50">
                          {provider.credential}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-white/80">
                    {provider.specialty}
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge
                      variant="outline"
                      className={`text-xs font-medium ${getStatusBadgeClass(provider.status)}`}
                    >
                      {provider.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    {provider.responsiveness > 0 ? (
                      <div className="flex items-center gap-3">
                        <Progress
                          value={provider.responsiveness}
                          className={`h-2 w-24 ${getResponsivenessColorClass(provider.responsiveness)}`}
                        />
                        <span
                          className={`text-sm font-medium ${
                            provider.responsiveness >= 90
                              ? "text-emerald-400"
                              : provider.responsiveness >= 70
                                ? "text-green-400"
                                : provider.responsiveness >= 40
                                  ? "text-yellow-400"
                                  : "text-orange-400"
                          }`}
                        >
                          {provider.responsiveness}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-white/40 text-sm">N/A</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
