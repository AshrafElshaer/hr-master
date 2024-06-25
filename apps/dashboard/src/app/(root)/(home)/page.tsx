import { Suspense } from "react";
import { Skeleton } from "@hr-toolkit/ui/skeleton";
import { Card } from "@hr-toolkit/ui/card";
import ClockInOut from "./_components/clock-in-out";
import { env } from "@hr-toolkit/env";
import UpcomingEvents from "./_components/events";
import WelcomeMessage from "./_components/welcome";

export default async function IndexPage({
	params,
	searchParams,
  }: {
	params: { slug: string };
	searchParams?: { [key: string]: string | string[] | undefined };
  }) {
	return (
		<main className="flex flex-col gap-4 h-full p-4 ">
			<div className="flex gap-4 flex-col lg:flex-row">
				<Suspense fallback={<WelcomeMessageSkeleton />}>
					{env.NEXT_PUBLIC_NODE_ENV === "development" ? (
						<WelcomeMessageSkeleton />
					) : (
						<WelcomeMessage />
					)}
				</Suspense>
				<Suspense fallback={<ClockInOutSkeleton />}>
					{env.NEXT_PUBLIC_NODE_ENV === "development" ? (
						<ClockInOutSkeleton />
					) : (
						<ClockInOut />
					)}
				</Suspense>
			</div>
			<UpcomingEvents searchParams={searchParams} />
		</main>
	);
}
function WelcomeMessageSkeleton() {
	return (
		<div className="flex flex-col p-4 gap-2 w-full sm:w-80 h-fit ">
			<Skeleton className="h-8 2/3 " />
			<Skeleton className="h-3 w-40" />
			<Skeleton className="h-3 w-32" />
		</div>
	);
}
function ClockInOutSkeleton() {
	return (
		<Card className=" ml-auto flex flex-col p-4 gap-4 w-full sm:w-80 h-fit ">
			<div className="flex items-center justify-between">
				<h3 className="text-foreground/70 font-semibold">Clock In/Out</h3>
				<Skeleton className="h-4 w-20" />
			</div>
			<Skeleton className="h-8 w-full " />
		</Card>
	);
}
