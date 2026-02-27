/**
 * Skill Sets Tab Component (Server)
 * 
 * Main tab component that wraps client content.
 * Server component - no interactivity, just composition.
 */

import { SkillSetsList } from './skill-sets-list';

export function SkillSetsTab() {
  return <SkillSetsList />;
}
