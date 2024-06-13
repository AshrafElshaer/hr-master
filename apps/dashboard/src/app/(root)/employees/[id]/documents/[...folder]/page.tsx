import { headers } from "next/headers";

import { getSegmentAfterDocuments } from "@/lib/utils";
import { getEmployeeFolders } from "@hr-toolkit/supabase/storage-queries";
import { EMPTY_FOLDER_PLACEHOLDER_FILE_NAME } from "@hr-toolkit/supabase/storage-mutations";

import { columns } from "../components/files-table/columns";
import { DataTable } from "../components/files-table/table";

import UploadZone from "../components/files-table/upload-zone";
import DocumentsNavigation from "../components/navigation";

type Props = {
	params: { id: string; folder: string };
};

export default async function FoldersPage(props: Props) {
	const pathname = headers().get("x-pathname") ?? "";
	const folderPath = getSegmentAfterDocuments(decodeURI(pathname));

	const filesData = await getEmployeeFolders(props.params.id, folderPath);

	const files = filesData
		.filter((file) => Boolean(file.metadata))
		.filter((file) => file.name !== EMPTY_FOLDER_PLACEHOLDER_FILE_NAME);

	return (
		<section className="w-full flex flex-col h-full p-4">
			<DocumentsNavigation employeeId={props.params.id} filesData={filesData} />
			{files.length > 0 ? (
				<DataTable columns={columns} data={files} />
			) : (
				<UploadZone employeeId={props.params.id} folderPath={folderPath} />
			)}
		</section>
	);
}
