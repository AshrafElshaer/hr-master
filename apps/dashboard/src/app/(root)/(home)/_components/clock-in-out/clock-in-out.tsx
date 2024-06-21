import { Button } from "@hr-toolkit/ui/button";
import { Card } from "@hr-toolkit/ui/card";
import { getCurrentAttendance } from "../../actions";
import Timer from "./timer";
import { AttendanceStatus } from "@hr-toolkit/supabase/types";
import { format } from "date-fns";

export default async function ClockInOut() {
	const { data: currentAttendance } = await getCurrentAttendance(null);
	const isClockIn = currentAttendance?.status === AttendanceStatus.CLOCKED_IN;

	return (
		<Card className=" ml-auto flex flex-col p-4 gap-2 w-80 ">
			<div className="flex items-center justify-between">
				<h3 className="text-foreground/70 font-semibold">Clock In/Out</h3>
				{isClockIn && (
					<p className="text-sm">In - {format(new Date("6/21/2024, 10:33:51 AM"), "hh:mm a")}</p>
				)}
			</div>
			<Timer currentAttendance={currentAttendance} />
		</Card>
	);
}
