import { ScrollArea, ScrollBar } from "@hr-toolkit/ui/scroll-area";
import React from "react";
import EventsList from "./events-list";
import { addDays, endOfDay, format, startOfDay } from "date-fns";
import type { DateRange } from "react-day-picker";
import { createServerClient } from "@hr-toolkit/supabase/server";
import { getEventsByDate } from "@hr-toolkit/supabase/events-queries";
import type { EventWithOrganizerAndDepartment } from "@hr-toolkit/supabase/types";

type SearchParams = {
	[key in "events-from" | "events-to"]?: string | undefined;
};

export default async function CalendarView({
	searchParams,
}: {
	searchParams?: SearchParams;
}) {
	const supabase = createServerClient();

	const from = searchParams?.["events-from"]
		? addDays(new Date(searchParams["events-from"]), 1)
		: new Date(Date.now());

	const date = {
		from,
		to: new Date(
			searchParams?.["events-to"]
				? addDays(new Date(searchParams["events-to"]), 1)
				: addDays(from, 6),
		),
	};
	const { data, error } = await getEventsByDate(supabase, date);

	const groupedEvents = groupeEventsByDate(
		(data as EventWithOrganizerAndDepartment[]) ?? [],
	);
	return (
		<ScrollArea className="w-full border rounded-md whitespace-nowrap">
			<div className="flex w-full h-[140px] ">
				{Array.from({
					length:
						getDateRangeDifference(date) > 0 ? getDateRangeDifference(date) : 7,
				}).map((_, index) => (
					<EventsList
						key={(index + 1).toString()}
						date={date.from}
						index={index}
						events={
							groupedEvents[
								format(addDays(date?.from ?? new Date(), index), "yyyy-MM-dd")
							]
						}
					/>
				))}
			</div>
			<ScrollBar orientation="horizontal" />
		</ScrollArea>
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

function groupeEventsByDate(events: EventWithOrganizerAndDepartment[]) {
	if (!events.length) {
		return {};
	}
	const groupedEvents: { [key: string]: EventWithOrganizerAndDepartment[] } =
		events.reduce(
			(acc, event) => {
				const key = event.event_date;
				if (!acc[key as string]) {
					acc[key as string] = [];
				}
				acc[key].push(event);
				return acc;
			},
			{} as { [key: string]: EventWithOrganizerAndDepartment[] },
		);

	for (const key in groupedEvents) {
		groupedEvents[key].sort((a, b) => {
			return a.start_time.localeCompare(b.start_time);
		});
	}

	return groupedEvents;
}
