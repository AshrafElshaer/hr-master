import { Suspense } from "react";
import ClockInOut from "./_components/clock-in-out";
import { Skeleton } from "@hr-toolkit/ui/skeleton";
import { Card } from "@hr-toolkit/ui/card";

export default function IndexPage() {
	return (
		<main className="flex flex-col gap-4 h-full p-4">
			<h2 className="md:text-xl">Dashboard</h2>
			<Suspense fallback={<ClockInOutSkeleton />}>
				<ClockInOut />
			</Suspense>
		</main>
	);
}

function ClockInOutSkeleton() {
	return (
		<Card className=" ml-auto flex flex-col p-4 gap-2 w-full sm:w-80 ">
			<div className="flex items-center justify-between">
				<h3 className="text-foreground/70 font-semibold">Clock In/Out</h3>
				<Skeleton className="h-4 w-20" />
			</div>
			<Skeleton className="h-8 w-full " />
		</Card>
	);
}
