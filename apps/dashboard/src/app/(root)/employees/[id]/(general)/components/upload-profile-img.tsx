"use client";
import React from "react";
import { Button } from "@hr-toolkit/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@hr-toolkit/ui/dialog";
import { FileUploader } from "@/components/uploader";
import { Camera, Link } from "lucide-react";
import { Input } from "@hr-toolkit/ui/input";
import { uploadProfileImg } from "../actions";
import { useAction } from "next-safe-action/hook";
import { createClient } from "@hr-toolkit/supabase/client";
import { updateEmployeeById } from "@hr-toolkit/supabase/user-mutations";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
	userId: string;
	organizationId: string | null;
};

export default function UploadProfileImg({ userId, organizationId }: Props) {
	const [open, setOpen] = React.useState(false);
	const [files, setFiles] = React.useState<File[]>([]);
	const [url, setUrl] = React.useState<string>("");
	const [isInputError, setIsInputError] = React.useState<boolean>(false);

	if (!organizationId) return null;

	async function saveUrl() {
		setIsInputError(false);
		const validate = z.string().url().safeParse(url);
		if (!validate.success) {
			toast.error("Invalid URL");
			return;
		}

		const supabase = createClient();
		const updated = await updateEmployeeById(supabase, {
			id: userId,
			avatar_url: url,
		});
		if (updated) {
			toast.success("Image url saved successfully");
			setOpen(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<button
					type="button"
					className="invisible group-hover:visible absolute grid place-items-center h-full w-full p-1  rounded-full text-accent-foreground/70 hover:bg-background/70 transition-colors"
				>
					<Camera size={28} />
				</button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>Upload files</DialogTitle>
					<DialogDescription>
						Drag and drop your files here or click to browse.
					</DialogDescription>
				</DialogHeader>
				<FileUploader
					maxFiles={1}
					maxSize={8 * 1024 * 1024}
					onValueChange={setFiles}
					onUpload={async (files) => {
						const formData = new FormData();
						formData.append("file", files[0]);
						formData.append("organizationId", organizationId);
						formData.append("userId", userId);
						const uploaded =
							await uploadProfileImg(
								formData,
							);
						if (!uploaded) {
							setFiles([]);
						}
						if (uploaded) {
							setOpen(false);
						}
					}}
				/>
				{!files.length && (
					<div className="flex w-full gap-2">
						<Input
							placeholder="Provide Image URL"
							value={url}
							onChange={(e) => setUrl(e.target.value)}
							isError={isInputError}
							startIcon={Link}
						/>
						<Button size="sm" onClick={saveUrl}>
							Save
						</Button>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
