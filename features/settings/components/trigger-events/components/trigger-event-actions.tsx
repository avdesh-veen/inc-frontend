"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { DeleteModal } from "@/components/ui/delete-modal";
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { TableCell } from '@/components/ui/table';

import type { TriggerEvent } from '@/features/settings/types/trigger-events';
import { 
  useDeleteTriggerEvent, 
  useToggleTriggerEventStatus 
} from '@/features/settings/hooks/use-trigger-events';

export interface TriggerEventActionsProps {
  event: TriggerEvent;
  onEdit: (eventId: string) => void;
}

export function TriggerEventActions({
  event,
  onEdit,
}: Readonly<TriggerEventActionsProps>) {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const deleteMutation = useDeleteTriggerEvent();
  const toggleStatusMutation = useToggleTriggerEventStatus();

  const handleDeleteClick = () => {
    if ((event.rulesCount ?? 0) > 0) {
      toast.error("Cannot delete: This event is used by follow-up rules");
      return;
    }
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(event.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
      },
    });
  };

  const handleToggleStatus = () => {
    toggleStatusMutation.mutate({
      id: event.id,
      isActive: !event.isActive,
    });
  };

  return (
    <>
      <DeleteModal
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Trigger Event"
        name={event.name}
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />

      <TableCell className="text-center">
        <Switch
          className="cursor-pointer"
          checked={event.isActive}
          onCheckedChange={handleToggleStatus}
          aria-label={`Toggle ${event.name} status`}
          disabled={toggleStatusMutation.isPending}
        />
      </TableCell>

      <TableCell className="text-center cursor-pointer">
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onEdit(event.id)}
            aria-label={`Edit ${event.name}`}
            className="cursor-pointer"
          >
            <HugeiconsIcon
              icon={PencilEdit02Icon}
              className="size-4"
              strokeWidth={2}
              aria-hidden="true"
            />
          </Button>
          <Button
            variant="ghost-destructive"
            size="icon-xs"
            onClick={handleDeleteClick}
            aria-label={`Delete ${event.name}`}
            className="cursor-pointer"
          >
            <HugeiconsIcon
              icon={Delete02Icon}
              className="size-4"
              strokeWidth={2}
              aria-hidden="true"
            />
          </Button>
        </div>
      </TableCell>
    </>
  );
}
