/**
 * Client Overview Tab
 *
 * Displays client overview information in a 3-column layout:
 * - Column 1: Primary Contact, Billing Contact
 * - Column 2: Address, Contract Details, Portal Settings
 * - Column 3: Recent Activity, Notes
 */

"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Client,
  ClientBillingContact,
  ActivityEntityType,
} from "@/features/records/clients/types";
import { Skeleton } from "@/components/ui/skeleton";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  Call02Icon,
  ActivityIcon,
} from "@hugeicons/core-free-icons";
import {
  formatDate,
  getActivityBadgeClass,
} from "@/features/records/clients/utils/helpers";
import { formatDistanceToNow } from "date-fns";

interface ClientOverviewTabProps {
  client: Client;
}

export function ClientOverviewTab({
  client,
}: Readonly<ClientOverviewTabProps>) {
  const [isLoading] = useState(false);
  const billingContact = client.contacts.find(
    (contact) => contact.contactType === ClientBillingContact.BILLING,
  );
  const primaryContact = client.contacts.find(
    (contact) => contact.contactType === ClientBillingContact.PRIMARY,
  );

  const recentActivities = useMemo(() => {
    return [
      {
        id: "1",
        timestamp: new Date("2026-03-08T10:00:00"),
        action: "Enrollment created",
        performedBy: "John Smith",
        details: "New enrollment request for Dr. Sarah Johnson",
        relatedEntityType: ActivityEntityType.ENROLLMENT,
        relatedEntityId: "enr-1234",
      },
      {
        id: "2",
        timestamp: new Date("2026-03-07T14:30:00"),
        action: "Provider added",
        performedBy: "Jane Doe",
        details: "Dr. Michael Chen added to the network",
        relatedEntityType: ActivityEntityType.PROVIDER,
        relatedEntityId: "prov-5678",
      },
      {
        id: "3",
        timestamp: new Date("2026-03-05T09:15:00"),
        action: "Document uploaded",
        performedBy: "John Smith",
        details: "Contract document updated",
        relatedEntityType: ActivityEntityType.DOCUMENT,
        relatedEntityId: "doc-9012",
      },
    ].slice(0, 3);
  }, []);

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
            <p className="text-white font-medium">
              {primaryContact?.contactName || "Not specified"}
            </p>
            {primaryContact?.title && (
              <p className="text-white/50 text-sm">{primaryContact.title}</p>
            )}
            <div className="flex items-center gap-2 text-sm">
              <HugeiconsIcon
                icon={Mail01Icon}
                className="w-4 h-4 text-white/50"
              />
              <span className="text-white/60">
                {primaryContact?.email || "N/A"}
              </span>
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
                <p className="text-white font-medium">
                  {billingContact.contactName}
                </p>
                {billingContact.title && (
                  <p className="text-white/50 text-sm">
                    {billingContact.title}
                  </p>
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
                    <span className="text-white/60">
                      {billingContact.phone}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <p className="text-white/50 text-sm">
                No billing contact specified
              </p>
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
              {client.address?.city}, {client.address?.state}{" "}
              {client.address?.zip}
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
              <span className="text-white">
                {formatDate(
                  client.contractStartDate
                    ? new Date(client.contractStartDate)
                    : null,
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">End Date</span>
              <span className="text-white">
                {formatDate(
                  client.contractEndDate
                    ? new Date(client.contractEndDate)
                    : null,
                )}
              </span>
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
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-600"
                    : "bg-rose-500/20 text-rose-300 border-rose-600"
                }`}
              >
                {client.portalAccess ? "Enabled" : "Disabled"}
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
            ) : recentActivities.length === 0 ? (
              <p className="text-white/50 text-sm">No recent activity</p>
            ) : (
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className="shrink-0">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <HugeiconsIcon
                          icon={ActivityIcon}
                          className="h-4 w-4 text-primary"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant="outline"
                          className={getActivityBadgeClass(activity.action)}
                        >
                          {activity.action}
                        </Badge>
                        <span className="text-xs text-white/50">
                          {formatDistanceToNow(new Date(activity.timestamp), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-white/60 mt-1 truncate">
                        {activity.details}
                      </p>
                      <p className="text-xs text-white/40 mt-0.5">
                        by {activity.performedBy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
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
