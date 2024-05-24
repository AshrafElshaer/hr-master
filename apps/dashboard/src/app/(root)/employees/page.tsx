import React from "react";
import EmployeesHeader from "./components/employees-header";
import { createServerClient } from "@hr-toolkit/supabase/server";
import { getEmployees } from "@hr-toolkit/supabase/user-queries";

async function EmployeesPage() {
	const supabase = createServerClient();
	const employees = await getEmployees(supabase);
	console.log({ employees });
	return (
		<main className="flex flex-col items-center justify-start h-full p-4 gap-4">
			<EmployeesHeader />
		</main>
	);
}

export default EmployeesPage;
