import { createServerClient } from "@hr-toolkit/supabase/server";
import { getEmployeeById } from "@hr-toolkit/supabase/user-queries";
import React from "react";

async function EmployeeDocuments({ params }: { params: { id: string } }) {
	const supabase = createServerClient();
	const employee = await getEmployeeById(supabase, params.id);
	const { data } = await supabase.storage
		.from("employee-documents")
		.list(`${employee.organization_id?.toString()}/${params.id}`);

	return (
		<main className="flex flex-col items-center justify-start h-full p-4 ">
			EmployeeDocuments
			<p>{params.id}</p>
		</main>
	);
}

export default EmployeeDocuments;
