"use client";

import { useRouter } from "next/navigation";
import { uploadFile } from "../../actions";

import { FileUploader } from "@/components/uploader";
import { useDocumentPathname } from "@/hooks/useDocumentPathname";

type Props = {
	setOpen?: (open: boolean) => void;
};

function UploadZone({ setOpen }: Props) {
	const router = useRouter();
	const { organizationId, employeeId, folderPath } = useDocumentPathname();

	async function onUpload(files: File[]) {
		const promises = files.map((file) => {
			const formData = new FormData();
			formData.append("file", file);
			formData.append("organizationId", organizationId);
			formData.append("employeeId", employeeId);
			formData.append("folderPath", folderPath);

			return uploadFile(formData);
		});

		await Promise.all(promises);
		router.refresh();

		if (setOpen) {
			setOpen(false);
		}
	}
	return (
		<div className="flex-grow ">
			<FileUploader
				maxFiles={8}
				maxSize={8 * 1024 * 1024} // 8MB
				multiple
				accept={{
					"image/*": [],
					"application/pdf": [],
					"audio/*": [],
					"video/*": [],
				}}
				onUpload={onUpload}
			/>
		</div>
	);
}

export default UploadZone;
