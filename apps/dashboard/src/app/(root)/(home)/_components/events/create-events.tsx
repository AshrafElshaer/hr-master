"use client";
import React from "react";

import type { UseFormReturn } from "react-hook-form";
import { createEventAction } from "../../actions";
import { toast } from "sonner";

import type { z } from "zod";
import type { createEventSchema } from "../../validations";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@hr-toolkit/ui/dialog";
import { Button } from "@hr-toolkit/ui/button";
import { CalendarPlus } from "lucide-react";

import EventForm from "./event-form";

export default function CreateEvent() {
	const [open, setOpen] = React.useState(false);

	async function onSubmit(
		values: z.infer<typeof createEventSchema>,
		resetForm: UseFormReturn<z.infer<typeof createEventSchema>>["reset"],
	) {
		const { serverError } = await createEventAction(values);

		if (serverError) {
			toast.error(serverError);
		} else {
			toast.success("Event created successfully");
			resetForm();
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
				<EventForm onSubmit={onSubmit} />
			</DialogContent>
		</Dialog>
	);
}
