"use client";
import React from "react";
import { addDays, format } from "date-fns";

import type { EventWithOrganizerAndDepartment } from "@hr-toolkit/supabase/types";

import EventCard from "./event-card";

type Props = {
	events: EventWithOrganizerAndDepartment[] | never[] | null;
	index: number;
	date: Date | undefined;
};

export default function EventsList({ events, index, date }: Props) {
	return (
		<div className="flex flex-col flex-1 min-w-40 gap-2  border-r last:border-none ">
			<p className="text-foreground/80 p-2 font-semibold text-sm text-center bg-accent w-full">
				{format(addDays(date ?? new Date(), index + 1), "MMM dd")}
			</p>
			<div className="overflow-scroll scrollbar-muted h-full flex flex-col">
				{events?.map((event) => (
					<EventCard key={event.id} event={event} />
				))}
			</div>
		</div>
	);
}
