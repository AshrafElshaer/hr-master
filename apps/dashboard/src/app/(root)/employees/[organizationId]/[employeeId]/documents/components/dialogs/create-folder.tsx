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
import { folderNameSchema } from "./rename-folder";

type Props = {
	organizationId: string;
	employeeId: string;
	folderPath: string;
	triggerSize?: "sm" | "default";
};

export default function CreateFolderDialog({
	organizationId,
	employeeId,
	folderPath,
	triggerSize = "default",
}: Props) {
	const [open, setOpen] = React.useState(false);
	const [folderName, setFolderName] = React.useState("");
	const pathname = usePathname();
	const { mutateAsync, isPending, error } = useMutation({
		mutationFn: createFolder,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["employee", "employee_folders", employeeId, pathname],
			});
		},
	});

	async function createNewFolder(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const { data: input, error } = folderNameSchema.safeParse(folderName);

		if (error) {
			return toast.error(error.errors[0].message);
		}

		const { data, serverError } = await mutateAsync({
			organizationId,
			employeeId,
			folderName: input.toLowerCase(),
			folderPath,
		});
		if (serverError) {
			return toast.error(serverError);
		}

		if (data) {
			toast.success("Folder created successfully");
			setOpen(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					className="gap-2 items-center"
					size={triggerSize}
				>
					<FolderPlus className="w-5 h-5" />{" "}
					{triggerSize === "default" && "Create Folder"}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center">
						<FolderPlus className="w-6 h-6 mr-2" /> New Folder At{" "}
						{folderPath === "" ? "root" : folderPath} Directory
					</DialogTitle>
					<DialogDescription>
						Create a new folder in the current directory. Please enter the name
						of the folder you want to create.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={createNewFolder}>
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
									className="flex items-center justify-center w-full"
								>
									<Loader className="h-4 w-4 mr-2 animate-spin" />
									Creating folder...
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
									Create folder
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
