/**
 * Capacity Tab Component (Server)
 * 
 * Main tab component that wraps client content.
 * Server component - no interactivity, just composition.
 */

import { CapacitySettingsForm } from './capacity-settings-form';

export function CapacityTab() {
  return <CapacitySettingsForm />;
}
