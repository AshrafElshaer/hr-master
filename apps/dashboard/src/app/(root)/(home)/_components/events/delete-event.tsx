import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { deleteEventAction } from "../../actions";

import { toast } from "sonner";

import type { EventWithOrganizerAndDepartment } from "@hr-toolkit/supabase/types";

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@hr-toolkit/ui/alert-dialog";
import { Button } from "@hr-toolkit/ui/button";

import { Loader, Trash } from "lucide-react";

type Props = {
	event: EventWithOrganizerAndDepartment;
};

export default function DeleteEvent({ event }: Props) {
	const [open, setOpen] = useState(false);
	const { mutateAsync, isPending, error } = useMutation({
		mutationFn: deleteEventAction,
	});

	async function handleDelete() {
		if (!event?.id) {
			return null;
		}

		const { data, serverError, validationError } = await mutateAsync(event.id);
		if (serverError || validationError) {
			toast.error(serverError || "An error occurred");
			return;
		}

		toast.success("Event deleted successfully");
		setOpen(false);
	}
	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger>
				<button
					type="button"
					className="ml-auto text-accent-foreground/70 hover:text-accent-foreground transition-colors"
				>
					<Trash className="w-4 h-4" />
				</button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogTitle>
						You want to delete {event.event_name}.
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete this
						event from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button
						variant={"destructive"}
						onClick={handleDelete}
						disabled={isPending}
					>
						{isPending ? (
							<Loader className="h-4 w-4 mr-2 animate-spin" />
						) : null}
						Delete
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
