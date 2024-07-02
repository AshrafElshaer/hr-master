import { getAttendanceByDate } from "@hr-toolkit/supabase/attendance-queries";
import { createServerClient } from "@hr-toolkit/supabase/server";
import { subDays } from "date-fns";
import React from "react";

async function EmployeeAttendance({
	params,
}: { params: { organizationId: string; employeeId: string } }) {
	const supabase = createServerClient();
	const { data } = await getAttendanceByDate(supabase, params.employeeId, {
		startDate: new Date().toISOString(),
		endDate: subDays(new Date(), 7).toISOString(),
	});

	const totalHours = data?.reduce((acc, attendance) => {
		return acc + (attendance.total_time ?? 0);
	}, 0);

	return (
		<div>
			EmployeeAttendance
			<p>{params.employeeId}</p>
			{data?.map((attendance) => (
				<div key={attendance.id}>
					{/* <p>{attendance.status}</p> */}
					<p> Hours worked {getHoursFromMinutes(attendance.total_time ?? 0)}</p>
				</div>
			))}
      total hours: {getHoursFromMinutes(totalHours ?? 0)}
		</div>
	);
}

export default EmployeeAttendance;

function getHoursFromMinutes(minutes: number) {
	return (minutes / 60).toFixed(2);
}
