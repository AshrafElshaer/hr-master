import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/lib/react-query";
import { toast } from "sonner";

import type { UserWithDepartment } from "@hr-toolkit/supabase/types";

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@hr-toolkit/ui/alert-dialog";
import { Button } from "@hr-toolkit/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Loader } from "lucide-react";
import { createClient } from "@hr-toolkit/supabase/client";
import { deleteEmployeeById } from "../../actions";

type Props = {
	employee: UserWithDepartment | null;
	isDelete: boolean;
	onClose: () => void;
	toggleIsDelete: () => void;
};

export default function DeleteEmployee({
	employee,
	isDelete,
	onClose,
	toggleIsDelete,
}: Props) {
	const { mutateAsync, isPending, error } = useMutation({
		mutationFn: deleteEmployeeById,
	});

	async function handleDelete() {
		if (!employee?.id) {
			return null;
		}

		const { data, serverError, validationError } = await mutateAsync({
			id: employee.id,
		});
		if (serverError || validationError) {
			toast.error(serverError || validationError?.id || "An error occurred");
			return;
		}

		toast.success("Employee deleted successfully");
		onClose();
	}
	return (
		<AlertDialog open={isDelete} onOpenChange={toggleIsDelete}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogTitle>
						You wnat to delete {employee?.first_name} {employee?.last_name} .
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete your
						account and remove your data from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button
						variant={"destructive"}
						onClick={handleDelete}
						disabled={isPending}
					>
						<AnimatePresence mode="wait" initial={false}>
							{isPending ? (
								<motion.span
									key="submitting"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.2 }}
									className="flex items-center"
								>
									<Loader className="h-4 w-4 mr-2 animate-spin" />
									Deleting ...
								</motion.span>
							) : (
								<motion.span
									key="submit"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.2 }}
								>
									Delete
								</motion.span>
							)}
						</AnimatePresence>
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
