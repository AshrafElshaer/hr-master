"use client";
import React from "react";
import type { UserWithDepartment } from "@hr-toolkit/supabase/types";
import { Card, CardContent, CardHeader } from "@hr-toolkit/ui/card";
import { Loader, MapPin, Pencil } from "lucide-react";

import { capitalize } from "lodash";
import countryLookup from "country-code-lookup";

type Props = {
	employee: UserWithDepartment;
};

export default function Address({ employee }: Props) {
	return (
		<Card className="w-full p-4 flex-grow  flex flex-col gap-8">
			<CardHeader className="p-0 flex-row items-center gap-2 font-bold">
				<MapPin size={18} />
				<span>Address</span>
				<EditAddress employee={employee} />
			</CardHeader>
			<CardContent className="p-0">
				<div className="flex flex-col gap-4 lg:flex-row">
					<div className="w-full flex flex-col justify-between gap-4">
						<div className="flex items-center gap-4">
							<span className="font-semibold text-secondary-foreground/80 text-sm">
								Primary Address -
							</span>
							<span>{employee.address}</span>
						</div>

						<div className="flex items-center gap-4">
							<span className="font-semibold text-secondary-foreground/80 text-sm">
								Country -
							</span>
							{employee.country ? (
								<span>
									{countryLookup.byIso(employee.country)?.country ??
										"Not Available"}
								</span>
							) : (
								<span>Not Available</span>
							)}
						</div>
						<div className="flex items-center gap-4">
							<span className="font-semibold text-secondary-foreground/80 text-sm">
								State -
							</span>
							<span>{capitalize(employee.state ?? "")}</span>
						</div>
					</div>
					<div className="w-full flex flex-col  gap-4">
						<div className="flex items-center gap-4">
							<span className="font-semibold text-secondary-foreground/80 text-sm">
								City -
							</span>
							<span>{capitalize(employee.city ?? "")}</span>
						</div>
						<div className="flex items-center gap-4">
							<span className="font-semibold text-secondary-foreground/80 text-sm">
								Zip Code -
							</span>
							{employee.zip_code ? (
								<span>{employee.zip_code}</span>
							) : (
								<span>Not Available</span>
							)}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeSchema } from "../../../../validation";

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

import { motion, AnimatePresence } from "framer-motion";

import { updateEmployee } from "../../../../actions";
import { toast } from "sonner";
import { CountrySelector } from "@/components/country-selector";
import { COUNTRIES } from "@/constants/countries";

const formSchema = employeeSchema.pick({
	address: true,
	city: true,
	state: true,
	country: true,
	zip_code: true,
});

function EditAddress({ employee }: Props) {
	const [open, setOpen] = React.useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			address: employee.address ?? "",
			city: employee.city ?? "",
			state: employee.state ?? "",
			country: employee.country ?? "",
			zip_code: employee.zip_code ?? "",
		},
	});

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
						Edit {employee.first_name}'s Address
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<div className="flex  items-center gap-4">
							<FormField
								control={form.control}
								name="address"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>Primary Address</FormLabel>
										<FormControl>
											<Input placeholder="123 Main st" {...field} />
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex  items-center gap-4">
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
						<div className="flex  items-center gap-4">
							<FormField
								control={form.control}
								name="zip_code"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>Zip Code</FormLabel>
										<FormControl>
											<Input placeholder="75070" {...field} />
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
												onChange={(val) =>
													field.onChange(val as RPNInput.Country)
												}
												options={COUNTRIES}
											/>
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
