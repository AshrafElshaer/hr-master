"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@hr-toolkit/ui/utils";

import BackButton from "@/components/back-button";
import { buttonVariants } from "@hr-toolkit/ui/button";
import { Clock, FileText, NotebookTabs } from "lucide-react";
import { HiOutlineBanknotes } from "react-icons/hi2";

export default function EmployeeDetailsLayout({
	children,
	params,
}: { children: React.ReactNode; params: { id: string } }) {
	const pathname = usePathname();
	const employeeId = params.id;

	return (
		<>
			<section className=" w-full flex items-center gap-2 overflow-x-scroll overflow-y-clip scrollbar-hide py-3 px-4">
				<BackButton path="/employees" />
				{employeeDetailsNavigation.map((route) => {
					const isActivePath =
						pathname === `/employees/${employeeId}${route.path}`;
					return (
						<Link
							href={`/employees/${employeeId}${route.path}`}
							key={`/employees/${employeeId}${route.path}`}
							className={cn(
								buttonVariants({
									variant: isActivePath ? "secondary" : "ghost",
									className: "gap-2",
								}),
							)}
						>
							{route.icon}
							{route.title}
						</Link>
					);
				})}
			</section>

			{children}
		</>
	);
}
const employeeDetailsNavigation = [
	{
		title: "General",
		path: "",
		icon: <NotebookTabs className="w-4 h-4" />,
	},
	{
		title: "Attendance",
		path: "/attendance",
		icon: <Clock className="w-4 h-4" />,
	},
	{
		title: "Payroll",
		path: "/payroll",
		icon: <HiOutlineBanknotes className="w-4 h-4" />,
	},
	{
		title: "Documents",
		path: "/documents",
		icon: <FileText className="w-4 h-4" />,
	},
];
