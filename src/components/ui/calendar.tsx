"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const isDropdown =
    props.captionLayout === "dropdown-months" ||
    props.captionLayout === "dropdown-years" ||
    props.captionLayout === "dropdown";

  const hideNav = isDropdown; // hide arrows when dropdown is shown

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-2", className)}
      classNames={{
        months:
          "flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0",
        month: "space-y-3",
        caption: "flex justify-center pt-1 relative items-center text-zinc-200",
        caption_label: isDropdown ? "hidden" : "text-sm font-semibold text-zinc-100",
        caption_dropdowns: "flex items-center gap-2",
        dropdown: cn(
          "rounded-md border border-zinc-800 bg-zinc-900 text-zinc-200",
          "px-2 py-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        ),
        dropdown_month: "capitalize",
        dropdown_year: "",
        dropdown_icon: "text-zinc-400",
        nav: hideNav ? "hidden" : "space-x-1 flex items-center",
        nav_button: cn(
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          "rounded-md border border-zinc-800 text-zinc-300"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex text-zinc-400 font-medium",
        head_cell: "text-zinc-400 rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
          "[&:has([aria-selected].day-range-end)]:rounded-r-md"
        ),
        day: cn(
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
          "rounded-md text-zinc-200 hover:bg-zinc-800 hover:text-white focus:outline-none"
        ),
        day_selected: cn(
          "bg-indigo-600 text-white hover:bg-indigo-600",
          "focus:bg-indigo-600"
        ),
        day_today: "bg-zinc-800 text-white",
        day_outside: "text-zinc-500 opacity-50",
        day_disabled: "text-zinc-500 opacity-50",
        day_range_middle: "aria-selected:bg-zinc-800",
        day_hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  );
}