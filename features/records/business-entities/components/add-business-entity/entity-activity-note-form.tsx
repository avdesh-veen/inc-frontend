"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { HugeiconsIcon } from "@hugeicons/react";
import { FileIcon } from "@hugeicons/core-free-icons";
import type { AddBusinessEntityFormValues } from "../../validations/add-business-entity-schema";

export function EntityActivityNoteForm() {
  const form = useFormContext<AddBusinessEntityFormValues>();

  return (
    <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3">
      <FormField
        control={form.control}
        name="activityNote"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm text-amber-300 flex items-center gap-2">
              <HugeiconsIcon
                icon={FileIcon}
                className="size-4"
                strokeWidth={2}
                aria-hidden="true"
              />
              Activity Note{" "}
              <span className="text-amber-400/60 text-xs font-normal">
                (Required for audit trail)
              </span>
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Textarea
                  {...field}
                  rows={2}
                  placeholder="Why is this entity being added? e.g., New practice location, acquired practice..."
                  className="border-amber-500/30 focus:border-amber-500/50 bg-amber-500/5 pr-9"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
