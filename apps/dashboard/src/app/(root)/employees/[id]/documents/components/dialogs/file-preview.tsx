"use client";

import { formatBytes, getSegmentAfterDocuments } from "@/lib/utils";
import type { StorageFile } from "@hr-toolkit/supabase/types";
import { Button } from "@hr-toolkit/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@hr-toolkit/ui/sheet";
import { format } from "date-fns";
import { FaRegImages } from "react-icons/fa6";
import { ChevronLeft, ChevronRight, Share2, X } from "lucide-react";
import React, { useEffect } from "react";
import { LuDownloadCloud } from "react-icons/lu";
import { FaTrash } from "react-icons/fa";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@hr-toolkit/ui/dropdown-menu";
import { createClient } from "@hr-toolkit/supabase/client";
import { usePathname, useRouter } from "next/navigation";
import { getEmployeeById, getUser } from "@hr-toolkit/supabase/user-queries";
import { useQuery } from "@tanstack/react-query";
import { getSignedUrl } from "@hr-toolkit/supabase/storage-queries";
import { Avatar, AvatarFallback, AvatarImage } from "@hr-toolkit/ui/avatar";
import { FaFile } from "react-icons/fa6";
import { Skeleton } from "@hr-toolkit/ui/skeleton";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import type { OnDocumentLoadSuccess } from "node_modules/react-pdf/dist/esm/shared/types";
import { toast } from "sonner";
import Link from "next/link";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type Props = {
	selectedFile: StorageFile | null;
	setSelectedFile: (value: null) => void;
};

