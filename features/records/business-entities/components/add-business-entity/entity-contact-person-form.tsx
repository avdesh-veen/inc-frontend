"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FormSectionHeader } from "./form-section-header";
import type { AddBusinessEntityFormValues } from "../../validations/add-business-entity-schema";

export function EntityContactPersonForm() {
  const form = useFormContext<AddBusinessEntityFormValues>();

  return (
    <div className="space-y-4">
      <Separator className="h-px bg-white/10" />
      <FormSectionHeader
        title="CONTACT PERSON"
        className="text-white/60"
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="contactName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Contact Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Practice Administrator"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <Separator className="h-px bg-white/10" />
    </div>
  );
}
