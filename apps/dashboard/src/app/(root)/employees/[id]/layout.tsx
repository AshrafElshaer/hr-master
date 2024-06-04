import type { Metadata, ResolvingMetadata } from "next";
import EmployeeNavigation from "./navigation";
import { createServerClient } from "@hr-toolkit/supabase/server";
import { getEmployeeById } from "@hr-toolkit/supabase/user-queries";

type Props = { children: React.ReactNode; params: { id: string } };

export async function generateMetadata(
	{ params }: Props,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const supabase = createServerClient();
	const employee = await getEmployeeById(supabase, params.id);
	return {
		title: `${employee.first_name} ${employee.last_name}`,
	};
}

export default function EmployeeDetailsLayout({ children, params }: Props) {
	return (
		<main className="flex flex-col h-full ">
			<EmployeeNavigation employeeId={params.id} />
			{children}
		</main>
	);
}
