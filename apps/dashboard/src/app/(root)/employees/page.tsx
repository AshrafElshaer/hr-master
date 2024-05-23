import React from "react";
import EmployeesHeader from "./components/employees-header";

function EmployeesPage() {
	return (
		<main className="flex flex-col items-center justify-start h-full p-4 gap-4">
			<EmployeesHeader />
		</main>
	);
}

export default EmployeesPage;
