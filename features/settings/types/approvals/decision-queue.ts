export interface DecisionQueue {
  id: string;
  enableDecisionQueue: boolean;
  businessHoursStart: string;
  businessHoursEnd: string;
  autoEscalateAfterSlaBreachHours: number;
  maxReturnsBeforeEscalation: number;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
}

export interface DefaultRouting {
  id: string;
  type: string;
  destination?: string;
  approver: string;
  escalation: string;
  sla: number;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}