import {
  defaultChaseTouch,
  type ChaseTouch,
  type CreateFollowUpRulePayload,
  type CreateFollowUpRulePayerOverridePayload,
  type FollowUpRule,
  type FollowUpRuleApiItem,
  type FollowUpRuleDetail,
  type FollowUpRulesStats,
  type FollowUpRulePriority,
} from "@/features/settings/types";

/** Map backend list item to display shape; id, name, and all categories (name/code) from response. */
export function mapFollowUpRuleFromApi(item: FollowUpRuleApiItem): FollowUpRule {
  const category: FollowUpRule["category"] =
    item.workCategories
      ?.map((wc) => wc.workCategory)
      .filter((c): c is { name: string; code?: string } => c != null)
      .map((c) => ({ name: c.name, code: c.code })) ?? [];
  const firstTouch = item.chaseTouches?.[0];
  return {
    id: item.id,
    name: item.name,
    category: category.length > 0 ? category : [{ name: "All" }],
    triggerEvent: item.triggerEvent?.name ?? "",
    days: firstTouch != null ? String(firstTouch.daysOffset) : "—",
    priority: (firstTouch?.priority as FollowUpRulePriority) ?? "medium",
    escalateTo: item.escalateTo ?? null,
    active: item.isActive,
  };
}

/**
 * Derives summary stats from a list of follow-up rules.
 * Used for the stats cards (total rules, active, categories, avg chase time).
 *
 * @param items - Current page of follow-up rules
 * @param totalItems - Total count from API (for pagination); falls back to items.length
 */
export function deriveFollowUpRulesStats(
  items: FollowUpRule[],
  totalItems?: number,
): FollowUpRulesStats {
  const dayValues = items
    .map((r) => parseInt(r.days?.replace(/\D/g, "") ?? "0", 10))
    .filter((n) => !Number.isNaN(n));
  const avgChaseTimeDays =
    dayValues.length > 0
      ? Math.round(
          dayValues.reduce((a, b) => a + b, 0) / dayValues.length,
        )
      : 0;

  const categoryNames = items.flatMap((r) => r.category.map((c) => c.name));
  return {
    totalRules: totalItems ?? items.length,
    active: items.filter((r) => r.active).length,
    categories: new Set(categoryNames).size,
    avgChaseTimeDays,
  };
}

