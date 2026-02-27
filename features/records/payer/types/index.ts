export interface StateItem {
  id: string;
  name: string;
  code: string;
}

export interface StateRequest {
  page?: number;
  limit?: number;
  search?: string;
}

/** A single contact returned by GET /api/v1/payers/:id/contacts */
export interface PayerContactItem {
  id: string;
  payerId: string;
  name: string;
  title: string | null;
  type: string;
  organization: string | null;
  phone: string | null;
  email: string | null;
  mailingAddress: string | null;
  streetAddress: string | null;
  city: string | null;
  stateId: string | null;
  zip: string | null;
  bestTimeToReach: string | null;
  responseTime: string | null;
  responseTimeHours: number | null;
  tipsAndNotes: string | null;
  successRate: number | null;
  isPrimary: boolean;
  caqhRequired: boolean;
  isActive: boolean;
}

/** Request params for GET /api/v1/payers/:id/contacts */
export interface PayerContactRequest {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  isPrimary?: boolean;
  isActive?: boolean;
  payerId?: string;
  stateId?: string;
}

/** Full contact detail returned by GET /api/v1/payers/:payerId/contacts/:id */
export interface PayerContactDetail extends PayerContactItem {
  state?: { id: string; name: string; code: string } | null;
  tags?: string[];
  lastPositiveContactDate?: string | null;
  lastPositiveContactBy?: string | null;
  lastPositiveDaysAgo?: number | null;
}

/** Request payload for POST /api/v1/payers/:id/contacts */
export interface CreatePayerContactRequest {
  name: string;
  title?: string;
  type: string;
  organization?: string;
  phone?: string;
  email?: string;
  mailingAddress?: string;
  streetAddress?: string;
  city?: string;
  stateId?: string;
  zip?: string;
  bestTimeToReach?: string;
  responseTime?: string;
  responseTimeHours?: number;
  tipsAndNotes?: string;
  successRate?: number;
  isPrimary?: boolean;
  caqhRequired?: boolean;
  isActive?: boolean;
}

/** A single client affiliation returned by GET /payers/:id/client-affiliations */
export interface ClientAffiliation {
  id: string;
  clientId: string;
  clientName: string;
  payerId: string;
  delegationStatus: string;
  enrolledProvidersCount: number;
  isActive: boolean;
}

/** Request params for GET /payers/:id/client-affiliations */
export interface ClientAffiliationRequest {
  page?: number;
  limit?: number;
  search?: string;
  clientId?: string;
  payerId?: string;
  delegationStatus?: string;
}

/** Request payload for POST /payers/:id/client-affiliations */
export interface CreateClientAffiliationRequest {
  clientId: string;
  payerId: string;
  delegationStatus: string;
  contractExpiry?: string;
}

export interface Payer {
  id: string;
  name: string;
  shortName: string | null;
  abbreviation: string | null;
  category: PayerCategory;
  categoryCode: string;
  subcategory: string;
  subcategoryCode: string;
  states: string;
  isDelegated: boolean;
  panelStatus: PanelStatus;
  tatDays: number;
  icon: string;
}

export type PayerCategory = "Government" | "Commercial" | "Workers Comp";

export type PanelStatus = "Open" | "Closed";

export type PayerSortField = "name" | "category" | "subcategory" | "states" | "isDelegated" | "panelStatus" | "tatDays";

export type PayerTab = "list" | "knowledge" | "contacts" | "insights";

export interface PayerFilters {
  search: string;
  category: string | null;
  subcategory: string | null;
  delegation: string | null;
  panel: string | null;
}

export interface PayerSort {
  field: PayerSortField;
  order: "asc" | "desc";
}

export const PAYER_CATEGORY_CONFIG: Record<string, { icon: string; colorClass: string; bgClass: string }> = {
  Government: {
    icon: "\u{1F3DB}\uFE0F",
    colorClass: "text-blue-400",
    bgClass: "bg-blue-500/10 hover:bg-blue-500/20",
  },
  Commercial: {
    icon: "\u{1F3E2}",
    colorClass: "text-emerald-400",
    bgClass: "bg-emerald-500/10 hover:bg-emerald-500/20",
  },
  "Workers Comp": {
    icon: "\u2696\uFE0F",
    colorClass: "text-amber-400",
    bgClass: "bg-amber-500/10 hover:bg-amber-500/20",
  },
};

