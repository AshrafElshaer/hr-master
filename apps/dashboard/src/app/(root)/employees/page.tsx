import React from "react";
import EmployeesHeader from "./components/employees-header";
import { createServerClient } from "@hr-toolkit/supabase/server";
import { getEmployees } from "@hr-toolkit/supabase/user-queries";
import { Badge } from "@hr-toolkit/ui/badge";

async function EmployeesPage() {
	return (
		<main className="flex flex-col items-center justify-start h-full p-4 gap-4">
			<EmployeesHeader />
			<Badge variant="success">Active</Badge>
			<Badge variant="warning">On Hold</Badge>
		</main>
	);
}

export default EmployeesPage;
