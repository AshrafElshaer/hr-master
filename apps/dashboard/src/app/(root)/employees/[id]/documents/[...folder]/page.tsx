import { getSegmentAfterDocuments } from "@/lib/utils";
import { getEmployeeFolders } from "@hr-toolkit/supabase/storage-queries";
import { headers } from "next/headers";
import React from "react";
import { columns } from "../components/files-table/columns";
import { DataTable } from "../components/files-table/table";
import type { StorageFile } from "@hr-toolkit/supabase/types";
import { EMPTY_FOLDER_PLACEHOLDER_FILE_NAME } from "@hr-toolkit/supabase/storage-mutations";
import UploadZone from "../components/files-table/upload-zone";
import { queryClient } from "@/lib/react-query";
import DocumentsNavigation from "../navigation";

type Props = {
	params: { id: string; folder: string };
};

export default async function FoldersPage(props: Props) {
	const pathname = headers().get("x-pathname") ?? "";
	const folderPath = getSegmentAfterDocuments(decodeURI(pathname));
	const files = await getEmployeeFolders(props.params.id, folderPath)
		.then((files) => files.filter((file) => Boolean(file.metadata)))
		.then((files) =>
			files.filter((file) => file.name !== EMPTY_FOLDER_PLACEHOLDER_FILE_NAME),
		)
		.then((files) => files);

	queryClient.prefetchQuery({
		queryKey: ["employee", "employee_folders", props.params.id, pathname],
		queryFn: () => getEmployeeFolders(props.params.id, folderPath),
	});

	return (
		<section className="w-full flex flex-col h-full">
			{files.length > 0 ? (
				<DataTable columns={columns} data={files as unknown as StorageFile[]} />
			) : (
				<UploadZone employeeId={props.params.id} folderPath={folderPath} />
			)}
		</section>
	);
}
