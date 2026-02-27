"use client";

import * as React from "react";
import { SLATargetsSection } from "./sla-targets-section";
import { SLAOverrideSection } from "./sla-override-section";
import { EscalationRulesSection } from "./escalation-rules-section";
import { FPRMetricsSection } from "./fpr-metrics-section";
import {
  useSLATargets,
  useSLAOverrides,
  useEscalationRules,
  useFPRMetrics,
} from "@/features/settings/hooks/use-sla-rules";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export function SLARulesContent() {
  const [targetsPage, setTargetsPage] = React.useState(DEFAULT_PAGE);
  const [overridesPage, setOverridesPage] = React.useState(DEFAULT_PAGE);
  const [limit] = React.useState(DEFAULT_LIMIT);

  const {
    data: targetsResponse,
    isFetching: targetsFetching,
    isPending: targetsPending,
  } = useSLATargets({ page: targetsPage, limit });

  const {
    data: overridesResponse,
    isFetching: overridesFetching,
    isPending: overridesPending,
  } = useSLAOverrides({ page: overridesPage, limit });

  const { data: rules, isLoading: rulesLoading } = useEscalationRules();
  const { data: metrics, isLoading: metricsLoading } = useFPRMetrics();
  const targets = targetsResponse?.data?.items ?? [];
  const targetsMeta = targetsResponse?.data?.meta;
  const targetsLoading = targetsFetching || targetsPending;

  const overrides = overridesResponse?.data?.items ?? [];
  const overridesMeta = overridesResponse?.data?.meta;
  const overridesLoading = overridesFetching || overridesPending;
  return (
    <div className="space-y-6">
      {/* Section 1: SLA Targets by Request Type */}
      <SLATargetsSection
        targets={targets}
        isLoading={targetsLoading}
        meta={targetsMeta}
        onPageChange={setTargetsPage}
      />

      {/* Section 2: SLA Override Configuration */}
      <SLAOverrideSection
        overrides={overrides}
        isLoading={overridesLoading}
        meta={overridesMeta}
        onPageChange={setOverridesPage}
      />

      {/* Section 3: Escalation Rules */}
      <EscalationRulesSection rules={rules || []} isLoading={rulesLoading} />

      {/* Section 4: First Pass Rate Metrics */}
      <FPRMetricsSection metrics={metrics} isLoading={metricsLoading} />
    </div>
  );
}
