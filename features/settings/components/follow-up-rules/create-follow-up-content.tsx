'use client'

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  useCreateFollowUpRule,
  useUpdateFollowUpRule,
  useFollowUpRule,
  useFollowUpRulesTriggerEventsOptions,
} from "@/features/settings/hooks/use-follow-up-rules";
import { createFollowUpRuleFormSchema } from "@/features/settings/validations/create-follow-up-rule-schema";
import {
  defaultChaseTouch,
  type ChaseTouch,
  type CreateFollowUpRulePayerOverridePayload,
} from "@/features/settings/types";
import { buildCreateFollowUpRulePayload, mapPayloadToFormState } from "./utils";
import {
  ALL_WORK_CATEGORIES_ID,
  AutoCloseSection,
  ChaseSequenceSection,
  EscalationSection,
  NotificationsSection,
  PayerOverridesSection,
  RuleIdentitySection,
  TaskDefaultsSection,
  TriggerEventSection,
} from "./components";

const LIST_PATH = "/settings/workflow/follow-up-rules";
const emptySubscribe = () => () => {};

export interface CreateFollowUpRulePageProps {
  ruleId?: string;
}

export function CreateFollowUpRulePage({
  ruleId,
}: Readonly<CreateFollowUpRulePageProps>) {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const router = useRouter();
  const { toast } = useToast();
  const createMutation = useCreateFollowUpRule();
  const updateMutation = useUpdateFollowUpRule();
  const { data: ruleData, isLoading: isLoadingRule } = useFollowUpRule(
    ruleId ?? null,
  );
  const prefillDone = useRef(false);

  const isEdit = !!ruleId;
  const isPending = isEdit
    ? updateMutation.isPending
    : createMutation.isPending;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [active, setActive] = useState(true);
  const [triggerEvent, setTriggerEvent] = useState("");
  const [payerType, setPayerType] = useState("all");
  const [state, setState] = useState("all");
  const [touches, setTouches] = useState<ChaseTouch[]>([defaultChaseTouch()]);
  const [taskType, setTaskType] = useState("follow_up");
  const [estMins, setEstMins] = useState(10);
  const [escalationEnabled, setEscalationEnabled] = useState(false);
  const [escalateAfter, setEscalateAfter] = useState("3");
  const [escalateTo, setEscalateTo] = useState("team_lead");
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [autoCloseEnabled, setAutoCloseEnabled] = useState(false);
  const [autoCloseDays, setAutoCloseDays] = useState(45);
  const [maxAttempts, setMaxAttempts] = useState(5);
  const [payerOverrides, setPayerOverrides] = useState<
    CreateFollowUpRulePayerOverridePayload[]
  >([]);
  const [notifyOnCreate, setNotifyOnCreate] = useState(true);
  const [notifyOnEscalation, setNotifyOnEscalation] = useState(true);
  const [notifyClient, setNotifyClient] = useState(false);

  const { options: triggerEvents } = useFollowUpRulesTriggerEventsOptions();
  const triggerEventName =
    triggerEvent && triggerEvents.length > 0
      ? (triggerEvents.find((e) => e.id === triggerEvent)?.name ?? "")
      : "";

  useEffect(() => {
    prefillDone.current = false;
  }, [ruleId]);

  useEffect(() => {
    if (!ruleId || !ruleData?.data || prefillDone.current) return;
    prefillDone.current = true;
    const form = mapPayloadToFormState(ruleData.data);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- prefill from fetched rule (external source)
    setName(form.name);
    setDescription(form.description);
    setSelectedCategoryIds(form.categories);
    setActive(form.active);
    setTriggerEvent(form.triggerEvent);
    setPayerType(form.payerType);
    setState(form.state);
    setTouches(form.touches.length > 0 ? form.touches : [defaultChaseTouch()]);
    setTaskType(form.taskType);
    setEstMins(form.estMins);
    setEscalationEnabled(form.escalationEnabled);
    setEscalateAfter(form.escalateAfter);
    setEscalateTo(form.escalateTo);
    setRequiresApproval(form.requiresApproval);
    setAutoCloseEnabled(form.autoCloseEnabled);
    setAutoCloseDays(form.autoCloseDays);
    setMaxAttempts(form.maxAttempts);
    setPayerOverrides(form.payerOverrides);
    setNotifyOnCreate(form.notifyOnCreate);
    setNotifyOnEscalation(form.notifyOnEscalation);
    setNotifyClient(form.notifyClient);
  }, [ruleId, ruleData?.data]);

  useEffect(() => {
    if (!triggerEventName) return;
    const defaultTaskName = `Follow up on ${triggerEventName}`;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync from trigger name (external source)
    setTouches((prev) =>
      prev.map((t) => {
        const isEmpty = t.taskName === "";
        const isAutoFilled = t.taskName.startsWith("Follow up on ");
        return isEmpty || isAutoFilled
          ? { ...t, taskName: defaultTaskName }
          : t;
      }),
    );
  }, [triggerEventName]);

  const toggleCategory = (id: string, allIds?: string[]) => {
    if (id === ALL_WORK_CATEGORIES_ID && allIds) {
      setSelectedCategoryIds((c) =>
        c.length === allIds.length ? [] : [...allIds],
      );
      return;
    }
    setSelectedCategoryIds((c) =>
      c.includes(id) ? c.filter((x) => x !== id) : [...c, id],
    );
  };

  const addTouch = () => setTouches((t) => [...t, defaultChaseTouch()]);
  const removeTouch = (idx: number) =>
    setTouches((t) => t.filter((_, i) => i !== idx));
  const updateTouch = (
    idx: number,
    field: keyof ChaseTouch,
    value: string | number,
  ) => {
    setTouches((t) =>
      t.map((x, i) => (i === idx ? { ...x, [field]: value } : x)),
    );
  };

  const handleSubmit = async () => {
    const formState = {
      name: name.trim(),
      description,
      categories: selectedCategoryIds,
      active,
      triggerEvent,
      payerType,
      state,
      touches,
      taskType,
      estMins,
      escalationEnabled,
      escalateAfter,
      escalateTo,
      requiresApproval,
      autoCloseEnabled,
      autoCloseDays,
      maxAttempts,
      payerOverrides,
      notifyOnCreate,
      notifyOnEscalation,
      notifyClient,
    };

    const result = createFollowUpRuleFormSchema.safeParse(formState);
    if (!result.success) {
      const firstError = result.error.issues[0];
      const message = firstError?.message ?? "Please fix the form errors.";
      toast({ variant: "destructive", title: message });
      return;
    }

    const payload = buildCreateFollowUpRulePayload(formState);

    try {
      if (isEdit && ruleId) {
        await updateMutation.mutateAsync({ id: ruleId, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      router.push(LIST_PATH);
    } catch {
      // Error toast is handled by the mutation hook's onError callback
    }
  };

  if (!mounted || (isEdit && isLoadingRule)) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <CardContent className="p-0">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push(LIST_PATH)}
                variant="ghost"
                size="icon"
                className="rounded-lg"
                asChild
              >
                <Link href={LIST_PATH} title="Back to list">
                  <svg
                    className="size-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                </Link>
              </Button>
              <div>
                <h2 className="text-lg font-bold">
                  {isEdit ? "Update Follow-Up Rule" : "Create Follow-Up Rule"}
                </h2>
                <p className="text-xs text-white/50 mt-0.5">
                  Configure automated chase sequences and escalation workflows
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="muted" asChild>
                <Link href={LIST_PATH}>Cancel</Link>
              </Button>
              <Button
                type="button"
                variant="tertiaryMuted"
                size="xl"
                disabled={isPending}
                onClick={handleSubmit}
              >
                <svg
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {isEdit ? "Update Rule" : "Create Rule"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-5">
              <RuleIdentitySection
                name={name}
                onNameChange={setName}
                description={description}
                onDescriptionChange={setDescription}
                selectedCategoryIds={selectedCategoryIds}
                onToggleCategory={toggleCategory}
                active={active}
                onActiveChange={setActive}
              />
              <TriggerEventSection
                triggerEvent={triggerEvent}
                onTriggerEventChange={setTriggerEvent}
                payerType={payerType}
                onPayerTypeChange={setPayerType}
                state={state}
                onStateChange={setState}
              />
            </div>

            <div className="space-y-5">
              <ChaseSequenceSection
                touches={touches}
                onAddTouch={addTouch}
                onRemoveTouch={removeTouch}
                onUpdateTouch={updateTouch}
                triggerEventName={triggerEventName}
              />
              <TaskDefaultsSection
                taskType={taskType}
                onTaskTypeChange={setTaskType}
                estMins={estMins}
                onEstMinsChange={setEstMins}
              />
            </div>

            <div className="space-y-5">
              <EscalationSection
                escalationEnabled={escalationEnabled}
                onEscalationEnabledChange={setEscalationEnabled}
                escalateAfter={escalateAfter}
                onEscalateAfterChange={setEscalateAfter}
                escalateTo={escalateTo}
                onEscalateToChange={setEscalateTo}
                requiresApproval={requiresApproval}
                onRequiresApprovalChange={setRequiresApproval}
              />
              <AutoCloseSection
                autoCloseEnabled={autoCloseEnabled}
                onAutoCloseEnabledChange={setAutoCloseEnabled}
                autoCloseDays={autoCloseDays}
                onAutoCloseDaysChange={setAutoCloseDays}
                maxAttempts={maxAttempts}
                onMaxAttemptsChange={setMaxAttempts}
              />
              <PayerOverridesSection
                overrides={payerOverrides}
                onAddOverride={(o) => setPayerOverrides((prev) => [...prev, o])}
                onRemoveOverride={(index) =>
                  setPayerOverrides((prev) =>
                    prev.filter((_, i) => i !== index),
                  )
                }
              />
              <NotificationsSection
                notifyOnCreate={notifyOnCreate}
                onNotifyOnCreateChange={setNotifyOnCreate}
                notifyOnEscalation={notifyOnEscalation}
                onNotifyOnEscalationChange={setNotifyOnEscalation}
                notifyClient={notifyClient}
                onNotifyClientChange={setNotifyClient}
              />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Fields marked with * are required
            </p>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.push(LIST_PATH)}
                variant="outline"
                size="sm"
                className="rounded-xl"
                asChild={true}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={isPending}
                onClick={handleSubmit}
              >
                <svg
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {isEdit ? "Update Rule" : "Create Rule"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
