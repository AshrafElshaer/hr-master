import { Button } from "@hr-toolkit/ui/button";
import { Input } from "@hr-toolkit/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
	PopoverContentWithoutPortal,
} from "@hr-toolkit/ui/popover";
import type { Table } from "@tanstack/react-table";
import { ChevronRight, Filter, Search } from "lucide-react";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@hr-toolkit/ui/tabs";

type Props = {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	table: Table<any>;
};

export default function EmployeesFilters({ table }: Props) {
	return (
		<section className="flex justify-between items-center gap-4">
			<Input
				placeholder="Filter By Name ..."
				className="w-full sm:w-52"
				startIcon={Search}
				value={
					(table.getColumn("first_name")?.getFilterValue() as string) ?? ""
				}
				onChange={(event) =>
					table.getColumn("first_name")?.setFilterValue(event.target.value)
				}
			/>
			<Popover>
				<PopoverTrigger>
					<Button variant="outline" size="icon">
						<Filter size={16} />
					</Button>
				</PopoverTrigger>
				<PopoverContent
					align="end"
					className="w-[380px]  sm:w-[500px] h-[200px] p-0"
					// alignOffset={-10}
				>
					<Tabs defaultValue="account" className="w-full flex gap-4 h-full">
						<TabsList className="flex-col justify-start h-full bg-transparent ">
							<TabsTrigger
								value="department"
								className="data-[state=active]:bg-accent justify-start  w-[8.5rem] gap-2 group"
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
							>
								Status
								<ChevronRight
									size={16}
									className="ml-auto hidden group-data-[state=active]:block"
								/>
							</TabsTrigger>
						</TabsList>
						<TabsContent value="department" className="w-full pr-2">
							to your department here. to your department here.to your department here.
						</TabsContent>
						<TabsContent value="role" className="w-full">
							Change your role here.
						</TabsContent>
						<TabsContent value="status" className="w-full">
							Change your status here.
						</TabsContent>
					</Tabs>
				</PopoverContent>
			</Popover>
		</section>
	);
}