export const SUBCATEGORY_OPTIONS = [
  { value: "all", label: "All Subcategories" },
  // Government — PayerSubCategory enum values
  { value: "MCR_FFS", label: "MCR FFS" },
  { value: "MCR_MA", label: "MCR MA" },
  { value: "MCD_FFS", label: "MCD FFS" },
  { value: "MCD_MCO", label: "MCD MCO" },
  { value: "TRICARE", label: "TRICARE" },
  { value: "VA_CHAMPVA", label: "VA/CHAMPVA" },
  // Commercial
  { value: "BCBS", label: "BCBS" },
  { value: "NATIONAL", label: "National" },
  { value: "REGIONAL", label: "Regional" },
  // Workers Comp
  { value: "WC", label: "WC" },
] as const;

/** Parent field options — values match PayerParent enum */
export const PARENT_OPTIONS = [
  { value: "CMS", label: "CMS — Medicare (all types)" },
  { value: "STATE_MEDICAID", label: "State Medicaid — Medicaid programs" },
  { value: "DHA", label: "DHA — TRICARE" },
  { value: "VA", label: "VA — VA/CHAMPVA" },
] as const;

/** Subcategory options filtered by payer type — values match PayerSubCategory enum */
export const SUBCATEGORY_BY_CATEGORY: Record<string, { value: string; label: string }[]> = {
  government: [
    { value: "MCR_FFS", label: "MCR FFS" },
    { value: "MCR_MA", label: "MCR MA" },
    { value: "MCD_FFS", label: "MCD FFS" },
    { value: "MCD_MCO", label: "MCD MCO" },
    { value: "TRICARE", label: "TRICARE" },
    { value: "VA_CHAMPVA", label: "VA/CHAMPVA" },
  ],
  commercial: [
    { value: "BCBS", label: "BCBS" },
    { value: "NATIONAL", label: "National" },
    { value: "REGIONAL", label: "Regional" },
  ],
  workers_comp: [
    { value: "WC", label: "WC" },
  ],
};

