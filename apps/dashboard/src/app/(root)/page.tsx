import { createClient } from "@hr-toolkit/supabase/client";
import { Button } from "@hr-toolkit/ui/button";

import { useRouter } from "next/navigation";

export default function Page() {
	return (
		<main className="flex flex-col items-center justify-center h-full ">
			<h1 className="text-4xl font-bold text-center">
				Welcome to your dashboard
			</h1>
		</main>
	);
}
