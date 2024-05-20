import { Button } from "@hr-toolkit/ui/button";
import React from "react";
import { AddNewDepartment } from "./add-department";

export default function DepartmentsHeader() {
	return (
		<section className="w-full flex items-center justify-between">
			<h2 className="md:text-xl">Departments</h2>
			<AddNewDepartment />
		</section>
	);
}
