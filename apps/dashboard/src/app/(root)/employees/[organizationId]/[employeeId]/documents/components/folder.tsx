import React, { useEffect, useRef } from "react";
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
import type { FolderProps } from "./navigation";
import type { ReactSetState } from "@/types";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@hr-toolkit/ui/form";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { createFolder } from "../actions";
import { queryClient } from "@/lib/react-query";
import { useDocumentPathname } from "@/hooks/useDocumentPathname";

type Props = {
	folder: FolderProps;
	setFolders: ReactSetState<FolderProps[]>;
};

const formSchema = z.object({
	name: z
		.string()
		.min(3, {
			message: "Folder name must be at least 3 characters",
		})
		.refine((value) => !/[/\\]/.test(value), {
			message: "Folder name cannot contain / or \\",
		}),
});

export default function Folder({ folder, setFolders }: Props) {
	const { organizationId, employeeId, folderPath, pathname } =
		useDocumentPathname();
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
	const { mutateAsync } = useMutation({
		mutationFn: createFolder,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["employee", "employee_folders", employeeId, pathname],
			});
		},
	});

	const form = useForm<z.infer<typeof formSchema>>({
		defaultValues: {
			name: "",
		},
	});
	async function onSubmit(values: z.infer<typeof formSchema>) {
		const { data: input, error } = formSchema.safeParse(values);

		if (error) {
			return toast.error(error.errors[0].message);
		}
		const { data, serverError } = await mutateAsync({
			organizationId,
			employeeId,
			folderName: input.name.toLowerCase(),
			folderPath,
		});
		if (serverError) {
			return toast.error(serverError);
		}

		if (data) {
			toast.success("Folder created successfully");
			setFolders((prev) => {
				const newFolders = [...prev];
				newFolders.pop();
				return [
					...newFolders,
					{
						name: input.name,
						isNew: false,
						isCreated: true,
					},
				];
			});
		}
	}

	useEffect(() => {
		if (folder.isNew) {
			form.setFocus("name");
		}
	}, [folder.isNew, form.setFocus]);

	if (folder.isNew) {
		return (
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className={cn(
						"flex flex-col justify-center items-center ",
						form.formState.isSubmitting && "animate-pulse opacity-50",
					)}
				>
					<IoIosFolderOpen className="w-10 h-10 sm:w-14 sm:h-14" />
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<input
										placeholder="Untitled folder"
										className="w-24 rounded text-base sm:text-sm text-center focus:outline-none bg-transparent placeholder:text-foreground/30"
										disabled={form.formState.isSubmitting}
										{...field}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
				</form>
			</Form>
		);
	}
	return (
		<>
			<ContextMenu>
				<ContextMenuTrigger asChild>
					<Link
						className={cn(
							buttonVariants({
								variant: "ghost",
							}),
							"flex flex-col items-center hover:bg-background min-w-fit",
						)}
						href={`${pathname}/${folder.name}`}
					>
						<IoIosFolderOpen className="w-10 h-10 sm:w-14 sm:h-14" />
						{capitalize(folder.name)}
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
				open={isEdit}
				setOpen={setIsEdit}
				name={folder.name}
				setIsEditFalse={setIsEditFalse}
			/>
			<DeleteFolder
				isDelete={isDelete}
				setIsDelete={setIsDelete}
				name={folder.name}
			/>
		</>
	);
}
