"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { capitalize } from "lodash";
import { toast } from "sonner";
import { queryClient } from "@/lib/react-query";
import { createFolder } from "../../actions";

import { Button } from "@hr-toolkit/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@hr-toolkit/ui/dialog";
import { FolderPlus, Loader } from "lucide-react";

import { Input } from "@hr-toolkit/ui/input";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
	employeeId: string;
	folderPath: string;
	name: string;
	open: boolean;
	setOpen: (open: boolean) => void;
	setIsEditFalse: () => void;
};

export default function RenameFolder({
	employeeId,
	folderPath,
	name,
	open,
	setOpen,
	setIsEditFalse,
}: Props) {
	const [folderName, setFolderName] = React.useState(name);
	const pathname = usePathname();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: createFolder,
	});

	// async function createNewFolder() {
	// 	if (!folderName) return toast.error("Folder name is required");

	// 	const { data, serverError } = await mutateAsync({
	// 		employeeId,
	// 		folderName,
	// 		folderPath,
	// 	});
	// 	if (serverError) {
	// 		return toast.error(serverError);
	// 	}
	// 	if (data) {
	// 		toast.success("Folder created successfully");
	// 		setOpen(false);
	// 		queryClient.invalidateQueries({
	// 			queryKey: ["employee", "employee_folders", employeeId, pathname],
	// 		});
	// 	}
	// }

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center">
						<FolderPlus className="w-6 h-6 mr-2" /> Rename {capitalize(name)} Folder
					</DialogTitle>
					<DialogDescription>
						Create a new folder in the current directory. Please enter the name
						of the folder you want to create.
					</DialogDescription>
				</DialogHeader>
				<form>
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
									className="flex items-center w-full"
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
