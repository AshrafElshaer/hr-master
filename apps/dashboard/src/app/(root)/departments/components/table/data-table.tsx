"use client";

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
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
import { useEffect, useState } from "react";
import type { DepartmentColumn } from "./columns";
import EditDepartmetn from "../edit-department";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@hr-toolkit/supabase/client";
import { getDepartments } from "@hr-toolkit/supabase/departments-queries";
import { useBoolean } from "usehooks-ts";

interface DataTableProps<TData, TValue> {
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
		setFalse: setIsEditFalse,
	} = useBoolean(false);
	const supabase = createClient();
	const { data: departments } = useQuery({
		queryKey: ["departments"],
		queryFn: () => getDepartments(supabase),
		initialData: data as DepartmentColumn[],
	});
	const [selectedDepartment, setSelectedDepartment] =
		useState<DepartmentColumn | null>(null);
	
	const table = useReactTable({
		data: departments as TData[],
		columns,
		getCoreRowModel: getCoreRowModel(),
		meta: {
			setSelectedDepartment,
			setIsEditTrue,
		},
	});
	// useEffect(() => {
	// 	console.log({
	// 		selectedDepartment,
	// 	});
	// }, [selectedDepartment]);

	return (
		<div className="rounded-md border w-full h-full">
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
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center">
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

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
		</div>
	);
}
