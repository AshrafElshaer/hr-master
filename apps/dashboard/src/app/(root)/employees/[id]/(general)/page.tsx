import { createServerClient } from "@hr-toolkit/supabase/server";
import { getEmplyeeById } from "@hr-toolkit/supabase/user-mutaions";
import BasicInfo from "./components/basics";

export default async function EmployeeDetails({
	params,
}: { params: { id: string } }) {
	const supabase = createServerClient();
	// const { data: employee, error } = useQuery({
	// 	queryKey: ["employee", params.id],
	// 	queryFn: () => getEmplyeeById(supabase, params.id),
	// });
	const employee = await getEmplyeeById(supabase, params.id);

	return (
		<main className="flex flex-col items-start justify-start h-full p-4 gap-4">
			<BasicInfo employee={employee} />
		</main>
	);
}
