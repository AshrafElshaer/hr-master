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
		<ScrollArea className="p-4 h-[calc(100svh_-_110px)] sm:pb-4">
			<section className="gap-4 flex flex-col h-full md:flex-row">
				<BasicInfo employee={employee} />
				<div className="flex flex-col gap-4 w-full flex-grow justify-between">
				<BasicInfo employee={employee} />
				<BasicInfo employee={employee} />
				<BasicInfo employee={employee} />
					{/* <div className="">personal</div>
					<div className="">address</div>
					<div className="">emergency</div> */}
				</div>
			</section>
		</ScrollArea>
	);
}
