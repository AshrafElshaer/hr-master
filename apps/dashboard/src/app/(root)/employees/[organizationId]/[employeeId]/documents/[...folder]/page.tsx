import { headers } from "next/headers";

import { getSegmentAfterDocuments } from "@/lib/utils";
import { getEmployeeFolders } from "@hr-toolkit/supabase/storage-queries";
import { EMPTY_FOLDER_PLACEHOLDER_FILE_NAME } from "@hr-toolkit/supabase/storage-mutations";

import { columns } from "../components/files-table/columns";
import { DataTable } from "../components/files-table/table";

import UploadZone from "../components/files-table/upload-zone";
import DocumentsNavigation from "../components/navigation";
import { createServerClient } from "@hr-toolkit/supabase/server";

type Props = {
	params: { employeeId: string; organizationId: string; folder: string };
};

export default async function FoldersPage(props: Props) {
	const supabase = createServerClient();
	const pathname = headers().get("x-pathname") ?? "";
	const folderPath = getSegmentAfterDocuments(decodeURI(pathname));

	const filesData = await getEmployeeFolders(
		supabase,
		props.params.organizationId,
		props.params.employeeId,
		folderPath,
	);

	const files = filesData
		.filter((file) => Boolean(file.metadata))
		.filter((file) => file.name !== EMPTY_FOLDER_PLACEHOLDER_FILE_NAME);

	return (
		<section className="w-full flex flex-col h-full p-4">
			<DocumentsNavigation
				organizationId={props.params.organizationId}
				employeeId={props.params.employeeId}
				filesData={filesData}
			/>
			{files.length > 0 ? (
				<DataTable columns={columns} data={files} />
			) : (
				<UploadZone
					organizationId={props.params.organizationId}
					employeeId={props.params.employeeId}
					folderPath={folderPath}
				/>
			)}
		</section>
	);
}
