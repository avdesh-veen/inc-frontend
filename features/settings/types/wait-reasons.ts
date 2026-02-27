export type WaitCategory = "External" | "Internal";

export interface WaitReason {
  id: string;
  code: string;
  label: string;
  description: string;
  category: WaitCategory;
  pausesSLA: boolean;
  warningDays: number;
  criticalDays: number;
  autoChaseDays: number;
  status: "Active" | "Inactive";
  createdAt: Date;
  updatedAt: Date;
}
