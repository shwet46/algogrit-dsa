"use client";

import React from "react";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export function DateOfBirthPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-zinc-400">Date of birth</label>
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex w-full items-center justify-between rounded-lg border border-zinc-700/50 bg-zinc-900/60 px-3 py-2 text-left text-sm text-white hover:bg-zinc-800">
            <span>{value ? new Date(value).toLocaleDateString() : "Pick a date"}</span>
            <CalendarDaysIcon className="h-4 w-4 text-zinc-400" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value ? new Date(value) : undefined}
            onSelect={(date) => {
              if (!date) return;
              const yyyy = date.getFullYear();
              const mm = String(date.getMonth() + 1).padStart(2, "0");
              const dd = String(date.getDate()).padStart(2, "0");
              onChange(`${yyyy}-${mm}-${dd}`);
            }}
            captionLayout="dropdown-years"
            fromYear={1950}
            toYear={new Date().getFullYear()}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}