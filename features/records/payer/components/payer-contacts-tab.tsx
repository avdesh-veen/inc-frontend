"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  PencilEdit02Icon,
  StarIcon,
  CheckmarkCircle02Icon,
  Download04Icon,
} from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  MOCK_PAYER_CONTACTS,
  CONTACT_TYPE_STYLES,
  type PayerContact,
} from "@/features/records/payer/types";
import { StarRating } from "@/features/records/payer/components/shared/star-rating";
import { SuccessBadge } from "@/features/records/payer/components/shared/success-badge";

const thClass =
  "px-4 py-3 text-left text-xs font-bold text-white/50 uppercase";

function ContactRow({ contact }: Readonly<{ contact: PayerContact }>) {
  const typeStyle =
    CONTACT_TYPE_STYLES[contact.contactType] ?? "bg-slate-500/20 text-slate-300";

  return (
    <TableRow className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer">
      <TableCell className="px-4 py-3">
        <div>
          <p className="font-medium text-white">{contact.name}</p>
          <p className="text-xs text-white/50">{contact.title}</p>
        </div>
      </TableCell>
      <TableCell className="px-4 py-3">
        <div>
          <p className="text-white/80">{contact.payerName}</p>
          <p className="text-xs text-white/50 truncate max-w-[150px]">
            {contact.payerDetail}
          </p>
        </div>
      </TableCell>
      <TableCell className="px-4 py-3">
        <Badge
          variant="outline"
          className={cn("text-xs rounded-lg border-0", typeStyle)}
        >
          {contact.contactType}
        </Badge>
      </TableCell>
      <TableCell className="px-4 py-3 text-white/60 text-xs">
        {contact.states}
      </TableCell>
      <TableCell className="px-4 py-3">
        <StarRating rating={contact.rating} />
      </TableCell>
      <TableCell className="px-4 py-3">
        <SuccessBadge rate={contact.successRate} />
      </TableCell>
      <TableCell className="px-4 py-3">
        <div>
          <Badge
            variant="outline"
            className="text-xs rounded border-0 bg-rose-500/20 text-rose-300"
          >
            {contact.lastPositiveDaysAgo}d ago
          </Badge>
          <p className="text-[10px] text-white/50 mt-1">
            {contact.lastPositiveBy}
          </p>
        </div>
      </TableCell>
      <TableCell className="px-4 py-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Edit ${contact.name}`}
            className="text-white/50 hover:text-white"
          >
            <HugeiconsIcon
              icon={PencilEdit02Icon}
              className="size-4"
              strokeWidth={2}
              aria-hidden="true"
            />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Rate ${contact.name}`}
            className="text-white/50 hover:text-amber-400"
          >
            <HugeiconsIcon
              icon={StarIcon}
              className="size-4"
              strokeWidth={2}
              aria-hidden="true"
            />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Log interaction for ${contact.name}`}
            className="text-white/50 hover:text-emerald-400"
          >
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              className="size-4"
              strokeWidth={2}
              aria-hidden="true"
            />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function PayerContactsTab() {
  return (
    <Card className="overflow-hidden mt-4">
      <CardContent className="p-0">
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">
              All Payer Contacts
            </h3>
            <Button variant="outline" size="sm" className="gap-2">
              <HugeiconsIcon
                icon={Download04Icon}
                className="size-4"
                strokeWidth={2}
                aria-hidden="true"
              />
              Export
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white/10 bg-white/[0.02] hover:bg-transparent">
                <TableHead className={thClass}>Contact</TableHead>
                <TableHead className={thClass}>Payer</TableHead>
                <TableHead className={thClass}>Type</TableHead>
                <TableHead className={thClass}>State</TableHead>
                <TableHead className={thClass}>Rating</TableHead>
                <TableHead className={thClass}>Success</TableHead>
                <TableHead className={thClass}>Last Positive</TableHead>
                <TableHead className={thClass}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_PAYER_CONTACTS.map((contact) => (
                <ContactRow key={contact.id} contact={contact} />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
