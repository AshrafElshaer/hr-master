import { ScrollArea, ScrollBar } from "@hr-toolkit/ui/scroll-area";
import React from "react";
import EventsList from "./events-list";
import { addDays, endOfDay, format, startOfDay } from "date-fns";

import { createServerClient } from "@hr-toolkit/supabase/server";
import { getEventsByDate } from "@hr-toolkit/supabase/events-queries";
import type { EventWithOrganizerAndDepartment } from "@hr-toolkit/supabase/types";

type SearchParams = {
	[key in "events-from" | "events-to"]?: string | undefined;
};

// TODO: REBUILD THIS COMPONENT
export default async function CalendarView({
	searchParams,
}: {
	searchParams?: SearchParams;
}) {
	const supabase = createServerClient();

	const from =
		searchParams?.["events-from"] ?? format(new Date(), "yyyy-MM-dd");

	const date = {
		from,
		to:
			searchParams?.["events-to"] ??
			format(endOfDay(addDays(new Date(from), 6)), "yyyy-MM-dd"),
	};
	const { data, error } = await getEventsByDate(supabase, date);

	const groupedEvents = groupeEventsByDate(
		(data as EventWithOrganizerAndDepartment[]) ?? [],
	);

	return (
		<ScrollArea className="w-full border rounded-md whitespace-nowrap">
			<div className="flex w-full h-[140px] ">
				{Array.from({
					length: getDaysCount(date) > 0 ? getDaysCount(date) : 7,
				}).map((_, index) => (
					<EventsList
						key={(index + 1).toString()}
						date={format(addDays(from, index), "EEEE , MMMM dd")}
						index={index}
						events={groupedEvents[format(addDays(from, index), "yyyy-MM-dd")]}
					/>
				))}
			</div>
			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	);
}

function getDaysCount(dateRange: { from: string; to: string }) {
	if (!dateRange?.from || !dateRange?.to) {
		return 0;
	}

	const start = startOfDay(dateRange.from).getTime();
	const end = endOfDay(dateRange.to).getTime();
	const diffInMilliseconds = end - start;
	const diffInDays = diffInMilliseconds / (1000 * 3600 * 24);

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
