/**
 * Add Trigger Event Modal Component
 *
 * Dialog wrapper for adding or editing trigger events.
 * Handles dialog state while delegating form logic to client-side content.
 */

'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { AddTriggerEventFormContent } from './add-trigger-event-form-content';

interface AddTriggerEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingEventId?: string | null;
}

export function AddTriggerEventModal({
  open,
  onOpenChange,
  editingEventId,
}: Readonly<AddTriggerEventModalProps>) {
  const isNew = !editingEventId;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl" showCloseButton>
        <DialogHeader className='gap-1'>
          <DialogTitle>{isNew ? 'Add New Trigger Event' : 'Edit Trigger Event'}</DialogTitle>
          <DialogDescription>
            {isNew
              ? 'Create a new trigger event that can be used in follow-up rules.'
              : 'Update the trigger event details.'}
          </DialogDescription>
        </DialogHeader>

        <AddTriggerEventFormContent
          editingEventId={editingEventId}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
