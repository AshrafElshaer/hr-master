"use client";
import React from "react";
import { Card } from "@hr-toolkit/ui/card";
import { DatePickerWithRange } from "@hr-toolkit/ui/date-range-picker";
import { addDays, endOfDay, format, startOfDay } from "date-fns";
import { Separator } from "@hr-toolkit/ui/separator";
import { CalendarPlus, PlusIcon } from "lucide-react";
import { Button } from "@hr-toolkit/ui/button";
import type { DateRange } from "react-day-picker";

// type Props = {}

export default function UpcomingEvents() {
	const [date, setDate] = React.useState<DateRange>({
		from: new Date(),
		to: addDays(new Date(), 6),
	});

	console.log(getDateRangeDifference(date));
	return (
		<Card className="p-4 w-full flex flex-col gap-4">
			<div className="flex items-center gap-4">
				<h3 className="text-foreground/70 font-semibold">Upcoming Events</h3>
				<DatePickerWithRange
					date={date}
					onSelect={(date) => setDate(date as DateRange)}
					className="ml-auto w-64"
				/>
				<Separator orientation="vertical" className="" />
				<Button size="icon" variant={"outline"}>
					<CalendarPlus className="h-4 w-4" />
				</Button>
			</div>
			<div className="flex w-full border rounded-md ">
				{Array.from({
					length:
						getDateRangeDifference(date) > 0 ? getDateRangeDifference(date) : 7,
				}).map((_, index) => (
					<div
						key={(index + 1).toString()}
						className="flex flex-col gap-2 flex-1  border-r last:border-none"
					>
						<p className="text-foreground/80 p-2 font-semibold text-sm text-center bg-accent w-full">
							{format(addDays(date?.from ?? new Date(), index), "MMM dd")}
						</p>
						<div className="p-2 text-sm">
							<p className="text-foreground/70 font-semibold ">event 1</p>
							<p className="text-foreground/70 font-semibold ">event 2</p>
							<p className="text-foreground/70 font-semibold ">event 3</p>
						</div>
					</div>
				))}
			</div>
		</Card>
	);
}

function getDateRangeDifference(dateRange: DateRange) {
	if (!dateRange?.from || !dateRange?.to) {
		return 0;
	}
	const diff =
		endOfDay(dateRange.to).getTime() - startOfDay(dateRange.from).getTime();
	const diffInDays = diff / (1000 * 3600 * 24);
	return Math.round(diffInDays);
}
