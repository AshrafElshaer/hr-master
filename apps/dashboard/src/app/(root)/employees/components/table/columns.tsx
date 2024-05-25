"use client";

import type { ReactSetState } from "@/types";
import type { UserWithDepartment as Employee } from "@hr-toolkit/supabase/types";
import { Badge } from "@hr-toolkit/ui/badge";
import { Button } from "@hr-toolkit/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@hr-toolkit/ui/dropdown-menu";
import type { ColumnDef, TableMeta } from "@tanstack/react-table";
import { capitalize } from "lodash";
import { MoreHorizontal, PencilLine, Trash } from "lucide-react";

type EmployeeMeta = TableMeta<Employee> & {
	setSelectedDepartment: ReactSetState<Employee | null>;
	setIsEditTrue: () => void;
	setIsDeleteTrue: () => void;
};

export const columns: ColumnDef<Employee>[] = [
	{
		accessorKey: "first_name",
		header: () => <div className="min-w-28 ">Name</div>,
		cell({ row }) {
			return `${row.original.first_name} ${row.original.last_name}`;
		},
	},
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		accessorKey: "department",
		header: "Department",
		cell({ row }) {
			return row.original.department?.name ?? "No Department";
		},
	},
	{
		accessorKey: "position",
		header: () => <div className="min-w-28 "> Job Tilte</div>,
	},
	{
		accessorKey: "employment_status",
		header: () => <div className="w-full text-center">Status</div>,
		cell({ row }) {
			const emplymentStatus = row.original.employment_status;
			return (
				<div className="w-full grid place-items-center">
					<Badge
						variant={
							emplymentStatus === "active"
								? "success"
								: emplymentStatus === "on-hold"
									? "warning"
									: "default"
						}
					>
						{capitalize(emplymentStatus ?? "")}
					</Badge>
				</div>
			);
		},
	},
	{
		id: "actions",
		header: () => <span className="sr-only w-8">Actions</span>,
		cell: ({ row, table }) => {
			const employee = row.original;
			const tableMeta = table.options.meta as EmployeeMeta;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="p-0" size="icon">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem
							onClick={() => {}}
							className="flex items-center gap-2"
						>
							<PencilLine size={16} />
							Edit
						</DropdownMenuItem>

						<DropdownMenuItem
							onClick={() => {
								tableMeta.setSelectedDepartment(employee);
								tableMeta.setIsDeleteTrue();
							}}
							className="flex items-center gap-2"
						>
							<Trash size={16} />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
