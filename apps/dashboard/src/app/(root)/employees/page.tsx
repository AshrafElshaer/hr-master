import React from "react";
import EmployeesHeader from "./components/employees-header";
import { createServerClient } from "@hr-toolkit/supabase/server";
import { getEmployees } from "@hr-toolkit/supabase/user-queries";
import { Badge } from "@hr-toolkit/ui/badge";
import EmployeeTable from "./components/table";
import type { Metadata } from "next";



export const metadata: Metadata = {
	title: "Employees",
	description: "Manage your employees",
};
async function EmployeesPage() {
	return (
		<main className="flex flex-col items-center justify-start h-full p-4 gap-4">
			<EmployeesHeader />
			<EmployeeTable />
		</main>
	);
}

export default EmployeesPage;
