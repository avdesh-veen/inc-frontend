
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useAssignmentStore } from '@/features/settings/hooks/use-assignment-store';
import { RoutingRuleFormContent } from './routing-rule-form-content';

export function RoutingRuleFormDrawer() {
  const { isRoutingRuleFormOpen, selectedRule, closeRoutingRuleForm } = useAssignmentStore();

  const isEditing = !!selectedRule;

  return (
    <Drawer direction="right" open={isRoutingRuleFormOpen} onOpenChange={closeRoutingRuleForm}>
      <DrawerContent className="!w-[60vw] !max-w-none overflow-y-auto overflow-x-hidden">
        <DrawerHeader>
          <DrawerTitle>
            {isEditing ? 'Edit Routing Rule' : 'Add Routing Rule'}
          </DrawerTitle>
        </DrawerHeader>

        <RoutingRuleFormContent />
      </DrawerContent>
    </Drawer>
  );
}
