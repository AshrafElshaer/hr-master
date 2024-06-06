"use client";
import { DEFAULT_STORAGE_FOLDERS } from "@/constants/default-storage-files";
import Link from "next/link";
import { IoIosFolderOpen } from "react-icons/io";
import { FaFolderPlus } from "react-icons/fa6";
import React, { useEffect, useMemo } from "react";
import { cn } from "@hr-toolkit/ui/utils";
import { buttonVariants } from "@hr-toolkit/ui/button";
import { usePathname } from "next/navigation";
import { FolderPlus } from "lucide-react";
import { createClient } from "@hr-toolkit/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { getEmployeeById } from "@hr-toolkit/supabase/user-queries";
import { getEmployeeFolders } from "./actions";
import { capitalize } from "lodash";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@hr-toolkit/ui/breadcrumb";

type Props = {
	employeeId: string;
};

export default function DocumentsNavigation({ employeeId }: Props) {
	const pathname = usePathname();
	const searchedFolder = useMemo(
		() => getSegmentAfterDocuments(pathname),
		[pathname],
	);

	const { data, error, refetch } = useQuery({
		queryKey: ["employee", "employee_folders", employeeId],
		queryFn: () => getEmployeeFolders(employeeId, searchedFolder),
	});
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		refetch();
		console.log({ searchedFolder });
	}, [searchedFolder]);

	const folders = data
		?.filter((folder) => Boolean(!folder.metadata))
		.map((folder) => folder.name);

	return (
		<section className="w-full flex flex-col gap-4 ">
			<div className="w-full flex items-center gap-4 ">
				{Array.from(folders ?? []).map((folder) => {
					const isActivePath = pathname.endsWith(folder);
					return (
						<Link
							key={folder}
							className={cn(
								buttonVariants({
									variant: "ghost",
								}),
								"flex flex-col items-center hover:bg-background",
								isActivePath && "text-foreground",
							)}
							href={`${pathname}/${folder}`}
						>
							<IoIosFolderOpen className="w-10 h-10 sm:w-14 sm:h-14" />
							{capitalize(folder)}
						</Link>
					);
				})}
				<button
					type="button"
					className="flex flex-col items-center text-foreground/70 text-sm"
				>
					<FolderPlus className="w-10 h-10 sm:w-14 sm:h-14" />
					Add Folder
				</button>
			</div>
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink>
							<Link href={`/employees/${employeeId}/documents`}>All</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					{searchedFolder
						.split("/")
						.slice(0, -1)
						.map((folder, idx) => (
							<>
								<BreadcrumbItem key={folder}>
									<BreadcrumbLink>
										<Link href={`/employees/${employeeId}/documents/${searchedFolder.split("/").slice(0, idx + 1).join("/")}`}
										>
											{capitalize(folder)}</Link>
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator key={folder} />
							</>
						))}

					<BreadcrumbItem>
						<BreadcrumbPage>
							{capitalize(searchedFolder.split("/").at(-1))}
						</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		</section>
	);
}

function getSegmentAfterDocuments(pathname: string) {
	const pathSegments = pathname.split("/");
	const documentsIndex = pathSegments.indexOf("documents");
	return documentsIndex !== -1 && documentsIndex + 1 < pathSegments.length
		? pathSegments.slice(documentsIndex + 1).join("/")
		: "";
}
