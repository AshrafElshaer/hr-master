"use client";

import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getFilteredRowModel,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@hr-toolkit/ui/table";
import { cn } from "@hr-toolkit/ui/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { UserWithDepartment } from "@hr-toolkit/supabase/types";
import { useBoolean } from "usehooks-ts";
import DeleteEmployee from "../dialogs/delete-employee";
import EmployeesFilters from "./filters";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const [selectedEmployee, setSelectedEmployee] =
		useState<UserWithDepartment | null>(null);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const {
		value: isDelete,
		setFalse: setIsDeleteFalse,
		setTrue: setIsDeleteTrue,
		toggle: toggleIsDelete,
	} = useBoolean(false);
	const router = useRouter();
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			// sorting,
			columnFilters,
		},
		meta: {
			setSelectedEmployee,
			setIsDeleteTrue,
		},
	});

	return (
		<section className="w-full flex flex-col flex-grow gap-2">
			<EmployeesFilters table={table} />
			<div className="rounded-md border w-full flex-grow overflow-x-scroll overflow-y-hidden scrollbar-muted">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id} className="bg-accent">
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											className={cn(header.id === "actions" && "w-8")}
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									className="h-8 cursor-pointer"
									onClick={() => {
										router.push(
											`/employees/${(row.original as { id: string }).id}`,
										);
									}}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="py-0">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
				<DeleteEmployee
					employee={selectedEmployee}
					isDelete={isDelete}
					toggleIsDelete={toggleIsDelete}
					onClose={() => {
						setSelectedEmployee(null);
						setIsDeleteFalse();
					}}
				/>
			</div>
		</section>
	);
}
