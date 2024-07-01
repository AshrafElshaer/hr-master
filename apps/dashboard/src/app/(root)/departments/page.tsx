import type { Metadata } from "next";
import { Suspense } from "react";

import DepartmentsHeader from "./components/departments-header";
import DepartmentTable from "./components/table";
import { Skeleton } from "@hr-toolkit/ui/skeleton";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronsUpDown,
	Filter,
	Search,
} from "lucide-react";
import { Button } from "@hr-toolkit/ui/button";
import {
	DoubleArrowLeftIcon,
	DoubleArrowRightIcon,
} from "@radix-ui/react-icons";

export const metadata: Metadata = {
	title: "Departments",
	description: "Manage your departments",
};

export default function DepartmentsPage() {
	return (
		<main className="flex flex-col items-center justify-start h-full p-4 ">
			<DepartmentsHeader />
			<Suspense fallback={<TableLoader />}>
				<DepartmentTable />
			</Suspense>
		</main>
	);
}

function TableLoader() {
	return (
		<section className="w-full flex flex-col flex-grow gap-2">
			<div className="flex  items-center gap-2 h-9 w-full sm:max-w-xs mr-auto rounded-md  border bg-transparent px-2 py-1 text-base md:text-sm cursor-not-allowed opacity-50 animate-pulse">
				<Search size={18} />
				Filter Departments by name
			</div>

			<Skeleton className="w-full flex-grow min-h-[21.5rem] sm:min-h-[30rem]" />
			<div className="flex items-center  justify-end gap-2 p-2 mt-auto ">
				<div className="flex flex-col sm:flex-row gap-2 items-center ">
					<p className="text-sm font-medium">Rows per page</p>
					<Button variant="outline" size="sm" disabled>
						10 <ChevronsUpDown size={14} className="ml-2" />
					</Button>
				</div>
				<div className="flex flex-col sm:flex-row items-center gap-2 ">
					<div className="flex w-[100px] items-center justify-center text-sm font-medium">
						Page 1 of 1
					</div>
					<div className="flex items-center space-x-2">
						<Button
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex"
							disabled
						>
							<span className="sr-only">Go to first page</span>
							<DoubleArrowLeftIcon className="h-4 w-4" />
						</Button>
						<Button variant="outline" className="h-8 w-8 p-0" disabled>
							<span className="sr-only">Go to previous page</span>
							<ChevronLeftIcon className="h-4 w-4" />
						</Button>
						<Button variant="outline" className="h-8 w-8 p-0" disabled>
							<span className="sr-only">Go to next page</span>
							<ChevronRightIcon className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex"
							disabled
						>
							<span className="sr-only">Go to last page</span>
							<DoubleArrowRightIcon className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
