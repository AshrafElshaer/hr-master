import { useMutation } from "@tanstack/react-query";
import { deleteDepartment } from "../../actions";
import { queryClient } from "@/lib/react-query";
import { toast } from "sonner";

import type { SupabaseClient } from "@hr-toolkit/supabase/types";

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
type Props = {
	department: {
		id: string | undefined;
		name: string | undefined;
	};
	onClose: () => void;
	supabase: SupabaseClient;
	isDelete: boolean;
	toggleIsDelete: () => void;
};
export function DeleteDepartment({
	department,
	isDelete,
	onClose,
	toggleIsDelete,
}: Props) {
	const { mutateAsync, isPending } = useMutation({
		mutationFn: deleteDepartment,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["departments"],
			});
			onClose();
		},
	});

	async function handleDelete() {
		if (!department.id) {
			return null;
		}
		const { data, serverError, validationError } = await mutateAsync({
			id: department.id as string,
		});

		if (serverError) {
			toast.error("An error occurred while deleting the department.", {
				description: serverError,
			});

			return;
		}
		if (validationError) {
			toast.error("An error occurred while deleting the department.");
			return;
		}

		toast.success("The department has been deleted successfully.");
	}
	return (
		<AlertDialog open={isDelete} onOpenChange={toggleIsDelete}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogTitle>
						You wnat to delete {department?.name} department.
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
