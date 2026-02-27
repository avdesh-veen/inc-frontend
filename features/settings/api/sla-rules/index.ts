/**
 * SLA Rules API Module
 * 
 * Central export point for all SLA rules API functions.
 * Hooks should be imported from @/features/settings/hooks/use-sla-rules
 */

// Re-export client API functions
export {
  getSLATargetsClient,
  getSLAOverridesClient,
  getEscalationRulesClient,
  getFPRMetricsClient,
  createSLATargetClient,
  updateSLATargetClient,
  deleteSLATargetClient,
  createSLAOverrideClient,
  updateSLAOverrideClient,
  deleteSLAOverrideClient,
  updateEscalationRulesClient,
  updateFPRMetricsClient,
} from './client';

// Re-export server-side functions
export {
  getSLATargetsServer,
  getSLAOverridesServer,
  getEscalationRulesServer,
  getFPRMetricsServer,
} from './server';

// Re-export server actions
export {
  createSLATargetAction,
  updateSLATargetAction,
  deleteSLATargetAction,
  createSLAOverrideAction,
  updateSLAOverrideAction,
  deleteSLAOverrideAction,
  updateEscalationRulesAction,
  updateFPRMetricsAction,
} from './actions';
