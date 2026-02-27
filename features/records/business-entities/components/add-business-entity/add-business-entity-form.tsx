"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  addBusinessEntitySchema,
  addBusinessEntityDefaultValues,
  type AddBusinessEntityFormValues,
} from "../../validations/add-business-entity-schema";
import { EntityBasicForm } from "./entity-basic-form";
import { EntityContactForm } from "./entity-contact-form";
import { EntityContactPersonForm } from "./entity-contact-person-form";
import { EntityAddressForm } from "./entity-address-form";
import { EntityActivityNoteForm } from "./entity-activity-note-form";

type AddBusinessEntityFormProps = Readonly<{
  onCancel: () => void;
  onSubmit: (values: AddBusinessEntityFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
}>;

export function AddBusinessEntityForm({
  onCancel,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Add Business Entity",
  cancelLabel = "Cancel",
}: AddBusinessEntityFormProps) {
  const form = useForm<AddBusinessEntityFormValues>({
    resolver: zodResolver(addBusinessEntitySchema),
    defaultValues: addBusinessEntityDefaultValues,
  });

  const handleSubmit = async (values: AddBusinessEntityFormValues) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form
        id="add-business-entity-form"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-6"
      >
        <EntityBasicForm />
        <EntityContactForm />
        <EntityContactPersonForm />
        <EntityAddressForm />
        <EntityActivityNoteForm />

        <div className="flex items-center pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 ml-auto">
            <Button
              size="xl"
              type="button"
              variant="muted"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              {cancelLabel}
            </Button>
            <Button
              size="xl"
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : submitLabel}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
