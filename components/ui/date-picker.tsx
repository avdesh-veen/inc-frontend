"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";

const DEFAULT_DATE_FORMAT = "MM-dd-yyyy";

type Props = {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  dateFormat?: string;
  placeholder?: string;
};
export function DatePicker({
  value,
  onChange,
  dateFormat = DEFAULT_DATE_FORMAT,
  placeholder = "Pick a date",
}: Readonly<Props>) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (date: Date | undefined) => {
    onChange(date);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          data-empty={!value}
          className="data-[empty=true]:text-muted-foreground w-full justify-between text-left font-normal outline-0 focus:border-violet-500/50 px-3 py-2 rounded-[12px] bg-white/5 border border-white/10 text-sm text-white"
        >
          {value ? format(value, dateFormat) : <span>{placeholder}</span>}
          <HugeiconsIcon icon={ArrowDown01Icon} data-icon="inline-end" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleSelect}
          defaultMonth={value}
        />
      </PopoverContent>
    </Popover>
  );
}
