import React, { Suspense } from "react";
import type { Metadata } from "next";

import EmployeesHeader from "./components/employees-header";
import EmployeeTable from "./components/table";
import { Skeleton } from "@hr-toolkit/ui/skeleton";




export const metadata: Metadata = {
	title: "Employees",
	description: "Manage your employees",
};
async function EmployeesPage() {
	return (
		<main className="flex flex-col items-center justify-start h-full p-4 gap-4">
			<EmployeesHeader />
			<Suspense fallback={<TableLoader />}>
				<EmployeeTable />
			</Suspense>
		</main>
	);
}

export default EmployeesPage;

function TableLoader() {
	return <Skeleton className="w-full flex-grow rounded" />;
}
