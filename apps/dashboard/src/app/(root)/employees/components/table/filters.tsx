import { Button, buttonVariants } from "@hr-toolkit/ui/button";
import { Input } from "@hr-toolkit/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@hr-toolkit/ui/popover";
import type { Table } from "@tanstack/react-table";
import { ChevronRight, Filter, Search, X } from "lucide-react";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@hr-toolkit/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@hr-toolkit/supabase/client";
import { getDepartments } from "@hr-toolkit/supabase/departments-queries";
import { Checkbox } from "@hr-toolkit/ui/checkbox";
import { cn } from "@hr-toolkit/ui/utils";
import { capitalize } from "lodash";

type Props = {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	table: Table<any>;
};

export default function EmployeesFilters({ table }: Props) {
	const supabase = createClient();
	const [activeTab, setActiveTab] = React.useState("department");
	const [open, setOpen] = React.useState(false);
	const { data: departments } = useQuery({
		queryKey: ["departments"],
		queryFn: () => getDepartments(supabase),
	});

	const departmentFilter = table.getColumn("department")?.getFilterValue();
	const statusFilter = table.getColumn("employment_status")?.getFilterValue();
	const roleFilter = table.getColumn("role")?.getFilterValue();

	function clearFilter(column: string) {
		table.getColumn(column)?.setFilterValue("");
	}
	return (
		<section className="w-full flex flex-col gap-2">
			<div className="flex justify-start items-center gap-2">
				<div className="w-full sm:w-40 mr-auto">
					<Input
						placeholder="Filter By Name ..."
						startIcon={Search}
						value={
							(table.getColumn("first_name")?.getFilterValue() as string) ?? ""
						}
						onChange={(event) =>
							table.getColumn("first_name")?.setFilterValue(event.target.value)
						}
					/>
				</div>

				<div className="hidden sm:flex gap-2">
					{statusFilter ? (
						<div
							className={cn(
								buttonVariants({
									variant: "secondary",
								}),
							)}
						>
							<X
								size={14}
								className="mr-2 cursor-pointer"
								onClick={() => clearFilter("employment_status")}
							/>
							<Button
								variant="ghost"
								className="p-0"
								onClick={() => {
									!open ? setOpen(true) : null;
									setActiveTab("status");
								}}
							>
								{capitalize(statusFilter as string)}
							</Button>
						</div>
					) : null}
					{roleFilter ? (
						<div
							className={cn(
								buttonVariants({
									variant: "secondary",
								}),
							)}
						>
							<X
								size={14}
								className="mr-2 cursor-pointer"
								onClick={() => clearFilter("role")}
							/>
							<Button
								variant="ghost"
								className="p-0"
								onClick={() => {
									!open ? setOpen(true) : null;
									setActiveTab("role");
								}}
							>
								{capitalize(roleFilter as string)}
							</Button>
						</div>
					) : null}
					{departmentFilter ? (
						<div
							className={cn(
								buttonVariants({
									variant: "secondary",
								}),
							)}
						>
							<X
								size={14}
								className="mr-2 cursor-pointer"
								onClick={() => clearFilter("department")}
							/>
							<Button
								variant="ghost"
								className="p-0"
								onClick={() => {
									!open ? setOpen(true) : null;
									setActiveTab("department");
								}}
							>
								{departmentFilter as string}
							</Button>
						</div>
					) : null}
				</div>
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger>
						<Button variant="outline" size="icon">
							<Filter size={16} />
						</Button>
					</PopoverTrigger>
					<PopoverContent
						align="end"
						className="w-[380px]  sm:w-[500px] h-[200px] p-0"
					>
						<Tabs
							defaultValue="department"
							className="w-full flex gap-4 h-full"
							value={activeTab}
						>
							<TabsList className="flex-col justify-start h-full bg-transparent py-2">
								<TabsTrigger
									value="department"
									className="data-[state=active]:bg-accent justify-start  w-[8.5rem] gap-2 group"
									onClick={() => setActiveTab("department")}
								>
									Department
									<ChevronRight
										size={16}
										className="ml-auto hidden group-data-[state=active]:block"
									/>
								</TabsTrigger>
								<TabsTrigger
									value="role"
									className="data-[state=active]:bg-accent w-[8.5rem] justify-start group"
									onClick={() => setActiveTab("role")}
								>
									Role
									<ChevronRight
										size={16}
										className="ml-auto hidden group-data-[state=active]:block"
									/>
								</TabsTrigger>
								<TabsTrigger
									value="status"
									className="data-[state=active]:bg-accent w-[8.5rem] justify-start group"
									onClick={() => setActiveTab("status")}
								>
									Status
									<ChevronRight
										size={16}
										className="ml-auto hidden group-data-[state=active]:block"
									/>
								</TabsTrigger>
							</TabsList>
							<TabsContent value="department" className="w-full pr-2 space-y-4 py-2">
								{departments?.map((department) => {
									const isChecked = departmentFilter === department.name;
									return (
										<div
											key={department.id}
											className="flex items-center gap-2"
										>
											<Checkbox
												key={department.id}
												id={department.id}
												checked={isChecked}
												onCheckedChange={() =>
													isChecked
														? table.getColumn("department")?.setFilterValue("")
														: table
																.getColumn("department")
																?.setFilterValue(department.name)
												}
											/>
											<label
												htmlFor={department.id}
												className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
											>
												{department.name} - {department?.description}
											</label>
										</div>
									);
								})}
							</TabsContent>
							<TabsContent value="role" className="w-full space-y-4 py-2">
								{["owner", "manager", "employee"].map((role) => {
									const isChecked = roleFilter === role;
									return (
										<div key={role} className="flex items-center gap-2">
											<Checkbox
												key={role}
												id={role}
												checked={isChecked}
												onCheckedChange={() =>
													isChecked
														? table.getColumn("role")?.setFilterValue("")
														: table.getColumn("role")?.setFilterValue(role)
												}
											/>
											<label
												htmlFor={role}
												className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
											>
												{capitalize(role)}
											</label>
										</div>
									);
								})}
							</TabsContent>
							<TabsContent value="status" className="w-full space-y-4 py-2">
								{["active", "on-hold"].map((status) => {
									const isChecked = statusFilter === status;
									return (
										<div key={status} className="flex items-center gap-2">
											<Checkbox
												key={status}
												id={status}
												checked={isChecked}
												onCheckedChange={() =>
													isChecked
														? table
																.getColumn("employment_status")
																?.setFilterValue("")
														: table
																.getColumn("employment_status")
																?.setFilterValue(status)
												}
											/>
											<label
												htmlFor={status}
												className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
											>
												{capitalize(status)}
											</label>
										</div>
									);
								})}
							</TabsContent>
						</Tabs>
					</PopoverContent>
				</Popover>
			</div>
			<div className="flex sm:hidden gap-2 justify-end">
				{statusFilter ? (
					<div
						className={cn(
							buttonVariants({
								variant: "secondary",
								className: statusFilter === "active" ? "" : "min-w-28",
							}),
						)}
					>
						<X
							size={14}
							className="mr-2 cursor-pointer"
							onClick={() => clearFilter("employment_status")}
						/>
						<Button
							variant="ghost"
							className="p-0"
							onClick={() => {
								!open ? setOpen(true) : null;
								setActiveTab("status");
							}}
						>
							{capitalize(statusFilter as string)}
						</Button>
					</div>
				) : null}
				{roleFilter ? (
					<div
						className={cn(
							buttonVariants({
								variant: "secondary",
							}),
						)}
					>
						<X
							size={14}
							className="mr-2 cursor-pointer"
							onClick={() => clearFilter("role")}
						/>
						<Button
							variant="ghost"
							className="p-0"
							onClick={() => {
								!open ? setOpen(true) : null;
								setActiveTab("role");
							}}
						>
							{capitalize(roleFilter as string)}
						</Button>
					</div>
				) : null}
				{departmentFilter ? (
					<div
						className={cn(
							buttonVariants({
								variant: "secondary",
							}),
						)}
					>
						<X
							size={14}
							className="mr-2 cursor-pointer"
							onClick={() => clearFilter("department")}
						/>
						<Button
							variant="ghost"
							className="p-0"
							onClick={() => {
								!open ? setOpen(true) : null;
								setActiveTab("department");
							}}
						>
							{departmentFilter as string}
						</Button>
					</div>
				) : null}
			</div>
		</section>
	);
}
