"use client";
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createEventSchema } from "../../validations";
import { createEventAction } from "../../actions";
import { toast } from "sonner";
import { amPm } from "@/lib/date";

import type { z } from "zod";

import {
	Dialog,
	DialogContent,
	DialogDescription,
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
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@hr-toolkit/ui/select";
import { Input } from "@hr-toolkit/ui/input";
import { Button } from "@hr-toolkit/ui/button";
import { CalendarPlus, Loader } from "lucide-react";
import { DatePicker } from "@hr-toolkit/ui/date-picker";

import { Textarea } from "@hr-toolkit/ui/textarea";
import DepartmentSelector from "@/components/selectors/department-selector";

function CreateEvent() {
	const [open, setOpen] = React.useState(false);
	const form = useForm<z.infer<typeof createEventSchema>>({
		resolver: zodResolver(createEventSchema),
		defaultValues: {
			event_name: "",
			event_description: "",
			event_type: "meeting",
			event_date: new Date().toString(),
			start_time: "",
			end_time: "",
			location: "",
			department_id: null,
		},
	});

	async function onSubmit(values: z.infer<typeof createEventSchema>) {
		const { serverError } = await createEventAction(values);

		if (serverError) {
			toast.error(serverError);
		} else {
			toast.success("Event created successfully");
			form.reset();
			setOpen(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="icon" variant={"outline"}>
					<CalendarPlus className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create new event</DialogTitle>
					<DialogDescription>
						Create a new event to be added to the calendar
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<div className="flex items-center gap-4">
							<FormField
								control={form.control}
								name="event_name"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>Event Name</FormLabel>
										<FormControl>
											<Input placeholder="Weekly Meeting" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="event_date"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>Event Date</FormLabel>
										<FormControl>
											<DatePicker
												className="w-full"
												date={new Date(field.value)}
												mode="single"
												onSelect={(date) => {
													field.onChange(date?.toString() ?? "");
												}}
												fromDate={new Date()}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="flex items-center gap-4">
							<FormField
								control={form.control}
								name="start_time"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>Start Time</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Event starts at" />
												</SelectTrigger>
											</FormControl>
											<SelectContent className="max-h-[200px] overflow-scroll scrollbar-muted">
												<SelectGroup>
													{timesOfDay.map((time) => (
														<SelectItem key={time} value={time}>
															{amPm(time)}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="end_time"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>End Time</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger disabled={!form.watch("start_time")}>
													<SelectValue placeholder="Event ends at" />
												</SelectTrigger>
											</FormControl>
											<SelectContent className="max-h-[200px] overflow-scroll scrollbar-muted">
												{timesOfDay
													.filter((time) => time > form.watch("start_time"))
													.map((time) => (
														<SelectItem key={time} value={time}>
															{amPm(time)}
														</SelectItem>
													))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="event_description"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormLabel>Event Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="This our weekly meeting where we discuss about the the project progress "
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex items-center gap-4">
							<FormField
								control={form.control}
								name="location"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>Event Location</FormLabel>
										<FormControl>
											<Input placeholder="Meeting room/chat" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="event_type"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>Event Type</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select Event Type" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="meeting">Meeting</SelectItem>
												<SelectItem value="conference">Conference</SelectItem>
												<SelectItem value="birthday">Birthday</SelectItem>
												<SelectItem value="anniversary">Anniversary</SelectItem>
											</SelectContent>
										</Select>
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
									<FormLabel>
										Department
										<span className="text-muted-foreground text-xs ml-2">
											{" "}
											(Optional)
										</span>
									</FormLabel>
									<FormControl>
										<DepartmentSelector
											value={field.value ?? ""}
											onChange={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex items-center gap-2 justify-end">
							<DialogClose asChild>
								<Button variant="outline">Cancel</Button>
							</DialogClose>
							<Button type="submit" disabled={form.formState.isSubmitting}>
								{form.formState.isSubmitting ? (
									<Loader className=" mr-2 h-4 w-4 animate-spin" />
								) : null}
								Create
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export default CreateEvent;

const timesOfDay = Array.from({ length: 24 }, (_, i) => {
	return `${i.toString().padStart(2, "0")}:00`;
});
