"use client";
import * as React from "react";

import { cn } from "@hr-toolkit/ui/utils";
import { useMediaQuery } from "usehooks-ts";
import { Button } from "@hr-toolkit/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@hr-toolkit/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@hr-toolkit/ui/drawer";
import { Input } from "@hr-toolkit/ui/input";
import { Label } from "@hr-toolkit/ui/label";
import { PlusIcon } from "lucide-react";

export function AddNewDepartment() {
	const [open, setOpen] = React.useState(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant={"outline"}>
						<PlusIcon className=" h-4 w-4 mr-2" />
						Add Department
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>New Department</DialogTitle>
						<DialogDescription>
							Add a new department to your organization.
						</DialogDescription>
					</DialogHeader>
					<NewDepartmentForm />
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button variant={"outline"}>
					<PlusIcon className=" h-4 w-4 mr-2" />
					Add Department
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>New Department</DrawerTitle>
					<DrawerDescription>
						Add a new department to your organization.
					</DrawerDescription>
				</DrawerHeader>
				<NewDepartmentForm className="px-4" />
				<DrawerFooter>
					<DrawerClose asChild>
						<Button variant="outline">Cancel</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@hr-toolkit/ui/form";

const departmentSchema = z.object({
	departmentName: z.string().min(2, {
		message: "Department name must be at least 2 characters long.",
	}),
	departmentDescription: z.string().min(5, {
		message: "Department description must be at least 5 characters long.",
	}),
});
function NewDepartmentForm({ className }: React.ComponentProps<"form">) {
	const form = useForm<z.infer<typeof departmentSchema>>({
		resolver: zodResolver(departmentSchema),
		defaultValues: {
			departmentName: "",
			departmentDescription: "",
		},
	});

	function onSubmit(values: z.infer<typeof departmentSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
	}
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className={cn("space-y-4", className)}
			>
				<FormField
					control={form.control}
					name="departmentName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Department Name</FormLabel>
							<FormControl>
								<Input placeholder="IT" {...field} />
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="departmentDescription"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Department Descriptipn</FormLabel>
							<FormControl>
								<Input placeholder="Information Technology" {...field} />
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" className="w-full">
					Submit
				</Button>
			</form>
		</Form>
	);
}
