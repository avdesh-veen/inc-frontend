/**
 * Contact Detail Modal
 *
 * Full detail view for a single payer contact.
 * Data: GET /api/v1/payers/{payerId}/contacts/{id}
 */

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { getInitials } from "@/features/records/payer/utils/format";
import { CONTACT_TYPE_STYLES, CONTACT_TYPE_CARD_STYLES } from "@/features/records/payer/types";
import { usePayerContactById } from "@/features/records/payer/hooks/use-payer-contacts";
import { useToast } from "@/hooks/use-toast";

// ─── Constants ────────────────────────────────────────────────────────────────

const CONTACT_TYPE_LABEL: Record<string, string> = {
  primaryContact: "Primary Contact",
  callCenter: "Call Center",
  escalation: "Escalation",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-5">
        <Skeleton className="w-20 h-20 rounded-2xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3.5 w-40" />
          <div className="flex gap-2 mt-3">
            <Skeleton className="h-7 w-28 rounded-xl" />
            <Skeleton className="h-7 w-10 rounded-xl" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-24 ml-auto" />
          <Skeleton className="h-7 w-28 rounded-xl ml-auto" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-14 rounded-xl" />
      <Skeleton className="h-20 rounded-xl" />
      <Skeleton className="h-16 rounded-xl" />
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ContactDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payerId: string;
  contactId: string | null;
  payerName?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ContactDetailModal({
  open,
  onOpenChange,
  payerId,
  contactId,
  payerName,
}: Readonly<ContactDetailModalProps>) {
  const { toast } = useToast();
  const { data, isLoading, isError } = usePayerContactById(payerId, contactId);
  const contact = data?.data;

  const displayType = contact ? (CONTACT_TYPE_LABEL[contact.type] ?? contact.type) : "";
  const cardStyle = CONTACT_TYPE_CARD_STYLES[displayType];
  const badgeClass = CONTACT_TYPE_STYLES[displayType] ?? "bg-slate-500/20 text-slate-300";
  const successPct = contact?.successRate != null ? Math.round(contact.successRate * 100) : null;
  const starCount = contact?.successRate != null ? Math.round(contact.successRate * 5) : 0;

  const fullAddress = [
    contact?.streetAddress,
    contact?.city,
    contact?.state?.code,
    contact?.zip,
  ]
    .filter(Boolean)
    .join(", ");

  const handleCopyAddress = () => {
    const addr = contact?.mailingAddress ?? fullAddress;
    if (!addr) return;
    navigator.clipboard.writeText(addr).then(() => {
      toast({ title: "Address copied to clipboard" });
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 w-full sm:max-w-lg mx-4 gap-0 bg-[#0e1019] backdrop-blur-xl border-white/10 max-h-[85vh] flex flex-col overflow-hidden"
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Contact Details</DialogTitle>
          <DialogDescription>
            Full details for the selected payer contact
          </DialogDescription>
        </DialogHeader>

        {/* ── Sticky close button ── */}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white"
          aria-label="Close dialog"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>

        {/* ── Scrollable body ── */}
        <ScrollArea className="flex-1">
          <div className="p-6">

            {isLoading && <DetailSkeleton />}

            {isError && !isLoading && (
              <p className="py-16 text-center text-muted-foreground text-sm">
                Failed to load contact details. Please try again.
              </p>
            )}

            {!isLoading && !isError && contact && (
              <div className="space-y-4">
                {/* ── Hero header ── */}
                <div className="flex items-start gap-5 pr-8">
                  {/* Avatar */}
                  <Avatar
                    className={cn(
                      "w-20 h-20 rounded-2xl shrink-0",
                      cardStyle?.gradient
                        ? `bg-gradient-to-br ${cardStyle.gradient}`
                        : "bg-gradient-to-br from-slate-500 to-slate-600",
                    )}
                  >
                    <AvatarFallback
                      className={cn(
                        "rounded-2xl text-white font-bold text-2xl bg-transparent",
                      )}
                    >
                      {getInitials(contact.name)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Name / title / org + badges */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold text-white leading-tight">{contact.name}</h2>
                    {contact.title && (
                      <p className="text-white/50 text-sm mt-0.5">{contact.title}</p>
                    )}
                    {contact.organization && (
                      <p className="text-white/40 text-sm mt-0.5">{contact.organization}</p>
                    )}
                    <div className="flex items-center gap-2 flex-wrap mt-3">
                      <Badge className={cn("rounded-xl text-sm font-medium px-3 py-1.5", badgeClass)}>
                        {displayType}
                      </Badge>
                      {contact.state?.code && (
                        <Badge variant="outline" className="rounded-xl text-sm px-3 py-1.5">
                          {contact.state.code}
                        </Badge>
                      )}
                      {contact.isPrimary && (
                        <Badge variant="tertiaryLight" className="rounded-xl text-sm px-3 py-1.5">
                          Primary
                        </Badge>
                      )}
                      {contact.caqhRequired && (
                        <Badge className="rounded-xl text-sm px-3 py-1.5 bg-violet-500/20 text-violet-300">
                          CAQH Required
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Stars + success rate */}
                  {successPct !== null && (
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-0.5 justify-end mb-2" aria-label={`${starCount} out of 5 stars`}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={cn("w-5 h-5", i < starCount ? "text-amber-400" : "text-white/10")}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <Badge variant="tertiaryLight" className="rounded-xl text-sm font-bold px-3 py-1.5">
                        {successPct}% Success Rate
                      </Badge>
                    </div>
                  )}
                </div>

                {/* ── Contact info grid ── */}
                <div className="grid grid-cols-2 gap-3">
                  {contact.phone && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03]">
                      <svg className="w-5 h-5 text-white/50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div className="min-w-0">
                        <p className="text-xs text-white/50">Phone</p>
                        <p className="text-white font-mono text-sm truncate">{contact.phone}</p>
                      </div>
                    </div>
                  )}

                  {contact.email && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03]">
                      <svg className="w-5 h-5 text-white/50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div className="min-w-0">
                        <p className="text-xs text-white/50">Email</p>
                        <p className="text-white text-sm truncate">{contact.email}</p>
                      </div>
                    </div>
                  )}

                  {(contact.responseTime ?? contact.responseTimeHours != null) && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03]">
                      <svg className="w-5 h-5 text-white/50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-xs text-white/50">Response Time</p>
                        <p className="text-white text-sm">
                          {contact.responseTime ?? `${contact.responseTimeHours} hrs`}
                        </p>
                      </div>
                    </div>
                  )}

                  {contact.bestTimeToReach && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03]">
                      <svg className="w-5 h-5 text-white/50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-xs text-white/50">Best Time to Reach</p>
                        <p className="text-white text-sm">{contact.bestTimeToReach}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Mailing address ── */}
                {(contact.mailingAddress ?? fullAddress) && (
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03]">
                    <svg className="w-5 h-5 text-white/50 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/50">
                        {contact.mailingAddress ? "Mailing Address" : "Address"}
                      </p>
                      <p className="text-white text-sm">
                        {contact.mailingAddress ?? fullAddress}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={handleCopyAddress}
                      className="rounded-lg hover:bg-white/10 text-white/50 hover:text-white shrink-0"
                      aria-label="Copy address to clipboard"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </Button>
                  </div>
                )}

                {/* ── Last Positive Contact ── */}
                {contact.lastPositiveContactDate && (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-rose-400 font-medium uppercase tracking-wide">
                            Last Positive Contact
                          </p>
                          <p className="text-white font-medium">
                            {formatDate(contact.lastPositiveContactDate)}
                          </p>
                        </div>
                      </div>
                      {(contact.lastPositiveContactBy ?? contact.lastPositiveDaysAgo != null) && (
                        <div className="text-right">
                          {contact.lastPositiveContactBy && (
                            <>
                              <p className="text-xs text-white/50">Contacted by</p>
                              <p className="text-sm text-white">{contact.lastPositiveContactBy}</p>
                            </>
                          )}
                          {contact.lastPositiveDaysAgo != null && (
                            <p className="text-xs text-rose-400 mt-1">
                              {contact.lastPositiveDaysAgo} days ago
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── Tips & Notes ── */}
                {contact.tipsAndNotes && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span className="text-sm font-medium text-amber-400">Tips &amp; Notes</span>
                    </div>
                    <p className="text-white text-sm leading-relaxed">{contact.tipsAndNotes}</p>
                  </div>
                )}

                {/* ── Tags ── */}
                {contact.tags && contact.tags.length > 0 && (
                  <div>
                    <p className="text-xs text-white/50 mb-2">Tags</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {contact.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="rounded-lg text-sm px-3 py-1 text-white/60"
                        >
                          #{tag.replace(/^#/, "")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Associated Payer ── */}
                {payerName && (
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <p className="text-xs text-white/50 mb-2">Associated Payer</p>
                    <p className="font-medium text-white">{payerName}</p>
                  </div>
                )}

                {/* ── Footer actions ── */}
                <div className="space-y-0 pt-2">
                  <Separator className="mb-4 bg-white/10" />
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex-1 gap-2 px-4 py-2.5 h-auto rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Button>
                    <Button
                      type="button"
                      className="flex-1 gap-2 px-4 py-2.5 h-auto rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      Rate
                    </Button>
                    <Button
                      type="button"
                      className="flex-1 gap-2 px-4 py-2.5 h-auto rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 border-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Log Interaction
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
