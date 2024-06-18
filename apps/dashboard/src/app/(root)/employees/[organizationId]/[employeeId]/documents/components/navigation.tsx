"use client";

import Link from "next/link";

import React, { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { capitalize } from "lodash";

import { getSegmentAfterDocuments } from "@/lib/utils";
import { cn } from "@hr-toolkit/ui/utils";

import type { StorageFile } from "@hr-toolkit/supabase/types";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@hr-toolkit/ui/breadcrumb";
import { Input } from "@hr-toolkit/ui/input";
import { UploadFileDialog } from "./dialogs/upload-file";
import { Folders } from "lucide-react";
import CreateFolderDialog from "./dialogs/create-folder";
import Folder from "./folder";

type Props = {
	organizationId: string;
	employeeId: string;
	filesData: StorageFile[] | null;
};

export default function DocumentsNavigation({
	organizationId,
	employeeId,
	filesData,
}: Props) {
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

	const folders = filesData
		?.filter((folder) => Boolean(!folder.metadata))
		.map((folder) => folder.name)
		.filter((folder) => folder?.includes(searchedFolder.toLowerCase()));

	return (
		<section className="w-full flex flex-col gap-4 ">
			<div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
				<div className="flex items-center gap-2 w-full sm:w-auto">
					<div>
						<Input
							placeholder="Search for folder"
							startIcon={Folders}
							value={searchedFolder}
							onChange={(e) => setSearchedFolder(e.target.value)}
							disabled={folders?.length === 0}
						/>
					</div>

					<div className="flex items-center gap-2 sm:hidden ">
						<CreateFolderDialog
							organizationId={organizationId}
							employeeId={employeeId}
							folderPath={folderPath}
							triggerSize="sm"
						/>
						{!!folderPath && (
							<UploadFileDialog
								organizationId={organizationId}
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
									<Link
										href={`/employees/${organizationId}/${employeeId}/documents`}
									>
										Root
									</Link>
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
													href={`/employees/${organizationId}/${employeeId}/documents/${folderPath
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
						organizationId={organizationId}
						employeeId={employeeId}
						folderPath={folderPath}
						triggerSize="sm"
					/>
					{!!folderPath && (
						<UploadFileDialog
							organizationId={organizationId}
							employeeId={employeeId}
							folderPath={folderPath}
						/>
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
				{(folders ?? []).map((folder) => {
					return (
						<Folder
							key={folder}
							organizationId={organizationId}
							folder={folder ?? ""}
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
