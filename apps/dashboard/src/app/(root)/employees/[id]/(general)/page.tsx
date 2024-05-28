import { createServerClient } from "@hr-toolkit/supabase/server";
import { getEmplyeeById } from "@hr-toolkit/supabase/user-mutaions";
import BasicInfo from "./components/basics";
import { ScrollArea } from "@hr-toolkit/ui/scroll-area";

export default async function EmployeeDetails({
	params,
}: { params: { id: string } }) {
	const supabase = createServerClient();
	const employee = await getEmplyeeById(supabase, params.id);

	return (
		<section className="gap-4 flex flex-col md:flex-row  p-4 h-full overflow-y-scroll overflow-x-hidden scrollbar-muted ">
			<BasicInfo employee={employee} />
			<div className="flex flex-col gap-4 w-full flex-grow justify-between">
				<div className="">personal</div>
				<div className="">address</div>
				<div className="">emergency</div>
			</div>
		</section>
	);
}
