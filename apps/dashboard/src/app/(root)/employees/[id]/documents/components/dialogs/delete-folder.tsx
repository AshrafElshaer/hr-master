import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@hr-toolkit/ui/alert-dialog";
import { Button, buttonVariants } from "@hr-toolkit/ui/button";
import { Input } from "@hr-toolkit/ui/input";
import { capitalize } from "lodash";

import React from "react";
type Props = {
	isDelete: boolean;
	setIsDelete: (value: boolean) => void;
	folderPath: string;
	employeeId: string;
	name: string;
};
function DeleteFolder({
	employeeId,
	folderPath,
	isDelete,
	name,
	setIsDelete,
}: Props) {
	const [confirmName, setConfirmName] = React.useState("");

	return (
		<AlertDialog open={isDelete} onOpenChange={setIsDelete}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete your{" "}
						{capitalize(name)} folder , it's subfolders and remove the data from
						our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<div className="flex flex-col w-full gap-2">
					<p className="text-secondary-foreground/70">
						Please type{" "}
						<span className="p-1 rounded bg-border mx-1 text-foreground select-none">
							{name}
						</span>
						to confirm deletion.
					</p>
					<Input
						placeholder="Folder name"
						value={confirmName}
						onChange={(e) => setConfirmName(e.target.value)}
					/>
				</div>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button disabled={confirmName !== name} variant={"destructive"}>
						Delete
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default DeleteFolder;
