import React from "react";
import { useBoolean } from "usehooks-ts";

import { capitalize } from "lodash";
import { cn } from "@hr-toolkit/ui/utils";

import { buttonVariants } from "@hr-toolkit/ui/button";
import Link from "next/link";
import { IoIosFolderOpen } from "react-icons/io";

import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@hr-toolkit/ui/context-menu";

import { Trash } from "lucide-react";
import { CiEdit } from "react-icons/ci";
import RenameFolder from "./dialogs/rename-folder";
import DeleteFolder from "./dialogs/delete-folder";

type Props = {
	folder: string;
	pathname: string;
	organizationId: string;
	folderPath: string;
	employeeId: string;
};

export default function Folder({
	folder,
	organizationId,
	pathname,
	folderPath,
	employeeId,
}: Props) {
	const {
		value: isEdit,
		setFalse: setIsEditFalse,
		setTrue: setIsEditTrue,
		setValue: setIsEdit,
	} = useBoolean(false);

	const {
		value: isDelete,
		setValue: setIsDelete,
		setTrue: setIsDeleteTrue,
	} = useBoolean(false);
	return (
		<>
			<ContextMenu>
				<ContextMenuTrigger asChild>
					<Link
						key={folder}
						className={cn(
							buttonVariants({
								variant: "ghost",
							}),
							"flex flex-col items-center hover:bg-background min-w-fit",
						)}
						href={`${pathname}/${folder}`}
					>
						<IoIosFolderOpen className="w-10 h-10 sm:w-14 sm:h-14" />
						{capitalize(folder)}
					</Link>
				</ContextMenuTrigger>

				<ContextMenuContent loop className="*:cursor-pointer">
					<ContextMenuItem onClick={setIsEditTrue}>
						<CiEdit className="w-5 h-5 mr-1" />
						Rename
					</ContextMenuItem>
					<ContextMenuItem
						className="text-destructive focus:text-destructive "
						onClick={setIsDeleteTrue}
					>
						<Trash className="w-4 h-4 mr-2" />
						Delete
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>
			<RenameFolder
				organizationId={organizationId}
				folderPath={folderPath}
				open={isEdit}
				setOpen={setIsEdit}
				name={folder}
				setIsEditFalse={setIsEditFalse}
				employeeId={employeeId}
			/>
			<DeleteFolder
				organizationId={organizationId}
				isDelete={isDelete}
				setIsDelete={setIsDelete}
				folderPath={folderPath}
				employeeId={employeeId}
				name={folder}
			/>
		</>
	);
}