export const MOCK_PAYERS: Payer[] = [
  // ── Government › MCR FFS ──────────────────────────────────────────────────
  { id: "PAY001", name: "Medicare (Novitas)", shortName: "Medicare", abbreviation: "Novitas MCR", category: "Government", categoryCode: "GOV", subcategory: "MCR FFS", subcategoryCode: "GOV_MCR_FFS", states: "PA, NJ, DE, MD", isDelegated: false, panelStatus: "Open", tatDays: 45, icon: "\u{1F3DB}\uFE0F" },
  // ── Government › MCR MA ───────────────────────────────────────────────────
  { id: "PAY014", name: "UPMC for Life (MA)", shortName: "UPMC Life", abbreviation: "UPMC MA", category: "Government", categoryCode: "GOV", subcategory: "MCR MA", subcategoryCode: "GOV_MCR_MA", states: "PA", isDelegated: true, panelStatus: "Open", tatDays: 21, icon: "\u{1F3DB}\uFE0F" },
  { id: "PAY015", name: "Highmark Medicare Advantage", shortName: "Highmark MA", abbreviation: "HM Medicare", category: "Government", categoryCode: "GOV", subcategory: "MCR MA", subcategoryCode: "GOV_MCR_MA", states: "PA, WV, DE", isDelegated: true, panelStatus: "Open", tatDays: 21, icon: "\u{1F3DB}\uFE0F" },
  // ── Government › MCD FFS ──────────────────────────────────────────────────
  { id: "PAY002", name: "PA Medical Assistance (FFS)", shortName: "PA Medicaid FFS", abbreviation: "PA MCD FFS", category: "Government", categoryCode: "GOV", subcategory: "MCD FFS", subcategoryCode: "GOV_MCD_FFS", states: "PA", isDelegated: false, panelStatus: "Open", tatDays: 30, icon: "\u{1F3DB}\uFE0F" },
  // ── Government › MCD MCO ─────────────────────────────────────────────────
  { id: "PAY003", name: "AmeriHealth Caritas PA", shortName: "AmeriHealth", abbreviation: "AMHC PA", category: "Government", categoryCode: "GOV", subcategory: "MCD MCO", subcategoryCode: "GOV_MCD_MCO", states: "PA", isDelegated: false, panelStatus: "Open", tatDays: 21, icon: "\u{1F3DB}\uFE0F" },
  { id: "PAY016", name: "Keystone First (Southeast PA)", shortName: "Keystone First", abbreviation: "Keystone 1st", category: "Government", categoryCode: "GOV", subcategory: "MCD MCO", subcategoryCode: "GOV_MCD_MCO", states: "PA (Southeast)", isDelegated: false, panelStatus: "Open", tatDays: 60, icon: "\u{1F3DB}\uFE0F" },
  { id: "PAY004", name: "UPMC for You (CHC)", shortName: "UPMC CHC", abbreviation: "UPMC CHC", category: "Government", categoryCode: "GOV", subcategory: "MCD MCO", subcategoryCode: "GOV_MCD_MCO", states: "PA", isDelegated: true, panelStatus: "Open", tatDays: 18, icon: "\u{1F3DB}\uFE0F" },
  { id: "PAY005", name: "Geisinger GHP Family", shortName: "GHP Family", abbreviation: "GHP Family", category: "Government", categoryCode: "GOV", subcategory: "MCD MCO", subcategoryCode: "GOV_MCD_MCO", states: "PA", isDelegated: false, panelStatus: "Open", tatDays: 21, icon: "\u{1F3DB}\uFE0F" },
  // ── Government › TRICARE ─────────────────────────────────────────────────
  { id: "PAY019", name: "TRICARE East (Humana Military)", shortName: "TRICARE East", abbreviation: "TRICARE East", category: "Government", categoryCode: "GOV", subcategory: "TRICARE", subcategoryCode: "GOV_TRICARE", states: "PA, NJ, DE, MD", isDelegated: false, panelStatus: "Open", tatDays: 30, icon: "\u{1F3DB}\uFE0F" },
  // ── Government › VA/CHAMPVA ──────────────────────────────────────────────
  { id: "PAY020", name: "VA Philadelphia VAMC", shortName: "VA Philly", abbreviation: "VA Philly", category: "Government", categoryCode: "GOV", subcategory: "VA/CHAMPVA", subcategoryCode: "GOV_VA", states: "PA (Southeast)", isDelegated: false, panelStatus: "Open", tatDays: 60, icon: "\u{1F3DB}\uFE0F" },
  // ── Commercial › BCBS ────────────────────────────────────────────────────
  { id: "PAY006", name: "Highmark BCBS PA", shortName: "Highmark", abbreviation: "Highmark", category: "Commercial", categoryCode: "COM", subcategory: "BCBS", subcategoryCode: "COM_BCBS", states: "PA, NJ, DE, WV", isDelegated: true, panelStatus: "Open", tatDays: 21, icon: "\u{1F3E2}" },
  { id: "PAY007", name: "Independence Blue Cross", shortName: "IBX", abbreviation: "IBX", category: "Commercial", categoryCode: "COM", subcategory: "BCBS", subcategoryCode: "COM_BCBS", states: "PA (Southeast)", isDelegated: false, panelStatus: "Open", tatDays: 18, icon: "\u{1F3E2}" },
  { id: "PAY008", name: "Capital Blue Cross", shortName: "Capital BC", abbreviation: "Capital BC", category: "Commercial", categoryCode: "COM", subcategory: "BCBS", subcategoryCode: "COM_BCBS", states: "PA (Central)", isDelegated: false, panelStatus: "Open", tatDays: 15, icon: "\u{1F3E2}" },
  // ── Commercial › National ────────────────────────────────────────────────
  { id: "PAY011", name: "Aetna", shortName: "Aetna", abbreviation: null, category: "Commercial", categoryCode: "COM", subcategory: "National", subcategoryCode: "COM_NAT", states: "National", isDelegated: false, panelStatus: "Open", tatDays: 14, icon: "\u{1F3E2}" },
  { id: "PAY012", name: "Cigna", shortName: "Cigna", abbreviation: null, category: "Commercial", categoryCode: "COM", subcategory: "National", subcategoryCode: "COM_NAT", states: "National", isDelegated: false, panelStatus: "Open", tatDays: 18, icon: "\u{1F3E2}" },
  { id: "PAY013", name: "United Healthcare", shortName: "UHC", abbreviation: "UHC", category: "Commercial", categoryCode: "COM", subcategory: "National", subcategoryCode: "COM_NAT", states: "National", isDelegated: false, panelStatus: "Closed", tatDays: 30, icon: "\u{1F3E2}" },
  // ── Commercial › Regional ────────────────────────────────────────────────
  { id: "PAY009", name: "UPMC Health Plan", shortName: "UPMC HP", abbreviation: "UPMC Comm", category: "Commercial", categoryCode: "COM", subcategory: "Regional", subcategoryCode: "COM_REG", states: "PA", isDelegated: true, panelStatus: "Open", tatDays: 15, icon: "\u{1F3E2}" },
  { id: "PAY010", name: "Geisinger Health Plan", shortName: "Geisinger", abbreviation: "Geisinger", category: "Commercial", categoryCode: "COM", subcategory: "Regional", subcategoryCode: "COM_REG", states: "PA (Central/Northeast)", isDelegated: false, panelStatus: "Open", tatDays: 18, icon: "\u{1F3E2}" },
  // ── Workers Comp › WC ────────────────────────────────────────────────────
  { id: "PAY018", name: "PA State Workers Fund (SWIF)", shortName: "PA SWIF", abbreviation: "PA SWIF", category: "Workers Comp", categoryCode: "WC", subcategory: "WC", subcategoryCode: "WC", states: "PA", isDelegated: false, panelStatus: "Open", tatDays: 14, icon: "\u2696\uFE0F" },
  { id: "PAY021", name: "Travelers Workers Compensation", shortName: "Travelers WC", abbreviation: "Travelers WC", category: "Workers Comp", categoryCode: "WC", subcategory: "WC", subcategoryCode: "WC", states: "National", isDelegated: false, panelStatus: "Open", tatDays: 21, icon: "\u2696\uFE0F" },
];

