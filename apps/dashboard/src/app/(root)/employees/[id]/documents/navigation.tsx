"use client";
import { DEFAULT_STORAGE_FOLDERS } from "@/constants/default-storage-files";
import Link from "next/link";
import { IoIosFolderOpen } from "react-icons/io";
import { FaFolderPlus } from "react-icons/fa6";
import React, { useEffect, useMemo } from "react";
import { cn } from "@hr-toolkit/ui/utils";
import { Button, buttonVariants } from "@hr-toolkit/ui/button";
import { usePathname } from "next/navigation";
import { FolderPlus, Search } from "lucide-react";
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
import { Skeleton } from "@hr-toolkit/ui/skeleton";
import { Input } from "@hr-toolkit/ui/input";

type Props = {
	employeeId: string;
};

export default function DocumentsNavigation({ employeeId }: Props) {
	const pathname = usePathname();
	const folderRoute = useMemo(
		() => getSegmentAfterDocuments(pathname),
		[pathname],
	);

	const [searchedFolder, setSearchedFolder] = React.useState("");
	
	useEffect(() => {
		setSearchedFolder("");
	}, [pathname]);

	const { data, error, isLoading } = useQuery({
		queryKey: ["employee", "employee_folders", employeeId, folderRoute],
		queryFn: () => getEmployeeFolders(employeeId, folderRoute),
	});

	const folders = data
		?.filter((folder) => Boolean(!folder.metadata))
		.map((folder) => folder.name)
		.filter((folder) => folder.includes(searchedFolder));

	return (
		<section className="w-full flex flex-col gap-4 ">
			<div className="w-full flex flex-col sm:flex-row items-center gap-4 justify-between">
				<div className="flex items-center gap-2">
					<Input
						placeholder="Search for folder"
						startIcon={Search}
						value={searchedFolder}
						onChange={(e) => setSearchedFolder(e.target.value)}
					/>
					<div className="flex items-center gap-2 sm:hidden">
						<Button variant="outline" size="icon">
							<FolderPlus className="w-4 h-4" />
						</Button>
						<Button variant="outline">Upload</Button>
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
							{folderRoute
								.split("/")
								.slice(0, -1)
								.map((folder, idx) => (
									<>
										<BreadcrumbItem key={`${folder}-${idx.toString()}`}>
											<BreadcrumbLink>
												<Link
													href={`/employees/${employeeId}/documents/${folderRoute
														.split("/")
														.slice(0, idx + 1)
														.join("/")}`}
												>
													{capitalize(folder)}
												</Link>
											</BreadcrumbLink>
										</BreadcrumbItem>
										<BreadcrumbSeparator key={`${folder}-${idx.toString()}`} />
									</>
								))}

							<BreadcrumbItem>
								<BreadcrumbPage>
									{capitalize(folderRoute.split("/").at(-1))}
								</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				)}

				<div className="sm:flex items-center gap-2 hidden">
					<Button variant="outline" size="icon">
						<FolderPlus className="w-4 h-4" />
					</Button>
					<Button variant="outline">Upload</Button>
				</div>
			</div>
			<div className="w-full flex items-center gap-4 ">
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
			</div>
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
