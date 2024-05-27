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
				<PopoverContent align="end" className="w-[450px] h-[200px] p-0">
					<Tabs defaultValue="account" className="w-full flex gap-4 h-full">
						<TabsList className="flex-col justify-start h-full bg-transparent w-1/4  ">
							<TabsTrigger
								value="department"
								className="data-[state=active]:bg-accent w-full justify-start"
							>
								Department
								<ChevronRight size={16} className="ml-auto" />
							</TabsTrigger>
							<TabsTrigger
								value="role"
								className="data-[state=active]:bg-accent w-full justify-start"
							>
								Role
								<ChevronRight size={16} className="ml-auto" />
							</TabsTrigger>
							<TabsTrigger
								value="status"
								className="data-[state=active]:bg-accent w-full justify-start"
							>
								Status
								<ChevronRight size={16} className="ml-auto" />
							</TabsTrigger>
						</TabsList>
						<TabsContent value="department">
							Make changes to your department here.
						</TabsContent>
						<TabsContent value="role">Change your role here.</TabsContent>
						<TabsContent value="status">Change your status here.</TabsContent>
					</Tabs>
				</PopoverContent>
			</Popover>
		</section>
	);
}
