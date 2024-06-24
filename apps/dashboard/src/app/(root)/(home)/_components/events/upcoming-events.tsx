"use client";
import React from "react";
import { Card } from "@hr-toolkit/ui/card";
import { DatePickerWithRange } from "@hr-toolkit/ui/date-range-picker";
import { addDays, endOfDay, format, startOfDay } from "date-fns";
import { Separator } from "@hr-toolkit/ui/separator";
import { CalendarPlus } from "lucide-react";
import { Button } from "@hr-toolkit/ui/button";
import type { DateRange } from "react-day-picker";
import { ScrollArea, ScrollBar } from "@hr-toolkit/ui/scroll-area";
import type { Event } from "@hr-toolkit/supabase/types";
import { Avatar, AvatarFallback } from "@hr-toolkit/ui/avatar";

// type Props = {}

export default function UpcomingEvents() {
	const [date, setDate] = React.useState<DateRange>({
		from: new Date(),
		to: addDays(new Date(), 6),
	});

	const groupedEvents = groupedEventsByDate(demoEvents as Event[]);

	return (
		<Card className="p-4 w-full flex flex-col gap-4">
			<div className="flex sm:items-center items-start gap-4 flex-col sm:flex-row">
				<h3 className="text-foreground/70 font-semibold mr-auto">
					Upcoming Events
				</h3>
				<div className="flex items-center gap-4">
					<DatePickerWithRange
						date={date}
						onSelect={(date) => setDate(date as DateRange)}
						numberOfMonths={1}
						className=" w-64"
					/>
					<Separator orientation="vertical" className="" />
					<Button size="icon" variant={"outline"}>
						<CalendarPlus className="h-4 w-4" />
					</Button>
				</div>
			</div>
			<ScrollArea className="w-full border rounded-md whitespace-nowrap">
				<div className="flex w-full h-[140px] ">
					{Array.from({
						length:
							getDateRangeDifference(date) > 0
								? getDateRangeDifference(date)
								: 7,
					}).map((_, index) => (
						<div
							key={(index + 1).toString()}
							className="flex flex-col flex-1 min-w-40 gap-2  border-r last:border-none "
						>
							<p className="text-foreground/80 p-2 font-semibold text-sm text-center bg-accent w-full">
								{format(addDays(date?.from ?? new Date(), index), "MMM dd")}
							</p>
							<div className="overflow-scroll scrollbar-muted h-full ">
								{groupedEvents[
									format(addDays(date?.from ?? new Date(), index), "yyyy-MM-dd")
								]?.map((event) => (
									<div key={event.id} className=" text-sm text-center py-1">
										<p className="text-foreground/70  ">
											{amPm(event.start_time)} - {amPm(event.end_time)}
										</p>
									</div>
								))}
							</div>
						</div>
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

function groupedEventsByDate(events: Event[]) {
	const groupedEvents: { [key: string]: Event[] } = events.reduce(
		(acc, event) => {
			const eventDate = new Date(event.event_date);
			const key = format(eventDate, "yyyy-MM-dd");
			if (!acc[key as string]) {
				acc[key as string] = [];
			}
			acc[key].push(event);
			return acc;
		},
		{} as { [key: string]: Event[] },
	);

	for (const key in groupedEvents) {
		groupedEvents[key].sort((a, b) => {
			return a.start_time.localeCompare(b.start_time);
		});
	}

	return groupedEvents;
}

function amPm(time: string) {
	const [hours, minutes] = time.split(":");
	const hoursInt = Number(hours);
	const amPm = hoursInt >= 12 ? "PM" : "AM";
	const hours12 = hoursInt % 12 || 12;
	return `${hours12}:${minutes} ${amPm}`;
}

const demoEvents = [
	{
		id: "123e4567-e89b-12d3-a456-426614174000",
		event_name: "Annual General Meeting",
		event_date: addDays(new Date(), 1).toString(),
		start_time: "09:00",
		end_time: "11:00",
		event_description: "Discussing the company's performance and future plans.",
		event_type: "meeting",
		location: "Main Conference Hall",
		organizer_id: "2b1f1e7e-7f80-4c3f-b080-27d6c91d37a5",
		organization_id: "1e7d7e1b-5f1c-4e8c-a63f-5e7e1b7d1f1e",
		department_id: "9b0a4c0b-8f2e-4e8c-b3e5-2e3f2a7e1b3c",
		created_at: "2024-06-01T08:30:00Z",
		updated_at: "2024-06-01T08:30:00Z",
	},
	{
		id: "223e4567-e89b-12d3-a456-426614174001",
		event_name: "Tech Innovation Seminar",
		event_date: addDays(new Date(), 1).toString(),
		start_time: "13:00",
		end_time: "16:00",
		event_description: "Exploring the latest trends in technology.",
		event_type: "seminar",
		location: "Auditorium B",
		organizer_id: "3b2f1e7e-7f80-4c3f-b080-27d6c91d37a6",
		organization_id: "2e7d7e1b-5f1c-4e8c-a63f-5e7e1b7d1f1f",
		department_id: "ab1a4c0b-8f2e-4e8c-b3e5-2e3f2a7e1b4c",
		created_at: "2024-06-10T08:30:00Z",
		updated_at: "2024-06-10T08:30:00Z",
	},
	{
		id: "223e4567-e89b-12d3-a4-426614174001",
		event_name: "Tech Innovation Seminar",
		event_date: addDays(new Date(), 1).toString(),
		start_time: "15:00",
		end_time: "16:00",
		event_description: "Exploring the latest trends in technology.",
		event_type: "seminar",
		location: "Auditorium B",
		organizer_id: "3b2f1e7e-7f80-4c3f-b080-27d6c91d37a6",
		organization_id: "2e7d7e1b-5f1c-4e8c-a63f-5e7e1b7d1f1f",
		department_id: "ab1a4c0b-8f2e-4e8c-b3e5-2e3f2a7e1b4c",
		created_at: "2024-06-10T08:30:00Z",
		updated_at: "2024-06-10T08:30:00Z",
	},
	{
		id: "323e4567-e89b-12d3-a456-426614174002",
		event_name: "Marketing Strategy Workshop",
		event_date: addDays(new Date(), 2).toString(),
		start_time: "10:00",
		end_time: "12:00",
		event_description:
			"Interactive workshop on effective marketing strategies.",
		event_type: "workshop",
		location: "Room 101",
		organizer_id: "4b3f1e7e-7f80-4c3f-b080-27d6c91d37a7",
		organization_id: "3e7d7e1b-5f1c-4e8c-a63f-5e7e1b7d1f1a",
		department_id: "cb2a4c0b-8f2e-4e8c-b3e5-2e3f2a7e1b5c",
		created_at: "2024-06-20T08:30:00Z",
		updated_at: "2024-06-20T08:30:00Z",
	},
	{
		id: "423e4567-e89b-12d3-a456-426614174003",
		event_name: "HR Policies Update",
		event_date: addDays(new Date(), 3).toString(),
		start_time: "14:00",
		end_time: "15:30",
		event_description: "Reviewing and updating company HR policies.",
		event_type: "meeting",
		location: "Room 203",
		organizer_id: "5b4f1e7e-7f80-4c3f-b080-27d6c91d37a8",
		organization_id: "4e7d7e1b-5f1c-4e8c-a63f-5e7e1b7d1f1b",
		department_id: "db3a4c0b-8f2e-4e8c-b3e5-2e3f2a7e1b6c",
		created_at: "2024-06-15T08:30:00Z",
		updated_at: "2024-06-15T08:30:00Z",
	},
	{
		id: "523e4567-e89b-12d3-a456-426614174004",
		event_name: "Corporate Social Responsibility Event",
		event_date: addDays(new Date(), 3).toString(),
		start_time: "09:30",
		end_time: "11:30",
		event_description: "CSR initiatives and volunteer activities.",
		event_type: "event",
		location: "Community Center",
		organizer_id: "6b5f1e7e-7f80-4c3f-b080-27d6c91d37a9",
		organization_id: "5e7d7e1b-5f1c-4e8c-a63f-5e7e1b7d1f1c",
		department_id: "eb4a4c0b-8f2e-4e8c-b3e5-2e3f2a7e1b7c",
		created_at: "2024-06-25T08:30:00Z",
		updated_at: "2024-06-25T08:30:00Z",
	},
];
