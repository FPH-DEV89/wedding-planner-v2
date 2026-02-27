"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-3", className)}
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                month_caption: "flex justify-center pt-2 relative items-center mb-4",
                caption_label: "text-base font-serif font-bold text-[#c96d4b] uppercase tracking-widest",
                nav: "space-x-1 flex items-center",
                button_previous: cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-7 w-7 bg-transparent p-0 opacity-100 absolute left-1 z-10 text-[#c96d4b] hover:bg-[#c96d4b]/10 !border-none !ring-0 transition-all flex items-center justify-center"
                ),
                button_next: cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-7 w-7 bg-transparent p-0 opacity-100 absolute right-1 z-10 text-[#c96d4b] hover:bg-[#c96d4b]/10 !border-none !ring-0 transition-all flex items-center justify-center"
                ),
                month_grid: "w-full border-collapse space-y-1",
                weekdays: "flex justify-between mb-2",
                weekday:
                    "text-muted-foreground w-9 font-serif font-medium text-[0.8rem] uppercase tracking-wider",
                week: "flex w-full mt-2 justify-between",
                day: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                day_button: cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-9 w-9 p-0 font-medium aria-selected:opacity-100 hover:bg-[#c96d4b]/20 hover:text-[#c96d4b] rounded-xl transition-all text-[#3a2a22]"
                ),
                range_start: "day-range-start",
                range_end: "day-range-end",
                selected:
                    "!bg-[#c96d4b] !text-white hover:!bg-[#c96d4b] hover:!text-white focus:!bg-[#c96d4b] focus:!text-white rounded-xl shadow-lg font-bold scale-105",
                today: "text-[#c96d4b] font-serif font-extrabold underline decoration-2 underline-offset-4",
                outside:
                    "day-outside text-muted-foreground opacity-30 aria-selected:bg-[#c96d4b]/30 aria-selected:text-muted-foreground aria-selected:opacity-30",
                disabled: "text-muted-foreground opacity-30",
                range_middle:
                    "aria-selected:bg-[#f3ece4] aria-selected:text-foreground",
                hidden: "invisible",
                ...classNames,
            }}
            components={{
                Chevron: ({ orientation, ...props }) => {
                    const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
                    return <Icon {...props} className={cn("h-4 w-4", props.className)} />;
                },
            }}
            {...props}
        />
    )
}
Calendar.displayName = "Calendar"

export { Calendar }
