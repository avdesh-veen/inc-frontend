import { useFormContext } from "react-hook-form";

import {
  FormField,
  FormControl,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { type UserFormValues } from "../../validations/user-schema";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { Label } from "@/components/ui/label";
import { FormSectionHeader } from "./form-section-header";
import { useSkillsList } from "../../hooks/use-skills";

function createSkillChangeHandler(
  currentValue: string[],
  skillId: string,
  onChange: (value: string[]) => void,
) {
  return (checked: boolean | "indeterminate") => {
    if (checked === "indeterminate") {
      return;
    }

    if (checked) {
      onChange([...currentValue, skillId]);
    } else {
      onChange(currentValue.filter((id) => id !== skillId));
    }
  };
}

export function SkillsForm() {
  const form = useFormContext<UserFormValues>();
  const {
    data: skillsResponse,
    isLoading,
    error,
  } = useSkillsList({ page: 1, limit: 100 });
  const skills = skillsResponse?.data.items ?? [];
  return (
    <div className="">
      <FormSectionHeader
        title="Skills & Capabilities"
        icon={CheckmarkCircle02Icon}
        className="text-emerald-400"
      />
      <p className="text-xs text-white/40 mb-4">
        Select skills for work assignment routing. Users will be assigned cases
        matching their skill set.
      </p>
      <div className="p-4 rounded-[12px] bg-white/2 border border-white/5">
        <FormField
          control={form.control}
          name="userSkills"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                  {skills.map((skill) => {
                    const checked = field.value?.includes(skill.id);
                    const disabled = isLoading || !!error;
                    return (
                      <Label
                        key={skill.id}
                        htmlFor={skill.id}
                        className={
                          "flex items-center gap-2 p-2 rounded-md hover:bg-white/5 " +
                          (disabled
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer")
                        }
                      >
                        <Checkbox
                          id={skill.id}
                          checked={checked}
                          onCheckedChange={createSkillChangeHandler(
                            field.value ?? [],
                            skill.id,
                            field.onChange,
                          )}
                          className="size-3.5 rounded-xs"
                          disabled={disabled}
                        />
                        <span className="text-white/70">{skill.name}</span>
                      </Label>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
