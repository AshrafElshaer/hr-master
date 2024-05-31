"use client";
import type { UserWithDepartment } from "@hr-toolkit/supabase/types";
import React from "react";
import { Card } from "@hr-toolkit/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@hr-toolkit/ui/avatar";
import { Badge } from "@hr-toolkit/ui/badge";
import { capitalize } from "lodash";
import { Loader, Mail, Pencil, Phone } from "lucide-react";
import { Separator } from "@hr-toolkit/ui/separator";

type Props = {
	employee: UserWithDepartment;
};

export default function BasicInfo({ employee }: Props) {
	return (
		<Card className="w-full p-4 flex-grow sm:w-1/3 min-w-fit">
			<div className="flex justify-e">
				<EditBasic employee={employee} />
			</div>
			<div className="w-full flex flex-col items-center justify-start gap-2">
				<Avatar className="w-20 h-20 mb-4">
					<AvatarImage src={employee?.avatar_url ?? ""} />
					<AvatarFallback className="text-4xl">
						{employee?.first_name?.[0]}
						{employee?.last_name?.[0]}
					</AvatarFallback>
				</Avatar>
				<h2 className="font-bold text-lg">
					{employee?.first_name} {employee?.last_name}
				</h2>

				<span className="text-secondary-foreground/60 mb-2">
					{employee?.position}
				</span>
				<Badge
					variant={
						employee?.employment_status === "active"
							? "success"
							: employee?.employment_status === "on-hold"
								? "warning"
								: "destructive"
					}
				>
					{capitalize(employee?.employment_status ?? "")}
				</Badge>
			</div>

			<Separator className="my-5" />

			<div className="flex flex-col gap-2 *:flex *:items-center *:gap-2">
				<span>
					{" "}
					<Mail size={20} /> {employee?.email}
				</span>
				<span>
					<Phone size={20} />
					{employee?.phone_number}
				</span>
			</div>
			<Separator className="my-5" />
			<div className="flex flex-col gap-4 mb-8">
				<h3 className="font-semibold text-base text-secondary-foreground/60">
					Department
				</h3>
				<span className="text-xm">
					{employee?.department?.name} - {employee?.department?.description}
				</span>
			</div>
			<div className="flex flex-col gap-4">
				<h3 className="font-semibold text-base text-secondary-foreground/60">
					Manager
				</h3>
				<span>
					{employee?.department?.person_in_charge.first_name}{" "}
					{employee?.department?.person_in_charge.last_name}
				</span>
			</div>
		</Card>
	);
}

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeSchema } from "../../../validation";
import { createClient } from "@hr-toolkit/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { getDepartments } from "@hr-toolkit/supabase/departments-queries";
import { cn } from "@hr-toolkit/ui/utils";

import type * as RPNInput from "react-phone-number-input";
import type { z } from "zod";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from "@hr-toolkit/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@hr-toolkit/ui/form";
import { Button, buttonVariants } from "@hr-toolkit/ui/button";
import { Input } from "@hr-toolkit/ui/input";
import { PhoneInputSimple } from "@/components/pnone-input";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@hr-toolkit/ui/select";
import { motion, AnimatePresence } from "framer-motion";

import { updateEmployee } from "../../../actions";
import { toast } from "sonner";

const formSchema = employeeSchema.pick({
	first_name: true,
	last_name: true,
	email: true,
	phone_number: true,
	position: true,
	employment_status: true,
	department_id: true,
});

function EditBasic({ employee }: Props) {
	const [open, setOpen] = React.useState(false);
	const supabase = createClient();
	const { data: departments } = useQuery({
		queryKey: ["departments"],
		queryFn: () => getDepartments(supabase),
	});
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			first_name: employee.first_name ?? "",
			last_name: employee.last_name ?? "",
			email: employee.email ?? "",
			phone_number: employee.phone_number ?? "",
			position: employee.position ?? "",
			employment_status: employee.employment_status as z.infer<
				typeof formSchema
			>["employment_status"],
			department_id: employee.department_id ?? "",
		},
	});

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof formSchema>) {
		const { serverError } = await updateEmployee({
			...values,
			id: employee.id,
		});
		if (serverError) {
			return toast.error(serverError);
		}

		toast.success("Employee updated successfully");
		setOpen(false);
	}
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className="ml-auto text-accent-foreground/70 hover:text-accent-foreground transition-colors">
				<Pencil size={18} />
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-center">
						Edit {employee.first_name} Info
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<div className="flex items-center gap-4">
							<FormField
								control={form.control}
								name="first_name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>First Name</FormLabel>
										<FormControl>
											<Input placeholder="John" {...field} />
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="last_name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Last Name</FormLabel>
										<FormControl>
											<Input placeholder="Doe" {...field} />
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex items-center gap-4">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input placeholder="example@domain.com" disabled {...field} />
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="phone_number"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone Number</FormLabel>
										<FormControl>
											<PhoneInputSimple
												value={field.value as RPNInput.Value}
												onChange={(value) => {
													field.onChange(value);
												}}
												defaultCountry={employee.country as RPNInput.Country}
												placeholder="(214) 876-7876"
											/>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="department_id"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormLabel>Department</FormLabel>
									<FormControl>
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Select a department" />
											</SelectTrigger>
											<SelectContent>
												{departments?.map((department) => (
													<SelectItem key={department.id} value={department.id}>
														{department.name}
														{department?.description
															? ` - ${department.description}`
															: ""}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex items-center gap-4">
							<FormField
								control={form.control}
								name="position"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>Position</FormLabel>
										<FormControl>
											<Input placeholder="Software Engineer" {...field} />
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="employment_status"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>Employment Status</FormLabel>
										<FormControl>
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select a status" />
												</SelectTrigger>
												<SelectContent side="top">
													<SelectItem value="active">Active</SelectItem>
													<SelectItem value="on-hold">On Hold</SelectItem>
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Button
							type="submit"
							className="w-full"
							disabled={form.formState.isSubmitting || !form.formState.isValid}
						>
							<AnimatePresence mode="wait" initial={false}>
								{form.formState.isSubmitting ? (
									<motion.span
										key="submitting"
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										className="flex items-center justify-center"
									>
										<Loader className="h-4 w-4 mr-2 animate-spin" />
										Saving ...
									</motion.span>
								) : (
									<motion.span
										key="submit"
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
									>
										Save
									</motion.span>
								)}
							</AnimatePresence>
						</Button>
						<DialogClose
							className={cn(
								buttonVariants({
									variant: "outline",
									className: "w-full",
								}),
							)}
						>
							Cancel
						</DialogClose>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
