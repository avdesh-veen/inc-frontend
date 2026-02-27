export type BusinessEntityStatus = "active" | "inactive";

export interface BusinessEntity {
  id: string;
  clientId: string;
  clientName: string;
  entityName: string;
  location: string;
  type: string;
  taxId: string;
  groupNpis: string[];
  providerCount: number;
  activeContractsCount: number;
  inProcessContractsCount: number;
  endedContractsCount: number;
  status: BusinessEntityStatus;
}

export interface BusinessEntityFilters {
  search?: string;
  clientId?: string;
  type?: string;
}

/** Extended entity for detail view (contact, primary NPI-2, etc.) */
export interface BusinessEntityDetail extends BusinessEntity {
  primaryNpi2?: string;
  entityType?: string;
  subtype?: string;
  /** Contact person for the entity */
  contactPerson?: {
    name: string;
    title?: string;
    phone?: string;
    email?: string;
  };
  /** Authorized official */
  authorizedOfficial?: {
    name: string;
    title?: string;
    npi1?: string;
    email?: string;
    ssn?: string;
    dateOfBirth?: string;
  };
  /** General contact */
  phone?: string;
  fax?: string;
  email?: string;
  website?: string;
  /** Number of locations (for overview stat) */
  locationCount?: number;
  /** Detailed group NPI records for the Group NPIs tab */
  groupNpiDetails?: GroupNpiDetail[];
  /** Full location records for the Locations tab */
  locations?: EntityLocation[];
  /** Affiliated providers for the Providers tab */
  affiliatedProviders?: AffiliatedProvider[];
  /** Payer contracts for the Contracts tab */
  payerContracts?: PayerContract[];
}

export type LocationType = "service" | "billing" | "mailing";

export interface LocationTag {
  label: string;
  variant: "emerald" | "amber" | "blue" | "slate";
}

export interface LocationHours {
  day: string;
  hours: string;
}

export interface PayerLocationId {
  payerName: string;
  locationId: string;
}

export interface EntityLocation {
  id: string;
  type: LocationType;
  isPrimary: boolean;
  isAdaAccessible?: boolean;
  isPrivate?: boolean;
  npiRef?: string;
  npiLabel?: string;
  address: string;
  cityStateZip: string;
  phone?: string;
  manager?: string;
  hoursOfOperation?: LocationHours[];
  payerLocationIds?: PayerLocationId[];
}

export type NpiLocationType = "primary" | "service" | "billing";

export interface NpiServiceLocation {
  id: string;
  type: NpiLocationType;
  address: string;
  cityStateZip: string;
  phone?: string;
}

export interface GroupNpiDetail {
  npi: string;
  label: string;
  isPrimary: boolean;
  locations: NpiServiceLocation[];
}

export type PayerContractCategory = "government" | "commercial";
export type PayerContractStatus = "active" | "inactive" | "pending";
export type PayerDelegation = "delegated" | "non-delegated";

export interface PayerContract {
  id: string;
  payerName: string;
  category: PayerContractCategory;
  effectiveDate: string;
  renewalDate: string;
  delegation: PayerDelegation;
  status: PayerContractStatus;
}

export type ProviderEmploymentStatus = "active" | "inactive" | "on_leave";

export interface AffiliatedProvider {
  id: string;
  firstName: string;
  lastName: string;
  credential: string;
  specialty: string;
  npi1: string;
  employmentStatus: ProviderEmploymentStatus;
  licenseExpiryDays: number;
}
