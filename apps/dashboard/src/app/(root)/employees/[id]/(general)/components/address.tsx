import React from "react";
import type { UserWithDepartment } from "@hr-toolkit/supabase/types";
import { Card } from "@hr-toolkit/ui/card";

type Props = {
	employee: UserWithDepartment;
};

export default function Address({ employee }: Props) {
	return <Card className="w-full p-4 flex-grow ">Address</Card>;
}
