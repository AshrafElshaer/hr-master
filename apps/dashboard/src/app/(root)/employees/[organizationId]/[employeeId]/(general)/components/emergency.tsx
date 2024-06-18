"use client";
import React from "react";
import type { UserWithDepartment } from "@hr-toolkit/supabase/types";
import { Card, CardContent, CardHeader } from "@hr-toolkit/ui/card";
import { Loader, Pencil, Zap } from "lucide-react";
import { capitalize } from "lodash";

type Props = {
	employee: UserWithDepartment;
};

export default function Emergency({ employee }: Props) {
	return (
		<Card className="w-full p-4 flex-grow flex flex-col gap-8">
			<CardHeader className="p-0 flex-row items-center gap-2 font-bold">
				<Zap size={18} />
				<span>Emergency Contact</span>
				<EditEmergencyContact employee={employee} />
			</CardHeader>
			<CardContent className="p-0">
				<div className="flex flex-col gap-4 lg:flex-row">
					<div className="w-full flex flex-col justify-between gap-4">
						<div className="flex items-center gap-4">
							<span className="font-semibold text-secondary-foreground/80 text-sm">
								Full Name -
							</span>
							<span>{employee.emergency_name}</span>
						</div>

						<div className="flex items-center gap-4">
							<span className="font-semibold text-secondary-foreground/80 text-sm">
								Relation -
							</span>

							<span>{employee.emergency_relation}</span>
						</div>
					</div>
					<div className="w-full flex flex-col  gap-4">
						<div className="flex items-center gap-4">
							<span className="font-semibold text-secondary-foreground/80 text-sm">
								Phone Number -
							</span>
							<span>{employee.emergency_phone_number}</span>
						</div>
						<div className="flex items-center gap-4">
							<span className="font-semibold text-secondary-foreground/80 text-sm">
								Email -
							</span>

							<span>{employee.emergency_email}</span>
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
import { PhoneInputSimple } from "@/components/phone-input";

const formSchema = employeeSchema.pick({
	emergency_name: true,
	emergency_relation: true,
	emergency_email: true,
	emergency_phone_number: true,
});

function EditEmergencyContact({ employee }: Props) {
	const [open, setOpen] = React.useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			emergency_name: employee.emergency_name ?? "",
			emergency_relation: employee.emergency_relation ?? "",
			emergency_email: employee.emergency_email ?? "",
			emergency_phone_number: employee.emergency_phone_number ?? "",
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
						Edit {employee.first_name}'s Emergency Contact
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<div className="flex  items-center gap-4">
							<FormField
								control={form.control}
								name="emergency_name"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>Full Name</FormLabel>
										<FormControl>
											<Input placeholder="John Doe" {...field} />
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="emergency_relation"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>Relationship</FormLabel>
										<FormControl>
											<Input placeholder="Brother" {...field} />
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex  items-center gap-4">
							<FormField
								control={form.control}
								name="emergency_email"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input placeholder="example@domain.com" {...field} />
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="emergency_phone_number"
								render={({ field }) => (
									<FormItem className="w-full">
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
