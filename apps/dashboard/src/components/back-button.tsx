"use client";
import { useRouter } from "next/navigation";

import { Button } from "@hr-toolkit/ui/button";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ path }: { path?: string }) {
	const router = useRouter();

	return (
		<Button
			variant="outline"
			className="items-center"
			onClick={() => (path ? router.push(path) : router.back())}
		>
			<ArrowLeft className="mr-2 w-4 h-4" />
			Back
		</Button>
	);
}
