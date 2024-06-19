"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { capitalize } from "lodash";
import { toast } from "sonner";
import { queryClient } from "@/lib/react-query";
import { renameFolder } from "../../actions";

import { Button } from "@hr-toolkit/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@hr-toolkit/ui/dialog";
import { FolderPen, Loader } from "lucide-react";

import { Input } from "@hr-toolkit/ui/input";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
	employeeId: string;
	organizationId: string;
	folderPath: string;
	name: string;
	open: boolean;
	setOpen: (open: boolean) => void;
	setIsEditFalse: () => void;
};

const folderNameRegex = /[/\\]/;
export const folderNameSchema = z
	.string()
	.min(3, {
		message: "Folder name must be at least 3 characters",
	})
	.refine((value) => !folderNameRegex.test(value), {
		message: "Folder name cannot contain / or \\",
	});

export default function RenameFolder({
	employeeId,
	organizationId,
	folderPath,
	name,
	open,
	setOpen,
	setIsEditFalse,
}: Props) {
	const [folderName, setFolderName] = React.useState(name);
	const pathname = usePathname();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: renameFolder,
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["employee", "employee_folders", employeeId, pathname],
			});


		},
	});

	async function rename(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const { data: input, error } = folderNameSchema.safeParse(folderName);

		if (error) {
			return toast.error(error.errors[0].message);
		}

		toast.warning(
			"This action might take a while depending on folder size, Please be patient",
		);

		const { data, serverError } = await mutateAsync({
			employeeId,
			organizationId,
			folderName: name,
			folderPath,
			newFolderName: input.toLowerCase(),
		});

		if (serverError) {
			return toast.error(serverError);
		}
		if (data) {
			toast.success(`Folder renamed to ${capitalize(input)} successfully`);
			setIsEditFalse();
		}
	}
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center">
						<FolderPen className="w-6 h-6 mr-2" /> Rename {capitalize(name)}{" "}
						Folder
					</DialogTitle>
					<DialogDescription>
						Create a new folder in the current directory. Please enter the name
						of the folder you want to create.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={rename}>
					<Input
						placeholder="Folder name"
						value={folderName}
						onChange={(e) => setFolderName(e.target.value)}
					/>
					<Button type="submit" disabled={isPending} className="w-full mt-2">
						<AnimatePresence mode="wait" initial={false}>
							{isPending ? (
								<motion.p
									key="submitting"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.2 }}
									className="flex items-center w-full justify-center"
								>
									<Loader className="h-4 w-4 mr-2 animate-spin" />
									Renaming folder...
								</motion.p>
							) : (
								<motion.p
									key="submit"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.2 }}
									className="w-full"
								>
									Rename folder
								</motion.p>
							)}
						</AnimatePresence>
					</Button>
				</form>
				<DialogClose asChild>
					<Button variant="outline" className="w-full">
						Cancel
					</Button>
				</DialogClose>
			</DialogContent>
		</Dialog>
	);
}
