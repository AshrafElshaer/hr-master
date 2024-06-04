import type { Metadata } from "next";
import { Suspense } from "react";

import DepartmentsHeader from "./components/departments-header";
import DepartmentTable from "./components/table";
import { Skeleton } from "@hr-toolkit/ui/skeleton";

export const metadata: Metadata = {
	title: "Departments",
	description: "Manage your departments",
};

export default function DepartmentsPage() {
	return (
		<main className="flex flex-col items-center justify-start h-full p-4 ">
			<DepartmentsHeader />
			<Suspense fallback={<TableSkeleton />}>
				<DepartmentTable />
			</Suspense>
		</main>
	);
}

function TableSkeleton() {
	return <Skeleton className="w-full h-full" />;
}