export type PayerContactType =
  | "Primary Contact"
  | "Call Center"
  | "Escalation"
  | "Executive Escalation"
  | "Credentialing"
  | "Technical"
  | "Regional Contact"
  | "Delegation"
  | "Verification"
  | "Panel Exception";

export interface PayerContact {
  id: string;
  name: string;
  title: string;
  payerName: string;
  payerDetail: string;
  contactType: PayerContactType;
  states: string;
  rating: number;
  successRate: number;
  lastPositiveDaysAgo: number;
  lastPositiveBy: string;
}

export const CONTACT_TYPE_STYLES: Record<string, string> = {
  "Primary Contact": "bg-emerald-500/20 text-emerald-300",
  "Call Center": "bg-blue-500/20 text-blue-300",
  Escalation: "bg-rose-500/20 text-rose-300",
  "Executive Escalation": "bg-rose-500/20 text-rose-300",
  Credentialing: "bg-violet-500/20 text-violet-300",
  Technical: "bg-violet-500/20 text-violet-300",
  "Regional Contact": "bg-violet-500/20 text-violet-300",
  Delegation: "bg-violet-500/20 text-violet-300",
  Verification: "bg-violet-500/20 text-violet-300",
  "Panel Exception": "bg-violet-500/20 text-violet-300",
};

