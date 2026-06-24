"use client";

import { useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface DateRangePickerProps {
  range: DateRange | undefined;
  onRangeChange: (range: DateRange | undefined) => void;
  disabled?: (date: Date) => boolean;
}

export default function DateRangePicker({
  range,
  onRangeChange,
  disabled,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="border border-gray-300 rounded-xl overflow-hidden cursor-pointer">
          <div className="grid grid-cols-2">
            <div className="p-4 border-r border-gray-300">
              <p className="text-xs text-gray-400">CHECK-IN</p>
              <p className="font-medium text-lg">
                {range?.from
                  ? format(range.from, "MMM dd, yyyy")
                  : "Add date"}
              </p>
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-400">CHECK-OUT</p>
              <p className="font-medium text-lg">
                {range?.to
                  ? format(range.to, "MMM dd, yyyy")
                  : "Add date"}
              </p>
            </div>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-3"
        align="center"
        sideOffset={8}
      >
        <Calendar
          mode="range"
          showOutsideDays={false}
          selected={range}
          onSelect={(value) => {
            onRangeChange(value);
            if (value?.from && value?.to) {
              const nights =
                (value.to.getTime() - value.from.getTime()) /
                (1000 * 60 * 60 * 24);
              if (nights >= 1) {
                setOpen(false);
              }
            }
          }}
          numberOfMonths={2}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
}
