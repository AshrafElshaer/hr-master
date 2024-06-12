"use client";
import { DEFAULT_STORAGE_FOLDERS } from "@/constants/default-storage-files";
import Link from "next/link";
import { IoIosFolderOpen } from "react-icons/io";
import { FaFolderPlus } from "react-icons/fa6";
import React, { useEffect, useMemo } from "react";
import { cn } from "@hr-toolkit/ui/utils";
import { Button, buttonVariants } from "@hr-toolkit/ui/button";
import { usePathname } from "next/navigation";
import { CloudUpload, FolderPlus, Folders, Search } from "lucide-react";
import { createClient } from "@hr-toolkit/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { getEmployeeById } from "@hr-toolkit/supabase/user-queries";
import { getEmployeeFolders } from "@hr-toolkit/supabase/storage-queries";

import { capitalize } from "lodash";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@hr-toolkit/ui/breadcrumb";
import { Skeleton } from "@hr-toolkit/ui/skeleton";
import { Input } from "@hr-toolkit/ui/input";
import CreateFolderDialog from "./components/dialogs/create-folder";
import Folder from "./components/folder";
import { getSegmentAfterDocuments } from "@/lib/utils";
import { UploadFileDialog } from "./components/dialogs/upload-file";

type Props = {
	employeeId: string;
};

export default function DocumentsNavigation({ employeeId }: Props) {
	const pathname = usePathname();
	const folderPath = useMemo(
		() => getSegmentAfterDocuments(decodeURI(pathname)),
		[pathname],
	);

	const [searchedFolder, setSearchedFolder] = React.useState("");

	// biome-ignore lint/correctness/useExhaustiveDependencies: set search when pathname changes
	useEffect(() => {
		setSearchedFolder("");
	}, [pathname]);

	const { data, error, isLoading } = useQuery({
		queryKey: ["employee", "employee_folders", employeeId, pathname],
		queryFn: () => getEmployeeFolders(employeeId, folderPath),
	});

	const folders = data
		?.filter((folder) => Boolean(!folder.metadata))
		.map((folder) => folder.name)
		.filter((folder) => folder.includes(searchedFolder.toLowerCase()));

	return (
		<section className="w-full flex flex-col gap-4 ">
			<div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
				<div className="flex items-center gap-2 ">
					<div>
						<Input
							placeholder="Search for folder"
							startIcon={Folders}
							value={searchedFolder}
							onChange={(e) => setSearchedFolder(e.target.value)}
						/>
					</div>

					<div className="flex items-center gap-2 sm:hidden ">
						<CreateFolderDialog
							employeeId={employeeId}
							folderPath={folderPath}
							triggerSize="sm"
						/>
						{!!folderPath && (
							<UploadFileDialog
								employeeId={employeeId}
								folderPath={folderPath}
							/>
						)}
					</div>
				</div>

				{!pathname.endsWith("documents") && (
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink>
									<Link href={`/employees/${employeeId}/documents`}>All</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							{folderPath
								.split("/")
								.slice(0, -1)
								.map((folder, idx) => (
									<>
										<BreadcrumbItem key={`${folder}-${idx.toString()}`}>
											<BreadcrumbLink>
												<Link
													href={`/employees/${employeeId}/documents/${folderPath
														.split("/")
														.slice(0, idx + 1)
														.join("/")}`}
												>
													{decodeURI(capitalize(folder))}
												</Link>
											</BreadcrumbLink>
										</BreadcrumbItem>
										<BreadcrumbSeparator
											key={`${folder}-separator-${idx.toString()}`}
										/>
									</>
								))}

							<BreadcrumbItem>
								<BreadcrumbPage>
									{decodeURI(capitalize(folderPath.split("/").at(-1)))}
								</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				)}

				<div className="sm:flex items-center gap-2 hidden">
					<CreateFolderDialog
						employeeId={employeeId}
						folderPath={folderPath}
						triggerSize="sm"
					/>
					{!!folderPath && (
						<UploadFileDialog employeeId={employeeId} folderPath={folderPath} />
					)}
				</div>
			</div>
			<div
				className={cn(
					"w-full flex items-center gap-4 ",

					folderPath === ""
						? "flex-wrap"
						: "flex-nowrap overflow-scroll scrollbar-muted",
				)}
			>
				{isLoading
					? Array.from({ length: 5 }).map((_, idx) => (
							<div
								className={cn(
									buttonVariants({
										variant: "ghost",
									}),
									"flex flex-col items-center hover:bg-background",
								)}
								key={idx.toString()}
							>
								<IoIosFolderOpen className="w-10 h-10 sm:w-14 sm:h-14 animate-pulse rounded-md text-primary/10" />
								<Skeleton className="w-3/4 mx-auto h-2" />
							</div>
						))
					: (folders ?? []).map((folder) => {
							return (
								<Folder
									key={folder}
									folder={folder}
									pathname={pathname}
									folderPath={folderPath}
									employeeId={employeeId}
								/>
							);
						})}
			</div>
		</section>
	);
}
