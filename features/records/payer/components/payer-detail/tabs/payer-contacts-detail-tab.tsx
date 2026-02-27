"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  CONTACT_TYPE_STYLES,
  CONTACT_TYPE_CARD_STYLES,
  type PayerDetail,
} from "@/features/records/payer/types";
import { StarRating } from "@/features/records/payer/components/shared/star-rating";
import { SuccessBadge } from "@/features/records/payer/components/shared/success-badge";
import { getInitials } from "@/features/records/payer/utils/format";
import { usePayerContacts } from "@/features/records/payer/hooks/use-payer-contacts";
import { AddContactModal } from "../add-contact-modal";
import { ContactDetailPanel } from "../contact-detail-panel";

// ─── Constants ─────────────────────────────────────────────────────────────────

const CONTACT_TYPE_LABEL: Record<string, string> = {
  primaryContact: "Primary Contact",
  callCenter: "Call Center",
  escalation: "Escalation",
};

// ─── Card skeleton ─────────────────────────────────────────────────────────────

function ContactCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-6 w-20 rounded-lg" />
      </div>
      <div className="space-y-2 mb-3">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-12 rounded-xl mb-3" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function PayerContactsDetailTab({ payer }: Readonly<{ payer: PayerDetail }>) {
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [selectedContactId, setSelectedContactId] = React.useState<string | null>(null);

  const { data, isLoading, isError } = usePayerContacts(payer.id);
  const contacts = data?.data?.items ?? [];
  const total = data?.data?.meta?.totalItems ?? 0;

  // ── When a contact is selected: full-page replacement with detail panel ──
  if (selectedContactId) {
    return (
      <ContactDetailPanel
        payerId={payer.id}
        contactId={selectedContactId}
        payerName={payer.name}
        onBack={() => setSelectedContactId(null)}
      />
    );
  }

  // ── Default: contacts list ──
  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground">Contacts</h3>
          <p className="text-sm text-muted-foreground">
            {isLoading
              ? "Loading…"
              : `${total} contact${total !== 1 ? "s" : ""} for ${payer.name}`}
          </p>
        </div>
        <Button
          className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white"
          size="sm"
          onClick={() => setAddModalOpen(true)}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Add Contact
        </Button>
      </div>

      {/* ── Loading ── */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ContactCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* ── Error ── */}
      {isError && !isLoading && (
        <div className="py-12 text-center text-muted-foreground text-sm">
          Failed to load contacts. Please try again.
        </div>
      )}

      {/* ── Empty ── */}
      {!isLoading && !isError && contacts.length === 0 && (
        <div className="py-12 text-center text-muted-foreground text-sm">
          No contacts found for this payer.
        </div>
      )}

      {/* ── Contact cards grid ── */}
      {!isLoading && !isError && contacts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map((contact) => {
            const displayType = CONTACT_TYPE_LABEL[contact.type] ?? contact.type;
            const cardStyle = CONTACT_TYPE_CARD_STYLES[displayType];
            const badgeClass =
              CONTACT_TYPE_STYLES[displayType] ?? "bg-slate-500/20 text-slate-300";
            const initials = getInitials(contact.name);

            return (
              <button
                type="button"
                key={contact.id}
                onClick={() => setSelectedContactId(contact.id)}
                className={cn(
                  "rounded-xl border p-5 cursor-pointer transition-all text-left w-full",
                  "border-white/5 bg-white/[0.02]",
                  cardStyle?.hover ?? "hover:border-white/10",
                )}
                aria-label={`View contact ${contact.name}`}
              >
                {/* Card header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0",
                        cardStyle?.gradient
                          ? `bg-gradient-to-br ${cardStyle.gradient}`
                          : "bg-gradient-to-br from-slate-500 to-slate-600",
                      )}
                      aria-hidden="true"
                    >
                      {initials}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{contact.name}</p>
                      {contact.title && (
                        <p className="text-xs text-muted-foreground">{contact.title}</p>
                      )}
                      {contact.organization && (
                        <p className="text-xs text-muted-foreground/70">{contact.organization}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge className={cn("rounded-lg text-xs font-medium px-2 py-1", badgeClass)}>
                      {displayType}
                    </Badge>
                    {contact.isPrimary && (
                      <Badge variant="tertiaryLight" className="rounded text-[10px] px-1.5 py-0.5">
                        Primary
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Contact info */}
                <div className="space-y-2 mb-3">
                  {contact.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-muted-foreground shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-muted-foreground">{contact.phone}</span>
                    </div>
                  )}
                  {contact.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-muted-foreground shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-muted-foreground truncate">{contact.email}</span>
                    </div>
                  )}
                  {contact.responseTime && (
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-muted-foreground shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-muted-foreground">Response: {contact.responseTime}</span>
                    </div>
                  )}
                </div>

                {/* Notes preview */}
                {contact.tipsAndNotes && (
                  <div className="p-3 rounded-xl bg-white/[0.02] mb-3">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {contact.tipsAndNotes}
                    </p>
                  </div>
                )}

                {/* Footer: stars + success rate */}
                {contact.successRate !== null && (
                  <div className="flex items-center justify-between">
                    <StarRating rating={contact.successRate * 5} showEmpty />
                    <SuccessBadge rate={contact.successRate} variant="span" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      <AddContactModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        payerId={payer.id}
      />
    </div>
  );
}
