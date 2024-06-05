import type React from "react";
import DocumentsNavigation from "./navigation";

type Props = {
	children: React.ReactNode;
	params: {
		id: string;
	};
};

export default function EmployeeDocumentsLayout({ params, children }: Props) {
	return (
		<main className="flex flex-col items-center justify-start h-full p-4 ">
			<DocumentsNavigation employeeId={params.id} />
			{children}
		</main>
	);
}
