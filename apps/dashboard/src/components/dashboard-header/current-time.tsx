"use client";
import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function CurrentTime() {
	const [currentTime, setCurrentTime] = useState(
		format(new Date(), "EEE , MMMM dd - hh:mm a"),
	);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(format(new Date(), "EEE , MMMM dd - hh:mm a"));
		}, 1000);
		return () => clearInterval(interval);
	}, []);
	return (
		<h4 className=" hidden text-sm font-bold md:block text-secondary-foreground/80 w-fit">
			{currentTime}
		</h4>
	);
}
