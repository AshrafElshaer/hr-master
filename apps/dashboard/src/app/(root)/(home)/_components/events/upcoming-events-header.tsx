"use client";
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { DateRange } from "react-day-picker";

import { DatePickerWithRange } from "@hr-toolkit/ui/date-range-picker";
import { Separator } from "@hr-toolkit/ui/separator";
import CreateEvent from "./create-events";
import { addDays, format } from "date-fns";
import { createClient } from "@hr-toolkit/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@hr-toolkit/supabase/user-queries";

export default function UpcomingEventsHeader() {
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
	const router = useRouter();
	const [date, setDate] = React.useState<DateRange>({
		from: new Date(),
		to: addDays(new Date(), 6),
	});
	const searchParams = useSearchParams();
	const pathname = usePathname();

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
					date={date}
					onSelect={(date) => {
						setDate(date as DateRange);
						handleSearch(date as DateRange);
					}}
					numberOfMonths={1}
					className=" w-64"
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
