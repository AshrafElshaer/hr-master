import React from "react";
import BackButton from "@/components/back-button";

export default function EmployeeDetails({
	params,
}: { params: { id: string } }) {
	return (
		<section className="flex flex-col items-start justify-start h-full gap-4">
			{params.id}
		</section>
	);
}
