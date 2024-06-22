"use client";
import useCurrentTime from "@/hooks/use-current-time";
import { AttendanceStatus, type Attendance } from "@hr-toolkit/supabase/types";
import { Button } from "@hr-toolkit/ui/button";
import { useMutation } from "@tanstack/react-query";
import { clockInAction, clockOutAction } from "../../actions";
import { toast } from "sonner";
import { format } from "date-fns";

import { Card } from "@hr-toolkit/ui/card";

type TimerProps = {
	currentAttendance: Attendance | undefined;
};
export default function ClockInOut({ currentAttendance }: TimerProps) {
	const { hoursAndMinutes } = useCurrentTime();
	const isClockIn = currentAttendance?.status === AttendanceStatus.CLOCKED_IN;
	const { hours, minutes, seconds } = calcClockInTime(
		currentAttendance?.clock_in || "",
	);

	const clockInMutation = useMutation({
		mutationFn: clockInAction,
	});
	const clockInOutMutation = useMutation({
		mutationFn: clockOutAction,
	});

	async function handleClockIn() {
		const now = new Date().toString();
		const { data, serverError } = await clockInMutation.mutateAsync({
			clockedInAt: now,
		});

		if (serverError) {
			toast.error(serverError, {
				description: "Please try again",
			});
			return;
		}
		toast.success(
			`You are clocked in at ${format(new Date(data?.clock_in ?? ""), "hh:mm a")}`,
		);
	}
	async function handleClockOut() {
		const now = new Date().toString();
		const { data, serverError } = await clockInOutMutation.mutateAsync({
			clockedOutAt: now,
		});
		if (serverError) {
			toast.error(serverError, {
				description: "Please try again",
			});
			return;
		}

		toast.success(
			`You are clocked out at ${format(new Date(data?.clock_out ?? ""), "hh:mm a")}`,
		);
	}
	return (
		<Card className=" ml-auto flex flex-col p-4 gap-2 w-full sm:w-80 ">
			<div className="flex items-center justify-between">
				<h3 className="text-foreground/70 font-semibold">Clock In/Out</h3>
				{isClockIn && (
					<p className="text-sm">
						In -{" "}
						{format(new Date(currentAttendance?.clock_in ?? ""), "hh:mm a")}
					</p>
				)}
			</div>
			<div className="flex items-center justify-between">
				{!isClockIn ? (
					<Button
						className="w-full"
						onClick={handleClockIn}
						disabled={clockInMutation.isPending || clockInMutation.isSuccess}
					>
						Clock In at {hoursAndMinutes}
					</Button>
				) : (
					<Button
						className="w-full"
						variant={"destructive"}
						onClick={handleClockOut}
						disabled={
							clockInOutMutation.isPending || clockInOutMutation.isSuccess
						}
					>
						Clock Out {hours ? `${hours}h : ` : null}
						{minutes ? `${minutes}m :` : null} {`${seconds}s`}
					</Button>
				)}
			</div>
		</Card>
	);
}

export function calcClockInTime(clockInAt: string) {
	const now = new Date();
	const diff = now.getTime() - new Date(clockInAt).getTime();
	const hours = Math.floor(diff / 1000 / 60 / 60);
	const minutes = Math.floor((diff / 1000 / 60) % 60);
	const seconds = Math.floor((diff / 1000) % 60);

	return {
		hours,
		minutes,
		seconds,
	};
}