export const MOCK_PAYER_CONTACTS: PayerContact[] = [
  { id: "PC001", name: "Jennifer Martinez", title: "Provider Enrollment Specialist", payerName: "Medicare", payerDetail: "Novitas Solutions - JL", contactType: "Primary Contact", states: "PA", rating: 5, successRate: 94, lastPositiveDaysAgo: 443, lastPositiveBy: "Bhushan" },
  { id: "PC002", name: "Provider Enrollment Hotline", title: "Call Center", payerName: "Medicare", payerDetail: "Novitas Solutions - JL", contactType: "Call Center", states: "All", rating: 3, successRate: 68, lastPositiveDaysAgo: 447, lastPositiveBy: "Kajal" },
  { id: "PC003", name: "Robert Chen", title: "Supervisor - Enrollment Appeals", payerName: "Medicare", payerDetail: "Novitas Solutions - JL", contactType: "Escalation", states: "PA, NJ, DE", rating: 4, successRate: 82, lastPositiveDaysAgo: 447, lastPositiveBy: "Nicole" },
  { id: "PC004", name: "Amanda Wilson", title: "Provider Network Coordinator", payerName: "Highmark Blue Shield", payerDetail: "Highmark Blue Shield - Western PA", contactType: "Primary Contact", states: "PA (Western)", rating: 5, successRate: 96, lastPositiveDaysAgo: 441, lastPositiveBy: "Ritu" },
  { id: "PC005", name: "Michael Torres", title: "Credentialing Manager", payerName: "Highmark Blue Shield", payerDetail: "Highmark Blue Shield", contactType: "Credentialing", states: "PA, WV, DE", rating: 4, successRate: 88, lastPositiveDaysAgo: 450, lastPositiveBy: "Amanda" },
  { id: "PC006", name: "Provider Services Line", title: "Call Center", payerName: "Highmark Blue Shield", payerDetail: "Highmark Blue Shield", contactType: "Call Center", states: "All", rating: 3, successRate: 71, lastPositiveDaysAgo: 444, lastPositiveBy: "Juliane" },
  { id: "PC007", name: "Sarah Kim", title: "Director of Provider Networks", payerName: "Highmark Blue Shield", payerDetail: "Highmark Blue Shield", contactType: "Executive Escalation", states: "PA", rating: 5, successRate: 100, lastPositiveDaysAgo: 491, lastPositiveBy: "Ritu" },
  { id: "PC008", name: "David Park", title: "Provider Network Specialist", payerName: "Independence Blue Cross", payerDetail: "Independence Blue Cross", contactType: "Primary Contact", states: "PA (Southeast)", rating: 4, successRate: 85, lastPositiveDaysAgo: 442, lastPositiveBy: "David" },
  { id: "PC009", name: "NaviNet Support", title: "Technical Support", payerName: "Independence Blue Cross", payerDetail: "Independence Blue Cross", contactType: "Technical", states: "All", rating: 3, successRate: 78, lastPositiveDaysAgo: 453, lastPositiveBy: "Samarth" },
  { id: "PC010", name: "Aetna Provider Line", title: "National Call Center", payerName: "Aetna", payerDetail: "Aetna National", contactType: "Call Center", states: "National", rating: 3, successRate: 65, lastPositiveDaysAgo: 446, lastPositiveBy: "Masoom" },
  { id: "PC011", name: "Lisa Chen", title: "Regional Credentialing Lead", payerName: "Aetna", payerDetail: "Aetna - Northeast Region", contactType: "Regional Contact", states: "PA, NJ, NY", rating: 4, successRate: 89, lastPositiveDaysAgo: 450, lastPositiveBy: "Kajal" },
  { id: "PC012", name: "Delegation Team", title: "Delegation Operations", payerName: "UPMC Health Plan", payerDetail: "UPMC Health Plan", contactType: "Delegation", states: "PA", rating: 5, successRate: 97, lastPositiveDaysAgo: 440, lastPositiveBy: "Bhushan" },
  { id: "PC013", name: "Credentialing Verification", title: "Verification Unit", payerName: "UPMC Health Plan", payerDetail: "UPMC Health Plan", contactType: "Verification", states: "PA", rating: 4, successRate: 91, lastPositiveDaysAgo: 443, lastPositiveBy: "Amanda" },
  { id: "PC014", name: "UHC Provider Line", title: "National Call Center", payerName: "United Healthcare", payerDetail: "UnitedHealthcare", contactType: "Call Center", states: "National", rating: 2, successRate: 52, lastPositiveDaysAgo: 488, lastPositiveBy: "David" },
  { id: "PC015", name: "Panel Exception Request", title: "Network Adequacy", payerName: "United Healthcare", payerDetail: "UnitedHealthcare - PA", contactType: "Panel Exception", states: "PA", rating: 3, successRate: 35, lastPositiveDaysAgo: 521, lastPositiveBy: "Nicole" },
  { id: "PC016", name: "Provider Enrollment Unit", title: "Enrollment Team", payerName: "AmeriHealth Caritas PA", payerDetail: "AmeriHealth Caritas PA", contactType: "Primary Contact", states: "PA", rating: 4, successRate: 83, lastPositiveDaysAgo: 444, lastPositiveBy: "Juliane" },
];

export interface KBEntry extends PayerContact {
  phone: string;
  email: string;
  notes: string;
  tags: string[];
  responseTime: string;
}

export const CONTACT_TYPE_CARD_STYLES: Record<
  string,
  { gradient: string; hover: string }
> = {
  "Primary Contact": { gradient: "from-emerald-500 to-emerald-600", hover: "hover:border-emerald-500/30" },
  "Call Center": { gradient: "from-blue-500 to-blue-600", hover: "hover:border-blue-500/30" },
  Escalation: { gradient: "from-rose-500 to-rose-600", hover: "hover:border-rose-500/30" },
  "Executive Escalation": { gradient: "from-rose-500 to-rose-600", hover: "hover:border-rose-500/30" },
  Credentialing: { gradient: "from-violet-500 to-violet-600", hover: "hover:border-violet-500/30" },
  Technical: { gradient: "from-violet-500 to-violet-600", hover: "hover:border-violet-500/30" },
  "Regional Contact": { gradient: "from-violet-500 to-violet-600", hover: "hover:border-violet-500/30" },
  Delegation: { gradient: "from-violet-500 to-violet-600", hover: "hover:border-violet-500/30" },
  Verification: { gradient: "from-violet-500 to-violet-600", hover: "hover:border-violet-500/30" },
  "Panel Exception": { gradient: "from-violet-500 to-violet-600", hover: "hover:border-violet-500/30" },
};

