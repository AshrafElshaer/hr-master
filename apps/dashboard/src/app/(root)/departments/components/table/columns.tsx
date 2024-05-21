"use client";

import type { ColumnDef, TableMeta } from "@tanstack/react-table";
import type { Database } from "@hr-toolkit/supabase/types";
import type { ReactSetState, User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@hr-toolkit/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@hr-toolkit/ui/dropdown-menu";
import { Button } from "@hr-toolkit/ui/button";
import { MoreHorizontal, PencilLine, Trash } from "lucide-react";

type DepartmentColumnMeta = TableMeta<DepartmentColumn> & {
	setSelectedDepartment: ReactSetState<DepartmentColumn | null>;
	setIsEditTrue: () => void;
};

type Department = Database["public"]["Tables"]["departments"]["Row"];

export interface DepartmentColumn extends Department {
	person_in_charge: User[];
}

export const columns: ColumnDef<DepartmentColumn>[] = [
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "description",
		header: "Description",
	},
	{
		accessorKey: "person_in_charge",
		header: "Manager In Charge",
		cell({ row }) {
			const user: User = row.getValue("person_in_charge");
			return (
				<div className="flex items-center gap-2">
					<Avatar className="h-5 w-5">
						<AvatarImage src={user?.avatar_url ?? undefined} />
						<AvatarFallback className="text-xs">
							{user?.fisrt_name ? user?.fisrt_name[0] : ""}
							{user?.last_name ? user?.last_name[0] : ""}
						</AvatarFallback>
					</Avatar>
					{user?.fisrt_name} {user?.last_name}
				</div>
			);
		},
	},
	{
		accessorKey: "employees_count",
		header: () => <div className="text-center w-full">Count</div>,
		cell: ({ row }) => (
			<div className="text-center w-full">
				{row.getValue("employees_count")}
			</div>
		),
	},
	{
		id: "actions",
		header: () => <span className="sr-only">Actions</span>,
		cell: ({ row, table }) => {
			const department = row.original;
			const tableMeta: DepartmentColumnMeta = table.options
				.meta as DepartmentColumnMeta;


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
							onClick={() => {
								tableMeta.setSelectedDepartment(department);
								tableMeta.setIsEditTrue();
							}}
							className="flex items-center gap-2"
						>
							<PencilLine size={16} />
							Edit
						</DropdownMenuItem>

						<DropdownMenuItem
							// onClick={() => tableMeta.setDeleteDepartment(department)}
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
