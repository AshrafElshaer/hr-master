"use client";
import React, { useEffect } from "react";
import * as dateFns from "date-fns";

import type * as RPNInput from "react-phone-number-input";

import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@hr-toolkit/ui/sheet";
import { Button } from "@hr-toolkit/ui/button";
import { PlusIcon, X } from "lucide-react";

export default function AddNewEmployee() {
	const [open, setOpen] = React.useState(false);
	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant="outline">
					<PlusIcon className=" h-4 w-4 mr-2" />
					Add Employee
				</Button>
			</SheetTrigger>
			<SheetContent className="flex flex-col w-full sm:max-w-lg">
				<SheetHeader className="mb-8">
					<section className="w-full flex items-center justify-between">
						<SheetTitle>New Employee</SheetTitle>
						<SheetClose>
							<X size={18} />
						</SheetClose>
					</section>
					<SheetDescription>
						Add a new employee to your organization.
					</SheetDescription>
				</SheetHeader>
				{/* <div className="h-full overflow-y-scroll scrollbar-muted"> */}
				<ScrollArea className="h-full p-4">
					<EmployeeForm setOpen={setOpen} />
				</ScrollArea>
				{/* </div> */}
			</SheetContent>
		</Sheet>
	);
}

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@hr-toolkit/ui/form";
import { Input } from "@hr-toolkit/ui/input";
import type { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createClient } from "@hr-toolkit/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { getDepartments } from "@hr-toolkit/supabase/departments-queries";
import { User } from "@/types";
import { employeeSchema } from "../../validation";
import { COUNTRIES } from "@/constants/countries";
import { CountrySelector } from "@/components/country-selector";
import { PhoneInputSimple } from "@/components/pnone-input";
import { DateOfBirthPicker } from "@hr-toolkit/ui/date-of-birth-picker";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@hr-toolkit/ui/select";
import { ScrollArea } from "@hr-toolkit/ui/scroll-area";
import { DatePicker } from "@hr-toolkit/ui/date-picker";
import { formatCurrency } from "@/lib/numbers";
import { createNeweEmployee } from "../../actions";
import { toast } from "sonner";

function EmployeeForm({
	setOpen,
}: {
	setOpen: (open: boolean) => void;
}) {
	const supabase = createClient();
	const { data: departments } = useQuery({
		queryKey: ["departments"],
		queryFn: () => getDepartments(supabase),
	});
	const form = useForm<z.infer<typeof employeeSchema>>({
		resolver: zodResolver(employeeSchema),
		defaultValues: {
			first_name: "",
			last_name: "",
			address: "",
			city: "",
			state: "",
			zip_code: "",
			country: "US",
			email: "",
			phone_number: "",
			date_of_birth: new Date(dateFns.subYears(new Date(), 18)),
			gender: "",
			department_id: "",
			position: "",
			role: "employee",
			hire_date: new Date(),
			salary: 0,
			employment_status: "active",
		},
	});

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof employeeSchema>) {
		const { data, serverError, validationError } =
			await createNeweEmployee(values);

		if (serverError) {
			toast.error(serverError);
			return;
		}
		toast.success("Employee added successfully", {
			description:
				"Email has been sent to the employee with the login details.",
		});

		setOpen(false);
		console.log(values);
	}
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<div className="w-full flex flex-col sm:flex-row items-center gap-4">
					<FormField
						control={form.control}
						name="first_name"
						render={({ field }) => (
							<FormItem className="w-full">
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
							<FormItem className="w-full">
								<FormLabel>Last Name</FormLabel>
								<FormControl>
									<Input placeholder="Doe" {...field} />
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<FormField
					control={form.control}
					name="address"
					render={({ field }) => (
						<FormItem className="w-full">
							<FormLabel>Address</FormLabel>
							<FormControl>
								<Input placeholder="123 Main st #112" {...field} />
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="w-full flex flex-col sm:flex-row items-center gap-4">
					<FormField
						control={form.control}
						name="city"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>City</FormLabel>
								<FormControl>
									<Input placeholder="Austin" {...field} />
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="state"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>State</FormLabel>
								<FormControl>
									<Input placeholder="Texas" {...field} />
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="w-full flex flex-col sm:flex-row items-center gap-4">
					<FormField
						control={form.control}
						name="zip_code"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>Zip Code</FormLabel>
								<FormControl>
									<Input placeholder="75987" inputMode="numeric" {...field} />
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="country"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>Country</FormLabel>
								<FormControl>
									<CountrySelector
										value={field.value as RPNInput.Country}
										onChange={(val) => field.onChange(val as RPNInput.Country)}
										options={COUNTRIES}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="w-full flex flex-col sm:flex-row items-center gap-4">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										placeholder="example@domain.com"
										inputMode="email"
										{...field}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="phone_number"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>Phone Number</FormLabel>
								<FormControl>
									<PhoneInputSimple
										value={field.value as RPNInput.Value}
										onChange={(value) => {
											field.onChange(value);
										}}
										defaultCountry={form.watch("country") as RPNInput.Country}
										placeholder="(214) 876-7876"
										disabled={!form.getValues().country}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="w-full flex flex-col sm:flex-row items-center gap-4">
					<FormField
						control={form.control}
						name="date_of_birth"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>Date Of Birth</FormLabel>
								<FormControl>
									<DateOfBirthPicker
										date={field.value}
										onSelect={field.onChange}
										className="w-full"
										toDate={new Date(dateFns.subYears(new Date(), 18))}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="gender"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>Gender</FormLabel>
								<FormControl>
									<Select onValueChange={field.onChange} value={field.value}>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select a gender" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="male">Male</SelectItem>
											<SelectItem value="female">Female</SelectItem>
										</SelectContent>
									</Select>
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
										{/*  TODO: Fetch departments from the server */}
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

				<div className="w-full flex flex-col sm:flex-row items-center gap-4">
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
						name="role"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>Role</FormLabel>
								<FormControl>
									<Select onValueChange={field.onChange} value={field.value}>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select a role" />
										</SelectTrigger>
										<SelectContent side="top">
											<SelectItem value="manager">Manager</SelectItem>
											<SelectItem value="employee">Employee</SelectItem>
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="w-full flex flex-col sm:flex-row items-center gap-4">
					<FormField
						control={form.control}
						name="hire_date"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>Hire Date</FormLabel>
								<FormControl>
									<DatePicker
										className="w-full"
										mode="single"
										date={field.value}
										onSelect={field.onChange}
										fromDate={new Date()}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="salary"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>Salary</FormLabel>
								<FormControl>
									<Input
										placeholder="$100,000"
										inputMode="numeric"
										{...field}
										value={
											field.value ? formatCurrency(field.value.toString()) : ""
										}
										onChange={(e) =>
											field.onChange(
												Number(e.target.value.replace(/[^0-9.]/g, "")),
											)
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<Button type="submit" className="w-full">
					<PlusIcon className=" h-4 w-4 mr-2" />
					{form.watch("first_name") && form.watch("last_name")
						? `Add ${form.watch("first_name")} ${form.watch("last_name")}`
						: "Add Employee"}
				</Button>
			</form>
		</Form>
	);
}
