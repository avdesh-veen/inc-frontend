"use client";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type {
  AffiliatedProvider,
  ProviderEmploymentStatus,
} from "@/features/records/business-entities/types";

interface ProvidersGridProps {
  providers: AffiliatedProvider[];
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function getStatusBadge(status: ProviderEmploymentStatus) {
  switch (status) {
    case "active":
      return { label: "Active", className: "bg-emerald-500/20 text-emerald-300" };
    case "inactive":
      return { label: "Inactive", className: "bg-slate-500/20 text-slate-300" };
    case "on_leave":
      return { label: "On Leave", className: "bg-amber-500/20 text-amber-300" };
  }
}

function getExpiryColor(days: number): string {
  if (days <= 30) return "text-rose-400";
  if (days <= 90) return "text-amber-400";
  return "text-emerald-400";
}
function formatExpiry(days: number): string {
  if (days <= 0) return "Expired";
  return `${days} days`;
}

export function ProvidersGrid({ providers }: Readonly<ProvidersGridProps>) {
  return (
    <Table variant="secondary">
      <TableHeader>
        <ProviderHeaderRow />
      </TableHeader>
      <TableBody>
        {providers.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={5}
              className="h-24 text-center hover:bg-transparent"
            >
              No affiliated providers found
            </TableCell>
          </TableRow>
        ) : (
          providers.map((provider) => (
            <ProviderRow key={provider.id} provider={provider} />
          ))
        )}
      </TableBody>
    </Table>
  );
}

function ProviderHeaderRow() {
  return (
    <TableRow className="border-b border-white/5 hover:bg-transparent">
      <TableHead>Provider</TableHead>
      <TableHead>Specialty</TableHead>
      <TableHead>NPI-1</TableHead>
      <TableHead>Employment Status</TableHead>
      <TableHead>License Expiry</TableHead>
    </TableRow>
  );
}

interface ProviderRowProps {
  provider: AffiliatedProvider;
}

function ProviderRow({ provider }: Readonly<ProviderRowProps>) {
  const initials = getInitials(provider.firstName, provider.lastName);
  const statusBadge = getStatusBadge(provider.employmentStatus);
  const expiryColor = getExpiryColor(provider.licenseExpiryDays);
  const fullName = `Dr. ${provider.firstName} ${provider.lastName}, ${provider.credential}`;

  return (
    <TableRow className="border-b border-white/5">
      <TableCell className="px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 text-sm font-bold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <p className="font-medium text-white">{fullName}</p>
        </div>
      </TableCell>
      <TableCell className="px-4 py-4 text-white/70">
        {provider.specialty}
      </TableCell>
      <TableCell className="px-4 py-4 font-mono text-xs text-white/50">
        {provider.npi1}
      </TableCell>
      <TableCell className="px-4 py-4">
        <Badge className={statusBadge.className} size="xs">
          {statusBadge.label}
        </Badge>
      </TableCell>
      <TableCell className="px-4 py-4">
        <span className={cn("text-sm font-medium", expiryColor)}>
          {formatExpiry(provider.licenseExpiryDays)}
        </span>
      </TableCell>
    </TableRow>
  );
}
