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
import { Loader, PlusIcon } from "lucide-react";

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
					<NewDepartmentForm setOpen={setOpen} />
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
				<NewDepartmentForm setOpen={setOpen} className="px-4" />
				<DrawerFooter>
					<DrawerClose asChild>
						<Button variant="outline">Cancel</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

import type { z } from "zod";
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
import { departmentSchema } from "../../validation";
import { createNewDepartment } from "../../actions";
import { getAllManagers } from "@hr-toolkit/supabase/organization-queries";
import { toast } from "sonner";
import type { ReactSetState } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
} from "@hr-toolkit/ui/select";
import { ScrollArea } from "@hr-toolkit/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@hr-toolkit/supabase/client";
import { getUser } from "@hr-toolkit/supabase/user-queries";
import { Avatar, AvatarFallback, AvatarImage } from "@hr-toolkit/ui/avatar";

function NewDepartmentForm({
	className,
	setOpen,
}: React.ComponentProps<"form"> & { setOpen: ReactSetState<boolean> }) {
	const supabase = createClient();
	const { data: currentUser } = useQuery({
		queryKey: ["user"],
		queryFn: () => getUser(supabase),
	});

	const { data: organizationManagers, error: managersError } = useQuery({
		queryKey: ["managers"],
		queryFn: () => getAllManagers(supabase),
	});
	const form = useForm<z.infer<typeof departmentSchema>>({
		resolver: zodResolver(departmentSchema),
		defaultValues: {
			departmentName: "",
		},
	});

	async function onSubmit(values: z.infer<typeof departmentSchema>) {
	
		const {
			data: newDepartment,
			serverError,
			validationError,
		} = await createNewDepartment(values);

		if (serverError) {
			toast.error("An error occurred while creating the department.", {
				description: serverError,
			});
			return;
		}

		if (validationError) {
			toast.error("Validation error", {
				description:
					validationError.departmentDescription ||
					validationError.departmentName,
			});
			return;
		}

		if (newDepartment) {
			toast.success("Department created successfully.");
			setOpen(false);
		}
	}

	if (managersError) {
		toast.error(
			`An error occurred while getting organization managers : ${managersError.message}`,
		);
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
				<FormField
					control={form.control}
					name="personInCharge"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Person in Charge</FormLabel>
							<FormControl>
								<Select onValueChange={field.onChange} value={field.value}>
									<SelectTrigger className="w-full">
										<SelectValue
											placeholder="Select a person in charge"
											className="mx-auto"
										/>
									</SelectTrigger>
									<SelectContent>
										<ScrollArea className="max-h-[195px] w-full">
											<SelectGroup>
												<SelectLabel>Managers</SelectLabel>
												<SelectSeparator />
												{organizationManagers?.map((manager) => (
													<SelectItem
														key={manager.id}
														value={manager.id}
														className=" cursor-pointer"
													>
														{manager.fisrt_name} {manager.last_name}{" "}
														{manager.id === currentUser?.user?.id
															? "( Me )"
															: ""}
													</SelectItem>
												))}
											</SelectGroup>
										</ScrollArea>
									</SelectContent>
								</Select>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>
				<AnimatePresence mode="wait">
					<Button
						type="submit"
						className="w-full"
						disabled={form.formState.isSubmitting}
					>
						{form.formState.isSubmitting ? (
							<motion.span
								key="submitting"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.2 }}
								className="flex items-center"
							>
								<Loader className="h-4 w-4 mr-2 animate-spin" />
								creating ...
							</motion.span>
						) : (
							<motion.span
								key="submit"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.2 }}
							>
								Create Department
							</motion.span>
						)}
					</Button>
				</AnimatePresence>
			</form>
		</Form>
	);
}
