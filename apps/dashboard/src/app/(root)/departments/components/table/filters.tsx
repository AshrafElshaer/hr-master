import { Input } from "@hr-toolkit/ui/input";
import type { Table } from "@tanstack/react-table";
import { Search } from "lucide-react";
import React from "react";
import type { TData } from "./data-table";

type Props = {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	table: Table<any>;
};

function DepartmentFilters({ table }: Props) {
	return (
		<div className="flex items-center py-4">
			<Input
				placeholder="Filter Departments by name"
				startIcon={Search}
				value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
				onChange={(event) =>
					table.getColumn("name")?.setFilterValue(event.target.value)
				}
				className="w-full sm:max-w-xs "
			/>
		</div>
	);
}

export default DepartmentFilters;
