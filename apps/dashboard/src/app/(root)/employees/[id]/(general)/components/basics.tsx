import type { UserWithDepartment } from "@hr-toolkit/supabase/types";
import React from "react";

type Props = {
	employee: UserWithDepartment;
};

export default function BasicInfo({ employee }: Props) {
	return (
		<div>
			{employee?.first_name} {employee?.last_name}
		</div>
	);
}
