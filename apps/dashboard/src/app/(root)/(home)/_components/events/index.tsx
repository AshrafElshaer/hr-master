import React from "react";
import { createServerClient } from "@hr-toolkit/supabase/server";
import { getEventsByDate } from "@hr-toolkit/supabase/events-queries";
import { addDays, endOfDay, format, startOfDay } from "date-fns";

import type { EventWithOrganizerAndDepartment } from "@hr-toolkit/supabase/types";
import type { DateRange } from "react-day-picker";

import UpcomingEventsHeader from "./upcoming-events-header";
import EventsList from "./events-list";
import { Card } from "@hr-toolkit/ui/card";
import { ScrollArea, ScrollBar } from "@hr-toolkit/ui/scroll-area";

type SearchParams = {
	[key in "events-from" | "events-to"]?: string | undefined;
};

export default async function Events({
	searchParams,
}: {
	searchParams?: SearchParams;
}) {
	const supabase = createServerClient();

	const fromDate = new Date(searchParams?.["events-from"] || Date.now());
	const date = {
		from: fromDate,
		to: new Date(searchParams?.["events-to"] || addDays(fromDate, 6)),
	};
	const { data, error } = await getEventsByDate(supabase, date);

	const groupedEvents = groupedEventsByDate(
		(data as EventWithOrganizerAndDepartment[]) ?? [],
	);

	return (
		<Card className="p-4 w-full flex flex-col gap-4">
			<UpcomingEventsHeader />
			<ScrollArea className="w-full border rounded-md whitespace-nowrap">
				<div className="flex w-full h-[140px] ">
					{Array.from({
						length:
							getDateRangeDifference(date) > 0
								? getDateRangeDifference(date)
								: 7,
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

function groupedEventsByDate(events: EventWithOrganizerAndDepartment[]) {
	if (!events.length) {
		return {};
	}
	const groupedEvents: { [key: string]: EventWithOrganizerAndDepartment[] } = events.reduce(
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
