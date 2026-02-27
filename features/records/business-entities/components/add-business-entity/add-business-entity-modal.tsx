"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddBusinessEntityForm } from "./add-business-entity-form";
import type { AddBusinessEntityFormValues } from "../../validations/add-business-entity-schema";

type AddBusinessEntityModalProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}>;

export function AddBusinessEntityModal({
  open,
  onOpenChange,
  onSuccess,
}: AddBusinessEntityModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (values: AddBusinessEntityFormValues) => {
    setIsSubmitting(true);
    try {
      // TODO: call API when backend is ready
      onOpenChange(false);
      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[80vh] p-6 flex flex-col w-full max-w-[600px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Add Business Entity</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto -mx-6 px-6 space-y-4 scrollbar-thin">
          <AddBusinessEntityForm
            key={open ? "add-entity-open" : "add-entity-closed"}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitLabel="Add Business Entity"
            cancelLabel="Cancel"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
