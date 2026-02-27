export const ENTITY_TYPES = [
  { value: "physician_group", label: "Physician Group" },
  { value: "hospital", label: "Hospital" },
  { value: "clinic", label: "Clinic" },
  { value: "urgent_care", label: "Urgent Care" },
  { value: "surgery_center", label: "Surgery Center" },
  { value: "professional_corporation", label: "Professional Corporation" },
] as const;

export const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "inactive", label: "Inactive" },
] as const;

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC",
] as const;

export type ClientOption = { id: string; name: string };
export type LabelValueOption = { value: string; label: string };

export function findOptionById<T extends { id: string }>(
  options: T[],
  value: string | undefined,
): T | null {
  if (!value) return null;
  return options.find((opt) => opt.id === value) ?? null;
}

export function findOptionByValue<T extends { value: string; label: string }>(
  options: readonly T[],
  value: string | undefined,
): T | null {
  if (!value) return null;
  return options.find((opt) => opt.value === value) ?? null;
}

export const STATE_OPTIONS: LabelValueOption[] = US_STATES.map((s) => ({
  value: s,
  label: s,
}));
