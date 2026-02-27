export interface DecisionTable {
  id: string;
  payerType: string;
  estRevenue: string;
  complexity: string;
  analystTier: string;
  clientTier: string;
  approvalPath: string;
  slaHours: number;
  autoApprove: boolean;
  order: number;
  isActive: boolean;
}

export interface DecisionTableRequest {
  page?: number;
  limit?: number;
}