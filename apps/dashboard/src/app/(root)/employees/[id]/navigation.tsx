"use client";

import { usePathname } from "next/navigation";
import { buttonVariants } from "@hr-toolkit/ui/button";
import { cn } from "@hr-toolkit/ui/utils";

import BackButton from "@/components/back-button";
import Link from "next/link";
import { Clock, FileText, NotebookTabs } from "lucide-react";
import { HiOutlineBanknotes } from "react-icons/hi2";

type Props = {
	employeeId: string;
};

export default function EmployeeNavigation({ employeeId }: Props) {
	const pathname = usePathname();

	return (
		<section className=" w-full flex items-center gap-2 overflow-x-scroll overflow-y-clip scrollbar-hide py-3 px-4">
			<BackButton />
			{employeeDetailsNavigation.map((route) => {
				const isActivePath =
					pathname === `/employees/${employeeId}${route.path}` ||
					route.subRoutes?.some(
						(subRoute) =>
							pathname ===
							`/employees/${employeeId}${route.path}${subRoute.path}`,
					);
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
		subRoutes: [
			{
				name: "Personal",
				path: "/personal",
			},
			{
				name: "Employment",
				path: "/employment",
			},
			{
				name: "Tax",
				path: "/tax",
			},
			{
				name: "Bank",
				path: "/bank",
			},
		],
	},
];
