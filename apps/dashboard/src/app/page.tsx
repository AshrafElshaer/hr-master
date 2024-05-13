"use client";
import { Button } from "@hr-master/ui/button";
import { DateRangePicker } from "@hr-master/ui/date-range-picker";

export default function Page(): JSX.Element {
	return (
		<main className="flex flex-col items-center justify-between min-h-screen p-24">
			<Button>Click me</Button>
			<DateRangePicker
				onSelect={(range) => {
					console.log(range);
				}}
				placeholder="Select date range"
				range={{
					from: new Date(),
					to: new Date(),
				}}
			/>
		</main>
	);
}
