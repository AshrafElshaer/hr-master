"use client"
import { DEFAULT_STORAGE_FOLDERS } from "@/constants/default-storage-files";
import Link from "next/link";
import { IoIosFolderOpen } from "react-icons/io";
import { FaFolderPlus } from "react-icons/fa6";
import React from "react";
import { cn } from "@hr-toolkit/ui/utils";
import { buttonVariants } from "@hr-toolkit/ui/button";
import { usePathname } from "next/navigation";
import { FolderPlus } from "lucide-react";

type Props = {
	employeeId: string;
};

export default function DocumentsNavigation({ employeeId }: Props) {
	const pathname = usePathname();
	return (
		<section className="w-full flex items-center gap-4 flex-wrap">
			{DEFAULT_STORAGE_FOLDERS.map((folder) => {
				
				const isActivePath = pathname.endsWith(folder.path);
				return(
				<Link
					key={folder.path}
					className={cn(
						buttonVariants({
							variant: "ghost",
						}),
						"flex flex-col items-center hover:bg-background",
						isActivePath && "text-foreground"
					)}
					href={`/employees/${employeeId}/documents/${folder.path}`}
				>
					<IoIosFolderOpen size={60} />
					{folder.name}
				</Link>
			)})}
			<button
			type="button"
			className="flex flex-col items-center text-foreground/70 text-sm">
				<FolderPlus size={60} />
				Add Folder
			</button>
		</section>
	);
}
