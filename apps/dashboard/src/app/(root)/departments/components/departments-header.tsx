import { Button } from "@hr-toolkit/ui/button";
import React from "react";

export default function DepartmentsHeader() {
	return (
		<section className="w-full flex items-center justify-between">
			<h2 className="text-xl">Departments</h2>
			<Button >Add Department</Button>
		</section>
	);
}
