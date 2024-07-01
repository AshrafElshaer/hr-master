"use client";
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@hr-toolkit/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@hr-toolkit/supabase/user-queries";
import { addDays, endOfWeek, format, startOfWeek, subDays } from "date-fns";

import type { DateRange } from "react-day-picker";
import type { DateRangeOption } from "@/types";

import { DatePickerWithRange } from "@hr-toolkit/ui/date-range-picker";
import { Separator } from "@hr-toolkit/ui/separator";
import CreateEvent from "./create-events";

const dateRangeOptions: DateRangeOption[] = [
	{
		title: "Next 7 Days",
		range: {
			from: new Date(),
			to: addDays(new Date(), 6),
		},
	},
	{
		title: "This Week",
		range: {
			from: startOfWeek(new Date(), { weekStartsOn: 1 }),
			to: endOfWeek(new Date(), { weekStartsOn: 1 }),
		},
	},
	{
		title: "Last Week",
		range: {
			from: startOfWeek(subDays(new Date(), 7), { weekStartsOn: 1 }),
			to: endOfWeek(subDays(new Date(), 7), { weekStartsOn: 1 }),
		},
	},
	{
		title: "Next Week",
		range: {
			from: startOfWeek(addDays(new Date(), 7), { weekStartsOn: 1 }),
			to: endOfWeek(addDays(new Date(), 7), { weekStartsOn: 1 }),
		},
	},
];

export default function UpcomingEventsHeader() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { data: user } = useQuery({
		queryKey: ["user"],
		queryFn: async () => {
			const supabase = createClient();
			const { error, user } = await getUser(supabase);
			if (error) {
				throw Error(error.message);
			}
			return user;
		},
	});

	const from = searchParams.get("events-from");
	const to = searchParams.get("events-to");

	const [date, setDate] = React.useState<DateRange>({
		from: from ? addDays(new Date(from), 1) : new Date(),
		to: to
			? addDays(new Date(to), 1)
			: from
				? undefined
				: addDays(new Date(), 6),
	});

	const handleSearch = (date: DateRange) => {
		const params = new URLSearchParams(searchParams);
		if (date) {
			params.set(
				"events-from",
				format(new Date(date.from ?? ""), "yyy-MM-dd") ?? "",
			);
			if (date.to) {
				params.set(
					"events-to",
					format(new Date(date.to ?? ""), "yyyy-MM-dd") ?? "",
				);
			}
		} else {
			params.delete("events-from");
			params.delete("events-to");
		}

		router.replace(`${pathname}?${params.toString()}`);
	};

	return (
		<div className="flex sm:items-center items-start gap-4 flex-col sm:flex-row">
			<h3 className="text-foreground/70 font-semibold mr-auto">
				Upcoming Events
			</h3>
			<div className="flex items-center h-full gap-4">
				<DatePickerWithRange
					className=" w-64"
					date={date}
					dateRangeOptions={dateRangeOptions}
					onSelect={(date) => {
						setDate(date as DateRange);
						handleSearch(date as DateRange);
						console.log(date);
					}}
					numberOfMonths={1}
					max={7}
					min={0}
				/>
				{user?.role !== "employee" ? (
					<>
						<Separator orientation="vertical" />
						<CreateEvent />
					</>
				) : null}
			</div>
		</div>
	);
}
