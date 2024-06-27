"use client";
import React from "react";

import { createEventAction, updateEventAction } from "../../actions";
import { toast } from "sonner";

import type { z } from "zod";
import type { createEventSchema } from "../../validations";
import type { UseFormReturn } from "react-hook-form";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@hr-toolkit/ui/dialog";

import EventForm from "./event-form";
import { Pencil } from "lucide-react";
import type { EventWithOrganizerAndDepartment } from "@hr-toolkit/supabase/types";
import { format } from "date-fns";

type Props = {
	event: EventWithOrganizerAndDepartment;
	open: boolean;
	setOpen: (open: boolean) => void;
};

export default function EditEvent({ event, open, setOpen }: Props) {
	async function onSubmit(
		values: z.infer<typeof createEventSchema>,
		resetForm: UseFormReturn<z.infer<typeof createEventSchema>>["reset"],
	) {
		if (!event.id) {
			toast.error("Event id not found");
			return;
		}
		const { serverError } = await updateEventAction({
			...values,
			id: event.id,
			event_date: format(new Date(values.event_date), "yyyy-MM-dd"),
			organization_id: event.organization_id,
			organizer_id: event.organizer_id,
		});

		if (serverError) {
			toast.error(serverError);
		} else {
			toast.success("Event updated successfully");
			resetForm();
			setOpen(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<button
					type="button"
					className="ml-auto text-accent-foreground/70 hover:text-accent-foreground transition-colors"
				>
					<Pencil className="w-4 h-4" />
				</button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create new event</DialogTitle>
					<DialogDescription>
						Create a new event to be added to the calendar
					</DialogDescription>
				</DialogHeader>
				<EventForm event={event} onSubmit={onSubmit} />
			</DialogContent>
		</Dialog>
	);
}