export const MOCK_KB_ENTRIES: KBEntry[] = [
  { id: "PC001", name: "Jennifer Martinez", title: "Provider Enrollment Specialist", payerName: "Medicare", payerDetail: "Novitas Solutions - JL", contactType: "Primary Contact", states: "PA", rating: 5, successRate: 94, lastPositiveDaysAgo: 443, lastPositiveBy: "Bhushan", phone: "(855) 252-8782 x4521", email: "jennifer.martinez@novitas-solutions.com", notes: "Very helpful, knows PA region well. Ask for her directly for complex cases.", tags: ["#enrollment", "#revalidation", "#appeals"], responseTime: "24 hrs" },
  { id: "PC002", name: "Provider Enrollment Hotline", title: "Call Center", payerName: "Medicare", payerDetail: "Novitas Solutions - JL", contactType: "Call Center", states: "All", rating: 3, successRate: 68, lastPositiveDaysAgo: 447, lastPositiveBy: "Kajal", phone: "(855) 252-8782", email: "provider.enrollment@novitas-solutions.com", notes: "Long hold times. Use IVR option 2 then 1 for enrollment. Have PTAN ready.", tags: ["#general", "#status"], responseTime: "48-72 hrs" },
  { id: "PC003", name: "Robert Chen", title: "Supervisor - Enrollment Appeals", payerName: "Medicare", payerDetail: "Novitas Solutions - JL", contactType: "Escalation", states: "PA, NJ, DE", rating: 4, successRate: 82, lastPositiveDaysAgo: 447, lastPositiveBy: "Nicole", phone: "(855) 252-8782 x6789", email: "robert.chen@novitas-solutions.com", notes: "Good for stuck applications. Requires case number and timeline documentation.", tags: ["#escalation", "#appeals", "#stuck-cases"], responseTime: "3-5 days" },
  { id: "PC004", name: "Amanda Wilson", title: "Provider Network Coordinator", payerName: "Highmark Blue Shield", payerDetail: "Highmark Blue Shield - Western PA", contactType: "Primary Contact", states: "PA (Western)", rating: 5, successRate: 96, lastPositiveDaysAgo: 441, lastPositiveBy: "Ritu", phone: "(800) 451-2121 x3345", email: "amanda.wilson@highmark.com", notes: "Our main contact for Keystone Medical delegation. Very responsive to emails.", tags: ["#delegation", "#roster", "#contracts"], responseTime: "24 hrs" },
  { id: "PC005", name: "Michael Torres", title: "Credentialing Manager", payerName: "Highmark Blue Shield", payerDetail: "Highmark Blue Shield", contactType: "Credentialing", states: "PA, WV, DE", rating: 4, successRate: 88, lastPositiveDaysAgo: 450, lastPositiveBy: "Amanda", phone: "(800) 451-2121 x4421", email: "michael.torres@highmark.com", notes: "Handles non-delegated credentialing. Prefers portal submissions with email follow-up.", tags: ["#credentialing", "#initial", "#recred"], responseTime: "2-3 days" },
  { id: "PC006", name: "Provider Services Line", title: "Call Center", payerName: "Highmark Blue Shield", payerDetail: "Highmark Blue Shield", contactType: "Call Center", states: "All", rating: 3, successRate: 71, lastPositiveDaysAgo: 444, lastPositiveBy: "Juliane", phone: "(800) 451-2121", email: "providerrelations@highmark.com", notes: "Press 3 for credentialing, then 2 for status. Average wait 15-20 min.", tags: ["#general", "#status", "#eligibility"], responseTime: "Immediate" },
  { id: "PC007", name: "Sarah Kim", title: "Director of Provider Networks", payerName: "Highmark Blue Shield", payerDetail: "Highmark Blue Shield", contactType: "Executive Escalation", states: "PA", rating: 5, successRate: 100, lastPositiveDaysAgo: 491, lastPositiveBy: "Ritu", phone: "(412) 555-8900", email: "sarah.kim@highmark.com", notes: "Executive escalation only. Use for contract issues or repeated failures. Contact Amanda first.", tags: ["#escalation", "#executive", "#contracts"], responseTime: "1-2 days" },
  { id: "PC008", name: "David Park", title: "Provider Network Specialist", payerName: "Independence Blue Cross", payerDetail: "Independence Blue Cross", contactType: "Primary Contact", states: "PA (Southeast)", rating: 4, successRate: 85, lastPositiveDaysAgo: 442, lastPositiveBy: "David", phone: "(215) 555-4200", email: "david.park@ibx.com", notes: "Good for Philadelphia region questions. Knows NaviNet well.", tags: ["#enrollment", "#navinet", "#networks"], responseTime: "24-48 hrs" },
  { id: "PC009", name: "NaviNet Support", title: "Technical Support", payerName: "Independence Blue Cross", payerDetail: "Independence Blue Cross", contactType: "Technical", states: "All", rating: 3, successRate: 78, lastPositiveDaysAgo: 453, lastPositiveBy: "Samarth", phone: "(800) 275-2583 x5", email: "navinet.support@ibx.com", notes: "For portal access issues, password resets, and submission errors.", tags: ["#technical", "#portal", "#navinet"], responseTime: "24 hrs" },
  { id: "PC010", name: "Aetna Provider Line", title: "National Call Center", payerName: "Aetna", payerDetail: "Aetna National", contactType: "Call Center", states: "National", rating: 3, successRate: 65, lastPositiveDaysAgo: 446, lastPositiveBy: "Masoom", phone: "(800) 624-0756", email: "providerservices@aetna.com", notes: "Option 4 for credentialing status. Have TIN and NPI ready. Long waits midday.", tags: ["#status", "#general"], responseTime: "Immediate" },
  { id: "PC011", name: "Lisa Chen", title: "Regional Credentialing Lead", payerName: "Aetna", payerDetail: "Aetna - Northeast Region", contactType: "Regional Contact", states: "PA, NJ, NY", rating: 4, successRate: 89, lastPositiveDaysAgo: 450, lastPositiveBy: "Kajal", phone: "(800) 624-0756 x78234", email: "lisa.chen2@aetna.com", notes: "Very thorough. Send complete applications to avoid delays. Responds well to email.", tags: ["#credentialing", "#regional", "#northeast"], responseTime: "2-3 days" },
  { id: "PC012", name: "Delegation Team", title: "Delegation Operations", payerName: "UPMC Health Plan", payerDetail: "UPMC Health Plan", contactType: "Delegation", states: "PA", rating: 5, successRate: 97, lastPositiveDaysAgo: 440, lastPositiveBy: "Bhushan", phone: "(866) 918-1996 x2", email: "delegation@upmc.edu", notes: "Excellent delegation support. Use secure portal for roster submissions.", tags: ["#delegation", "#roster", "#monthly"], responseTime: "24 hrs" },
  { id: "PC013", name: "Credentialing Verification", title: "Verification Unit", payerName: "UPMC Health Plan", payerDetail: "UPMC Health Plan", contactType: "Verification", states: "PA", rating: 4, successRate: 91, lastPositiveDaysAgo: 443, lastPositiveBy: "Amanda", phone: "(866) 918-1996 x3", email: "credentialing@upmc.edu", notes: "Quick PSV turnaround. Accept CAQH data directly.", tags: ["#psv", "#verification", "#caqh"], responseTime: "48 hrs" },
  { id: "PC014", name: "UHC Provider Line", title: "National Call Center", payerName: "United Healthcare", payerDetail: "UnitedHealthcare", contactType: "Call Center", states: "National", rating: 2, successRate: 52, lastPositiveDaysAgo: 488, lastPositiveBy: "David", phone: "(877) 842-3210", email: "provider_services@uhc.com", notes: "Very long hold times. Panel currently CLOSED for most specialties. Use online portal when possible.", tags: ["#status", "#closed-panel"], responseTime: "Immediate" },
  { id: "PC015", name: "Panel Exception Request", title: "Network Adequacy", payerName: "United Healthcare", payerDetail: "UnitedHealthcare - PA", contactType: "Panel Exception", states: "PA", rating: 3, successRate: 35, lastPositiveDaysAgo: 521, lastPositiveBy: "Nicole", phone: "(877) 842-3210 x9", email: "network.adequacy@uhc.com", notes: "For panel exception requests only. Requires detailed justification and member access data.", tags: ["#panel-exception", "#network-adequacy"], responseTime: "5-7 days" },
  { id: "PC016", name: "Provider Enrollment Unit", title: "Enrollment Team", payerName: "AmeriHealth Caritas PA", payerDetail: "AmeriHealth Caritas PA", contactType: "Primary Contact", states: "PA", rating: 4, successRate: 83, lastPositiveDaysAgo: 444, lastPositiveBy: "Juliane", phone: "(800) 521-6007 x2", email: "pa.enrollment@amerihealthcaritas.com", notes: "Medicaid MCO enrollment. Requires active PA Medicaid ID first.", tags: ["#medicaid", "#mco", "#enrollment"], responseTime: "48 hrs" },
];

