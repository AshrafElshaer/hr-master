
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { createServerClient } from "@hr-toolkit/supabase/server";
import { getEmployees } from "@hr-toolkit/supabase/user-queries";
import type { UserWithDepartment } from "@hr-toolkit/supabase/types";

export const revalidate = 300; // 5 minutes

export default async function EmployeeTable() {
	const supabase = createServerClient();
	const employees = (await getEmployees(
		supabase,
	)) as unknown as UserWithDepartment[];

	return <DataTable columns={columns} data={employees ?? []} />;
}
