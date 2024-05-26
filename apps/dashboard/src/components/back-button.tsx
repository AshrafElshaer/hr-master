"use client";
import { useRouter } from "next/navigation";

import { Button } from "@hr-toolkit/ui/button";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
	const router = useRouter();
	return (
		<Button variant="outline" onClick={router.back}>
			<ArrowLeft className="mr-2 w-4 h-4" />
			Back
		</Button>
	);
}