// ─── API Types ────────────────────────────────────────────────────────────────

/** A single enrollment step returned by the detail endpoint */
export interface EnrollmentStep {
  id: string;
  stepNo: number;
  stepName: string;
  estDuration: string;
  description: string;
  isRequired: boolean;
  isActive: boolean;
  tip: string;
}

/** A required document entry returned by the detail endpoint */
export interface RequiredDocument {
  id: string;
  name: string;
  description: string;
  type: string;
  formatRequired: string;
  isRequired: boolean;
}

/** A common issue entry returned by the detail endpoint */
export interface CommonIssue {
  id: string;
  title: string;
  description: string;
}

/** A portal tip entry returned by the detail endpoint */
export interface PortalTip {
  id: string;
  tipText: string;
  tipOrder: number;
  isActive: boolean;
}

/** Full payer detail shape returned by GET /payers/:id */
export interface PayerDetail {
  id: string;
  name: string;
  displayName: string | null;
  shortName: string | null;
  abbreviation: string | null;
  type: string | null;
  parent: string | null;
  subCategory: string | null;
  submissionMethod: string | null;
  tatDays: number | null;
  totalProcessingTime: string | null;
  isDelegated: boolean;
  /** true = Open, false = Closed */
  panelStatus: boolean;
  portalName: string | null;
  portalUrl: string | null;
  portalLoginType: string | null;
  portalBestBrowser: string | null;
  primaryPhone: string | null;
  primaryEmail: string | null;
  recredentialingCycle: string | null;
  recredentialingProcess: string | null;
  isActive: boolean;
  states: Array<{ id: string; name: string; code: string }>;
  enrollmentSteps: EnrollmentStep[];
  requiredDocuments: RequiredDocument[];
  commonIssues: CommonIssue[];
  portalTips: PortalTip[];
  createdAt: string;
  updatedAt: string;
}

