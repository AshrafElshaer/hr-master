import React from "react";
import { type UseFormReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { amPm } from "@/lib/date";
import { createEventSchema } from "../../validations";

import type { z } from "zod";
import type { EventWithOrganizerAndDepartment } from "@hr-toolkit/supabase/types";

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
import { DatePicker } from "@hr-toolkit/ui/date-picker";
import { Textarea } from "@hr-toolkit/ui/textarea";
import { Input } from "@hr-toolkit/ui/input";
import { DialogClose } from "@hr-toolkit/ui/dialog";
import { Button } from "@hr-toolkit/ui/button";
import { Loader } from "lucide-react";
import DepartmentSelector from "@/components/selectors/department-selector";
import { addDays } from "date-fns";

const timesOfDay = Array.from({ length: 24 }, (_, i) => {
	return `${i.toString().padStart(2, "0")}:00`;
});

type Props = {
	event?: EventWithOrganizerAndDepartment;
	onSubmit: (
		data: z.infer<typeof createEventSchema>,
		reset: UseFormReturn<z.infer<typeof createEventSchema>>["reset"],
	) => Promise<void>;
};

function EventForm({ event, onSubmit }: Props) {
	const form = useForm<z.infer<typeof createEventSchema>>({
		resolver: zodResolver(createEventSchema),
		defaultValues: {
			event_name: event?.event_name ?? "",
			event_description: event?.event_description ?? "",
			event_type: event?.event_type ?? "meeting",
			event_date:
				(event?.event_date &&
					addDays(new Date(event.event_date), 1).toString()) ??
				new Date().toString(),
			start_time: event?.start_time ?? "",
			end_time: event?.end_time ?? "",
			location: event?.location ?? "",
			department_id: event?.department_id ?? null,
		},
	});
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit((values) => onSubmit(values, form.reset))}
				className="space-y-4"
			>
				<div className="flex flex-col sm:flex-row items-center gap-4">
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
					<Button
						type="submit"
						disabled={form.formState.isSubmitting || !form.formState.isDirty}
					>
						{form.formState.isSubmitting ? (
							<Loader className=" mr-2 h-4 w-4 animate-spin" />
						) : null}
						{event ? "Save" : "Create"}
					</Button>
				</div>
			</form>
		</Form>
	);
}

export default EventForm;