/** Convert form assignTo value to API assignmentTarget (camelCase). */
function toAssignmentTarget(assignTo: string): string {
  return assignTo.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

/** Map API payload (from GET detail) to form state. Prefills work categories, trigger event, escalation, auto-close when available. */
export function mapPayloadToFormState(
  payload: FollowUpRuleDetail,
): CreateFollowUpRuleFormState {
  const workCategoryIds =
    payload.workCategoryIds ??
    payload.workCategories
      ?.map((wc) => wc.workCategory?.id)
      .filter((id): id is string => !!id) ??
    [];
  return {
    name: payload.name ?? "",
    description: payload.description ?? "",
    categories: workCategoryIds,
    active: payload.isActive ?? true,
    triggerEvent: payload.triggerEventId ?? "",
    payerType: payload.filterByPayerType ?? "all",
    state: payload.stateId ?? "all",
    touches:
      payload.chaseTouches?.map((ct) => ({
        daysAfterTrigger: ct.daysOffset,
        channel: ct.channel ?? "email",
        priority: ct.priority ?? "medium",
        assignTo: toAssignTo(ct.assignmentTarget ?? "case_owner"),
        taskName: ct.taskName ?? "",
      })) ?? [defaultChaseTouch()],
    taskType: payload.taskType ? camelToSnake(payload.taskType) : "follow_up",
    estMins: payload.taskEstMinutes ?? 10,
    escalationEnabled: payload.autoEscalation ?? false,
    escalateAfter: payload.escalateAfter != null ? String(payload.escalateAfter) : "3",
    escalateTo: payload.escalateTo ? (ESCALATE_TO_FORM_MAP[payload.escalateTo] ?? "team_lead") : "team_lead",
    requiresApproval: payload.requiresApprovalToClose ?? false,
    autoCloseEnabled: payload.autoCloseOnNoResponse ?? false,
    autoCloseDays: payload.autoCloseDays ?? 45,
    maxAttempts: payload.autoCloseAfterMaxAttempts ?? 5,
    payerOverrides: payload.payerOverrides ?? [],
    notifyOnCreate: payload.taskCreationNotification ?? true,
    notifyOnEscalation: payload.escalationNotification ?? true,
    notifyClient: payload.clientContactNotification ?? false,
  };
}

/** Convert form taskType (snake_case) to API (camelCase). */
function toTaskType(taskType: string): string {
  return taskType.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

/** API expects: teamLead | manager | client | operationManager */
const ESCALATE_TO_API_MAP: Record<string, string> = {
  team_lead: "teamLead",
  team_manager: "manager",
  client_contact: "client",
  operations_manager: "operationManager",
};
const ESCALATE_TO_FORM_MAP: Record<string, string> = {
  teamLead: "team_lead",
  manager: "team_manager",
  client: "client_contact",
  operationManager: "operations_manager",
};

function toEscalateTo(escalateTo: string): string {
  return ESCALATE_TO_API_MAP[escalateTo] ?? "teamLead";
}

/** CamelCase to snake_case (used for assignmentTarget and taskType from API). */
function camelToSnake(s: string): string {
  return s.replace(/([A-Z])/g, (_, c) => `_${c.toLowerCase()}`);
}
function toAssignTo(assignmentTarget: string): string {
  return camelToSnake(assignmentTarget);
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function toStateId(state: string): string | null {
  if (!state || state === "all") return null;
  return UUID_REGEX.test(state) ? state : null;
}

export interface CreateFollowUpRuleFormState {
  name: string;
  description: string;
  categories: string[];
  active: boolean;
  triggerEvent: string;
  payerType: string;
  state: string;
  touches: ChaseTouch[];
  taskType: string;
  estMins: number;
  escalationEnabled: boolean;
  escalateAfter: string;
  escalateTo: string;
  requiresApproval: boolean;
  autoCloseEnabled: boolean;
  autoCloseDays: number;
  maxAttempts: number;
  payerOverrides: CreateFollowUpRulePayerOverridePayload[];
  notifyOnCreate: boolean;
  notifyOnEscalation: boolean;
  notifyClient: boolean;
}

/**
 * Build API create payload from create form state.
 * Maps form field names and snake_case values to backend camelCase.
 */
export function buildCreateFollowUpRulePayload(
  state: CreateFollowUpRuleFormState,
): CreateFollowUpRulePayload {
  const workCategoryIds = state.categories;

  return {
    name: state.name,
    description: state.description,
    triggerEventId: state.triggerEvent,
    isActive: state.active,
    autoEscalation: state.escalationEnabled,
    escalateAfter: parseInt(state.escalateAfter, 10) || 3,
    escalateTo: toEscalateTo(state.escalateTo),
    requiresApprovalToClose: state.requiresApproval,
    autoCloseOnNoResponse: state.autoCloseEnabled,
    autoCloseDays: state.autoCloseDays,
    autoCloseAfterMaxAttempts: state.maxAttempts,
    filterByPayerType: state.payerType,
    stateId: toStateId(state.state),
    taskType: toTaskType(state.taskType),
    taskEstMinutes: state.estMins,
    taskNameVar: "providerName",
    taskCreationNotification: state.notifyOnCreate,
    escalationNotification: state.notifyOnEscalation,
    clientContactNotification: state.notifyClient,
    workCategoryIds,
    payerOverrides: state.payerOverrides,
    chaseTouches: state.touches.map((t, idx) => ({
      daysOffset: t.daysAfterTrigger,
      channel: t.channel,
      touchNumber: idx + 1,
      priority: t.priority,
      assignmentTarget: toAssignmentTarget(t.assignTo),
      taskName: t.taskName,
    })),
  };
}
