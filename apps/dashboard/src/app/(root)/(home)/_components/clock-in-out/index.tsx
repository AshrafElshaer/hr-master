import { Button } from "@hr-toolkit/ui/button";
import { Card } from "@hr-toolkit/ui/card";
import { getCurrentAttendance } from "../../actions";

import { AttendanceStatus } from "@hr-toolkit/supabase/types";
import { format } from "date-fns";
import ClockInOut from "./clock-in-out";

export default async function ClockInOutIndex() {
	const { data: currentAttendance } = await getCurrentAttendance(null);

	return <ClockInOut currentAttendance={currentAttendance} />;
}
