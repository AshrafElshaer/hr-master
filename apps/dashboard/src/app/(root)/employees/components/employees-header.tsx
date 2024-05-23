import React from "react";
import AddNewEmployee from "./sheets/add-employee";

function EmployeesHeader() {
	return (
		<section className="w-full flex items-center justify-between">
			<h2 className="md:text-xl">Employees</h2>
			<AddNewEmployee />
		</section>
	);
}

export default EmployeesHeader;
