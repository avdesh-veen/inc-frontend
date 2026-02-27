/**
 * Skill Form Component
 *
 * Form for creating and editing skills.
 * Uses React Hook Form with Zod validation.
 * Field names match the backend API.
 */

"use client";

import * as React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { skillSchema, type SkillFormData } from "../../validations/schemas";
import type { SkillApiItem, SkillCategory, ProficiencyLevel, WorkType } from "../../types";

export interface SkillFormProps {
  /** Skill to edit (undefined for create mode) */
  skill?: SkillApiItem | null;
  /** Available categories from the API */
  categories: SkillCategory[];
  /** Available work types from the API */
  workTypes: WorkType[];
  /** Handler called when form is submitted */
  onSubmit: (data: SkillFormData) => void;
  /** Handler called when cancel is clicked */
  onCancel: () => void;
  /** Whether the form is submitting */
  isSubmitting?: boolean;
}

export function SkillForm({
  skill,
  categories,
  workTypes,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: Readonly<SkillFormProps>) {
  const form = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema) as Resolver<SkillFormData>,
    defaultValues: {
      name: skill?.name ?? "",
      description: skill?.description ?? "",
      categoryId: skill?.category?.id ?? "",
      minimumProficiency: skill?.minimumProficiency ?? "trainee",
      requiresCertification: skill?.requiresCertification ?? false,
      certificationValidity: skill?.certificationValidity ?? undefined,
      isActive: skill?.isActive ?? true,
      skillWorkTypes: skill?.skillWorkTypes?.map((rel) => rel.workTypeId) ?? [],
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const requiresCertification = form.watch("requiresCertification");

  const handleSubmit = (data: SkillFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Skill Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skill Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Primary Source Verification"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what this skill involves..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Brief description of the skill (max 500 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Proficiency Level */}
        <FormField
          control={form.control}
          name="minimumProficiency"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Minimum Proficiency Level</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => field.onChange(value as ProficiencyLevel)}
                  defaultValue={field.value}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="trainee" id="level-trainee" />
                    <Label htmlFor="level-trainee" className="font-normal cursor-pointer">
                      <span className="font-semibold">1 - Trainee:</span> Can perform with supervision
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="competent" id="level-competent" />
                    <Label htmlFor="level-competent" className="font-normal cursor-pointer">
                      <span className="font-semibold">2 - Competent:</span> Can perform independently
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="expert" id="level-expert" />
                    <Label htmlFor="level-expert" className="font-normal cursor-pointer">
                      <span className="font-semibold">3 - Expert:</span> Can teach and mentor others
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Requires Certification */}
        <FormField
          control={form.control}
          name="requiresCertification"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Requires Certification</FormLabel>
                <FormDescription>
                  Check if this skill requires formal certification or training
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {/* Certification Validity (conditional) */}
        {requiresCertification && (
          <FormField
            control={form.control}
            name="certificationValidity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certification Validity (Months)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    max="60"
                    placeholder="e.g., 12"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormDescription>
                  How many months the certification remains valid
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Status */}
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={(val) => field.onChange(val === "true")}
                defaultValue={field.value ? "true" : "false"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Work Types */}
        {workTypes.length > 0 && (
          <FormField
            control={form.control}
            name="skillWorkTypes"
            render={() => (
              <FormItem>
                <FormLabel>Work Types</FormLabel>
                <FormDescription>
                  Select the work types this skill applies to
                </FormDescription>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {workTypes.map((wt) => (
                    <FormField
                      key={wt.id}
                      control={form.control}
                      name="skillWorkTypes"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(wt.id)}
                              onCheckedChange={(checked) => {
                                const current = field.value ?? [];
                                field.onChange(
                                  checked
                                    ? [...current, wt.id]
                                    : current.filter((id: string) => id !== wt.id),
                                );
                              }}
                            />
                          </FormControl>
                          <Label className="font-normal cursor-pointer">
                            {wt.name}
                          </Label>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : skill ? "Update Skill" : "Create Skill"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