export default function FilePreview({ selectedFile, setSelectedFile }: Props) {
	const [totalPages, setTotalPages] = React.useState(0);
	const [currentPage, setCurrentPage] = React.useState(1);

	const supabase = createClient();
	const pathname = usePathname();
	const router = useRouter();
	const folderPath = getSegmentAfterDocuments(pathname);
	const employeeId = pathname.split("/")[2];

	const { data: previewUrl, isLoading: isPreviewLoading } = useQuery({
		queryKey: ["employee-documents", folderPath, selectedFile?.name],
		queryFn: async () => {
			const { user } = await getUser(supabase);
			const filePath = `/${user?.organization_id}/${employeeId}/${folderPath}/${selectedFile?.name}`;
			const { signedUrl } = await getSignedUrl(supabase, {
				filePath,
				expiresIn: 60 * 2, // 2 minutes
			});
			return signedUrl;
		},
		enabled: Boolean(selectedFile),
	});

	const fileType: string | null = selectedFile?.metadata.mimetype;
	const isPDF = fileType === "application/pdf";
	const isImage = fileType?.startsWith("image/");

	const onDocumentLoadSuccess: OnDocumentLoadSuccess = (document) => {
		setTotalPages(document.numPages);
	};
	async function handleDownload() {
		toast.promise(
			fetch(
				`/api/download?employeeId=${employeeId}&path=${folderPath}&filename=${selectedFile?.name}`,
			),
			{
				loading: "Downloading...",
				success: "Downloaded successfully",
				error: "Failed to download",
			},
		);
	}

	async function handleDelete() {
		const { user } = await getUser(supabase);
		const filePath = `/${user?.organization_id}/${employeeId}/${folderPath}/${selectedFile?.name}`;
		toast.promise(
			supabase.storage.from("employee-documents").remove([filePath]),
			{
				loading: "Deleting file...",
				success: "File deleted successfully",
				error: "Failed to delete file",
				finally: () => {
					setSelectedFile(null);
					router.refresh();
				},
			},
		);
	}

	async function generateShareLink(expiresIn: number) {
		const { user } = await getUser(supabase);
		const filePath = `/${user?.organization_id}/${employeeId}/${folderPath}/${selectedFile?.name}`;
		toast.promise(
			getSignedUrl(supabase, {
				filePath,
				expiresIn,
			}),
			{
				loading: "Generating link...",
				success: (data) => {
					navigator.clipboard.writeText(data.signedUrl);
					return "Link copied to clipboard";
				},
				error: "Failed to generate link",
			},
		);
	}

	return (
		<Sheet
			open={Boolean(selectedFile)}
			onOpenChange={(evt) => evt === false && setSelectedFile(null)}
		>
			<SheetContent side="right" className="w-full max-w-sm">
				<SheetClose className="p-4">
					<X className="h-4 w-4" />
				</SheetClose>
				<div className=" p-4">
					{isPreviewLoading && isPDF && (
						<Skeleton className="mx-auto w-[280px] aspect-[5/7]" />
					)}

					{isPreviewLoading && isImage && (
						<Skeleton className="mx-auto w-3/4 aspect-square" />
					)}

					{previewUrl && isImage && (
						<div className="w-3/4 aspect-square border rounded flex justify-center items-center mx-auto">
							<Avatar className="rounded w-3/4 h-3/4 aspect-square">
								<AvatarImage src={previewUrl} />
								<AvatarFallback className="bg-transparent">
									<FaRegImages className="h-32 w-32 text-muted-foreground" />
								</AvatarFallback>
							</Avatar>
						</div>
					)}

					{previewUrl && isPDF && (
						<div className="w-3/4 flex justify-center items-center mx-auto relative">
							<Document
								file={previewUrl}
								onLoadSuccess={onDocumentLoadSuccess}
								className={"group"}
								loading={
									<Skeleton className="mx-auto w-[280px] aspect-[5/7]" />
								}
								error={
									<div className="mx-auto w-[280px] aspect-[5/7] flex justify-center items-center">
										<FaFile className="h-32 w-32 text-muted-foreground" />
									</div>
								}
							>
								<div className=" w-[280px] aspect-[5/7] overflow-y-scroll scrollbar-muted">
									<Page pageNumber={currentPage} width={265} />
									{totalPages > 1 && (
										<div className="absolute opacity-0 flex group-hover:opacity-100 transition-all items-center bottom-2 right-1/2 translate-x-1/2 bg-[#121212] text-[#FAFAFA] rounded shadow-md   text-xs z-10 gap-2">
											<button
												type="button"
												className="p-2"
												onClick={() =>
													setCurrentPage((prev) => Math.max(prev - 1, 1))
												}
											>
												<ChevronLeft size={16} />
											</button>
											{currentPage} of {totalPages}
											<button
												type="button"
												className="p-2"
												onClick={() =>
													setCurrentPage((prev) =>
														Math.min(prev + 1, totalPages),
													)
												}
											>
												<ChevronRight size={16} />
											</button>
										</div>
									)}
								</div>
							</Document>
						</div>
					)}
				</div>
				<SheetHeader className="p-4">
					<SheetTitle>{selectedFile?.name}</SheetTitle>
					<SheetDescription>
						{selectedFile?.metadata.mimetype} -{" "}
						{formatBytes(selectedFile?.metadata.size)}
					</SheetDescription>
				</SheetHeader>
				<div className="p-4">
					{selectedFile?.created_at && (
						<SheetDescription>
							Added On
							<br />
							{format(
								new Date(selectedFile.created_at),
								"MMM dd, yyyy | hh:mm a",
							)}
						</SheetDescription>
					)}
				</div>
				<div className="flex p-4 items-center gap-2">
					<Link
						href={`/api/download?employeeId=${employeeId}&path=${folderPath}&filename=${selectedFile?.name}`}
						target="_blank"
						download
					>
						<Button variant={"outline"} onClick={handleDownload}>
							<LuDownloadCloud className="h-4 w-4 mr-2" />
							Download
						</Button>
					</Link>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant={"outline"}>
								<Share2 className="h-4 w-4 mr-2" />
								Share
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent side="top">
							<DropdownMenuItem
								onClick={() => generateShareLink(60 * 60 * 24 * 7)}
							>
								Expire in 1 week
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => generateShareLink(60 * 60 * 24 * 30)}
							>
								Expire in 1 month
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => generateShareLink(60 * 60 * 24 * 365)}
							>
								Expire in 1 year
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<Button
						variant={"destructive"}
						className="ml-auto"
						onClick={handleDelete}
					>
						<FaTrash className="h-3 w-3 mr-2" />
						Delete
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
}
