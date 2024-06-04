"use client";
import { useState } from "react";
import { cn } from "@hr-toolkit/ui/utils";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@hr-toolkit/supabase/client";
import { getDepartments } from "@hr-toolkit/supabase/departments-queries";
import { useBoolean } from "usehooks-ts";
import {
	type ColumnDef,
	type SortingState,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getSortedRowModel,
	getFilteredRowModel,
} from "@tanstack/react-table";

import type { DepartmentColumn } from "./columns";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@hr-toolkit/ui/table";

import EditDepartmetn from "../dialogs/edit-department";
import { DeleteDepartment } from "../dialogs/delete-department";
import DepartmentFilters from "./filters";
import { DataTablePagination } from "@/components/table-pagination";

export type TData = DepartmentColumn;

export interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const {
		value: isEdit,
		toggle: toggleIsEdit,
		setTrue: setIsEditTrue,
	} = useBoolean(false);
	const {
		value: isDelete,
		toggle: toggleIsDelete,
		setTrue: setIsDeleteTrue,
	} = useBoolean(false);
	const [selectedDepartment, setSelectedDepartment] =
		useState<DepartmentColumn | null>(null);

	const supabase = createClient();
	const { data: departments } = useQuery({
		queryKey: ["departments"],
		queryFn: () => getDepartments(supabase),
		initialData: data as DepartmentColumn[],
	});

	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	const table = useReactTable({
		data: departments as TData[],
		columns,
		getCoreRowModel: getCoreRowModel(),
		meta: {
			setSelectedDepartment,
			setIsEditTrue,
			setIsDeleteTrue,
		},
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters,
		},
	});

	return (
		<section className="w-full h-full flex flex-col">
			<DepartmentFilters table={table} />
			<div className="rounded-md border h-1 w-full flex-grow overflow-scroll  scrollbar-muted">
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
									className="h-8"
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
							<TableRow className="h-full hover:bg-background">
								<TableCell
									colSpan={columns.length}
									className="h-full text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination table={table} />
			<EditDepartmetn
				isEdit={isEdit}
				toggleIsEdit={toggleIsEdit}
				supabase={supabase}
				department={selectedDepartment}
				onClose={() => {
					toggleIsEdit();
					setTimeout(() => {
						setSelectedDepartment(null);
					}, 500);
				}}
			/>

			<DeleteDepartment
				department={{
					id: selectedDepartment?.id,
					name: selectedDepartment?.name,
				}}
				isDelete={isDelete}
				toggleIsDelete={toggleIsDelete}
				supabase={supabase}
				onClose={() => {
					toggleIsDelete();
					setTimeout(() => {
						setSelectedDepartment(null);
					}, 500);
				}}
			/>
		</section>
	);
}