/** API response shape for a payer list item */
export interface PayerListItem {
  id: string;
  name: string;
  displayName: string | null;
  shortName: string | null;
  abbreviation: string | null;
  type: string | null;
  subCategory: string | null;
  tatDays: number | null;
  isDelegated: boolean;
  /** true = Open, false = Closed */
  panelStatus: boolean;
  states: Array<{ id: string; name: string; code: string }>;
}

/** Request params for GET /payers */
export interface PayerRequest {
  page?: number;
  limit?: number;
  /** Searches across name, shortName, and abbreviation */
  search?: string;
  type?: string;
  parent?: string;
  subCategory?: string;
  isDelegated?: boolean;
  /** true = Open, false = Closed */
  panelStatus?: boolean;
  isActive?: boolean;
  approvalStatus?: string;
  tab?: string;
  stateIds?: string[];
  /** Prefix with - for descending. Allowed: name, createdAt, tatDays */
  sort?: string;
}

/** Enrollment step for create/update payload */
export interface EnrollmentStepPayload {
  stepNo: number;
  stepName: string;
  estDuration: string;
  description: string;
  isRequired: boolean;
  isActive: boolean;
  tip: string;
}

/** Required document for create/update payload */
export interface RequiredDocumentPayload {
  name: string;
  description: string;
  type: string;
  formatRequired: string;
  isRequired: boolean;
}

/** Common issue for create/update payload */
export interface CommonIssuePayload {
  title: string;
  description: string;
}

/** Portal tip for create/update payload */
export interface PortalTipPayload {
  tipText: string;
  tipOrder: number;
  isActive: boolean;
}

/** Request payload for POST /payers */
export interface CreatePayerRequest {
  name: string;
  displayName?: string;
  shortName?: string;
  abbreviation?: string;
  type?: string;
  parent?: string;
  subCategory?: string;
  submissionMethod?: string;
  tatDays?: number;
  totalProcessingTime?: string;
  isDelegated?: boolean;
  /** true = Open, false = Closed */
  panelStatus?: boolean;
  portalName?: string;
  portalUrl?: string;
  portalLoginType?: string;
  portalBestBrowser?: string;
  primaryPhone?: string;
  primaryEmail?: string;
  recredentialingCycle?: string;
  recredentialingProcess?: string;
  isActive?: boolean;
  stateIds?: string[];
  enrollmentSteps?: EnrollmentStepPayload[];
  requiredDocuments?: RequiredDocumentPayload[];
  commonIssues?: CommonIssuePayload[];
  portalTips?: PortalTipPayload[];
}

/** Request payload for PATCH /payers/:id */
export type UpdatePayerRequest = Partial<CreatePayerRequest>;

/** Request payload for PUT /payers/:payerId/contacts/:id */
export type UpdatePayerContactRequest = Partial<CreatePayerContactRequest>;
