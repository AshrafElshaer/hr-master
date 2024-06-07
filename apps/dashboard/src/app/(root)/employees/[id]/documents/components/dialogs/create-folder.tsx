"use client";
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
import { useMutation } from "@tanstack/react-query";
import { FolderPlus } from "lucide-react";

import React from "react";
import { createFolder } from "../../actions";
import { Input } from "@hr-toolkit/ui/input";
import { capitalize } from "lodash";
import { toast } from "sonner";
import { queryClient } from "@/lib/react-query";
import { usePathname } from "next/navigation";

type Props = {
	employeeId: string;
	folderPath: string;
};

export default function CreateFolderDialog({ employeeId, folderPath }: Props) {
	const [open, setOpen] = React.useState(false);
	const [folderName, setFolderName] = React.useState("");
	const pathname = usePathname();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: createFolder,
	});

	async function createNewFolder() {
		if (!folderName) return toast.error("Folder name is required");

		const { data, serverError } = await mutateAsync({
			employeeId,
			folderName,
			folderPath,
		});
		if (serverError) {
			return toast.error(serverError);
		}
		if (data) {
			toast.success("Folder created successfully");
			setOpen(false);
			queryClient.invalidateQueries({
				queryKey: ["employee", "employee_folders", employeeId, pathname],
			});
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="icon">
					<FolderPlus className="w-5 h-5" />
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
				<Input
					placeholder="Folder name"
					value={folderName}
					onChange={(e) => setFolderName(e.target.value)}
				/>
				<Button onClick={createNewFolder} disabled={isPending}>
					Create folder
				</Button>
				<DialogClose asChild>
					<Button variant="outline" className="w-full">
						Cancel
					</Button>
				</DialogClose>
			</DialogContent>
		</Dialog>
	);
}
