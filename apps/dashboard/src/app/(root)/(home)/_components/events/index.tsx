import React, { Suspense } from "react";

import { Card } from "@hr-toolkit/ui/card";
import UpcomingEventsHeader from "./upcoming-events-header";
import CalendarView from "./calendar-view";
import { Skeleton } from "@hr-toolkit/ui/skeleton";

type SearchParams = {
	[key in "events-from" | "events-to"]?: string | undefined;
};

export default async function Events({
	searchParams,
}: {
	searchParams?: SearchParams;
}) {
	return (
		<Card className="p-4 w-full flex flex-col gap-4">
			<UpcomingEventsHeader />
			<Suspense fallback={<CalendarSkeleton />}>
				<CalendarView searchParams={searchParams} />
			</Suspense>
		</Card>
	);
}

export function CalendarSkeleton() {
	return (
		<div className="w-full flex h-[140px] border rounded-md overflow-hidden">
			{Array.from({ length: 7 }).map((_, index) => (
				<div
					key={index.toString()}
					className="flex flex-col flex-1 min-w-40 gap-2  border-r last:border-none "
				>
					<Skeleton className="h-10 w-full rounded-none" />
					<div className="h-full flex flex-col gap-3 justify-start items-center">
						<Skeleton className="h-3 w-3/5" />
						<Skeleton className="h-3 w-3/5" />
						<Skeleton className="h-3 w-3/5" />
					</div>
				</div>
			))}
		</div>
	);
}
