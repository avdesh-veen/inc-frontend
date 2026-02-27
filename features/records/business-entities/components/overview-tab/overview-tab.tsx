"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { BusinessEntityDetail } from "@/features/records/business-entities/types";

interface OverviewTabProps {
  entity: BusinessEntityDetail;
}

export function OverviewTab({
  entity,
}: Readonly<OverviewTabProps>) {
  const locationCount = entity.locationCount ?? 0;
  const groupNpiCount = entity.groupNpis?.length ?? 0;

  const statCards = [
    {
      title: "Providers",
      value: entity.providerCount,
      valueClass: "text-white",
      description: "Affiliated providers",
    },
    {
      title: "Payer Contracts",
      value: entity.activeContractsCount,
      valueClass: "text-blue-400",
      description: "Active contracts",
    },
    {
      title: "Group NPIs",
      value: groupNpiCount,
      valueClass: "text-violet-400",
      description: "NPI-2 identifiers",
    },
    {
      title: "Locations",
      value: locationCount,
      valueClass: "text-emerald-400",
      description: "Service locations",
    },
  ];

  const primaryNpi2 = entity.primaryNpi2 ?? entity.groupNpis?.[0] ?? "—";
  const entityType = entity.entityType ?? entity.type;
  const subtype = entity.subtype ?? entity.type;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card
            key={card.title}
            className="rounded-[24px] border-white/10 bg-white/[0.02] backdrop-blur-sm"
          >
            <CardContent className="p-6">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/60">
                {card.title}
              </h3>
              <div className={`text-3xl font-bold ${card.valueClass}`}>
                {card.value}
              </div>
              <p className="mt-1 text-sm text-white/50">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="rounded-[24px] border-white/10 bg-white/[0.02] backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white">
              Entity Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailRow label="Entity Name" value={entity.entityName} />
            <DetailRow label="Entity Type" value={entityType} />
            <DetailRow label="Subtype" value={subtype} />
            <DetailRow label="Tax ID (EIN)" value={entity.taxId} mono />
            <DetailRow label="Primary NPI-2" value={primaryNpi2} mono />
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border-white/10 bg-white/[0.02] backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white">
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {entity.contactPerson && (
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <div className="mb-3 text-xs font-bold uppercase text-white/40">
                    Contact Person
                  </div>
                  <p className="font-medium text-white">
                    {entity.contactPerson.name}
                  </p>
                  {entity.contactPerson.title && (
                    <p className="text-sm text-white/50">
                      {entity.contactPerson.title}
                    </p>
                  )}
                  {entity.contactPerson.phone && (
                    <p className="mt-2 text-sm text-white/50">
                      {entity.contactPerson.phone}
                    </p>
                  )}
                  {entity.contactPerson.email && (
                    <a
                      href={`mailto:${entity.contactPerson.email}`}
                      className="mt-1 block text-sm text-emerald-400 hover:underline"
                    >
                      {entity.contactPerson.email}
                    </a>
                  )}
                </div>
              )}
              {entity.authorizedOfficial && (
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <div className="mb-3 text-xs font-bold uppercase text-white/40">
                    Authorized Official
                  </div>
                  <p className="font-medium text-white">
                    {entity.authorizedOfficial.name}
                  </p>
                  {entity.authorizedOfficial.title && (
                    <p className="text-sm text-white/50">
                      {entity.authorizedOfficial.title}
                    </p>
                  )}
                  {entity.authorizedOfficial.npi1 && (
                    <p className="mt-2 text-sm text-white/50">
                      NPI-1:{" "}
                      <span className="font-mono">
                        {entity.authorizedOfficial.npi1}
                      </span>
                    </p>
                  )}
                  {entity.authorizedOfficial.email && (
                    <a
                      href={`mailto:${entity.authorizedOfficial.email}`}
                      className="block text-sm text-emerald-400 hover:underline"
                    >
                      {entity.authorizedOfficial.email}
                    </a>
                  )}
                  <div className="mt-3 grid grid-cols-2 gap-3 border-t border-white/10 pt-3">
                    <div>
                      <span className="text-[10px] uppercase text-white/40">
                        SSN
                      </span>
                      <p className="text-sm font-mono text-white/70">
                        {entity.authorizedOfficial.ssn ?? "Not set"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-white/40">
                        Date of Birth
                      </span>
                      <p className="text-sm text-white/70">
                        {entity.authorizedOfficial.dateOfBirth ?? "Not set"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {!entity.contactPerson && !entity.authorizedOfficial && (
                <p className="col-span-2 text-sm text-white/50">
                  No contact information available.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {(entity.phone ||
        entity.fax ||
        entity.email ||
        entity.website) && (
        <Card className="rounded-[24px] border-white/10 bg-white/[0.02] backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white">
              General Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {entity.phone && (
                <div>
                  <span className="mb-1 block text-sm text-white/50">
                    Phone
                  </span>
                  <a
                    href={`tel:${entity.phone.replace(/\D/g, "")}`}
                    className="text-white hover:underline"
                  >
                    {entity.phone}
                  </a>
                </div>
              )}
              {entity.fax && (
                <div>
                  <span className="mb-1 block text-sm text-white/50">Fax</span>
                  <span className="text-white">{entity.fax}</span>
                </div>
              )}
              {entity.email && (
                <div>
                  <span className="mb-1 block text-sm text-white/50">
                    Email
                  </span>
                  <a
                    href={`mailto:${entity.email}`}
                    className="text-emerald-400 hover:underline"
                  >
                    {entity.email}
                  </a>
                </div>
              )}
              {entity.website && (
                <div>
                  <span className="mb-1 block text-sm text-white/50">
                    Website
                  </span>
                  <a
                    href={
                      entity.website.startsWith("http")
                        ? entity.website
                        : `https://${entity.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline"
                  >
                    {entity.website}
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-white/50">{label}</span>
      <span className={mono ? "font-mono text-white" : "text-white"}>
        {value}
      </span>
    </div>
  );
}
