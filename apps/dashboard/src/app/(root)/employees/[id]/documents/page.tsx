"use client";
import { createServerClient } from "@hr-toolkit/supabase/server";
import React from "react";
import { IoIosFolderOpen } from "react-icons/io";
import CreateFolderDialog from "./components/dialogs/create-folder";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { getEmployeeFolders } from "@hr-toolkit/supabase/storage-queries";
import DocumentsNavigation from "./navigation";

function EmployeeDocuments({ params }: { params: { id: string } }) {
	const employeeId = params.id;
	const pathname = usePathname();
	const { data, error, isLoading } = useQuery({
		queryKey: ["employee", "employee_folders", employeeId, pathname],
		queryFn: () => getEmployeeFolders(employeeId, ""),
	});

	if (isLoading) {
		return null;
	}

	const isEmpty = data?.length === 0;
	return (
		<main className="flex flex-col items-center justify-center h-full p-4 ">
			{isEmpty ? (
				<div className="flex flex-col gap-4 items-center max-w-md">
					<IoIosFolderOpen className="h-52 w-52 text-muted-foreground" />
					<h1 className="text-xl font-bold text-muted-foreground">
						No folder's found
					</h1>
					<p className=" text-center  text-muted-foreground">
						You don't have any folders yet.
						<br />
						Create a folder to start uploading documents.
					</p>
					<CreateFolderDialog employeeId={params.id} folderPath="" />
				</div>
			) : null}
		</main>
	);
}

export default EmployeeDocuments;
