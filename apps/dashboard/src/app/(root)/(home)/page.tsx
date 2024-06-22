import { Suspense } from "react";
import ClockInOut from "./_components/clock-in-out";
import { Skeleton } from "@hr-toolkit/ui/skeleton";

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
	return <Skeleton className="ml-auto w-full sm:w-80 " />;
}
