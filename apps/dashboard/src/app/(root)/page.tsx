"use client";

import { createClient } from "@hr-toolkit/supabase/client";
import { Button } from "@hr-toolkit/ui/button";
import { ThemeToggle } from "@hr-toolkit/ui/theme-toggle";
import { useRouter } from "next/navigation";

export default function Page() {
	const supabase = createClient();
	const router = useRouter();
	return (
		<main className="flex flex-col items-center justify-center min-h-screen ">
			<h1 className="text-4xl font-bold text-center">
				Welcome to your dashboard
			</h1>
			<Button
				variant="destructive"
				onClick={() => {
					supabase.auth.signOut();
					router.push("/auth");
				}}
			>
				sign out
			</Button>
			<ThemeToggle />
		</main>
	);
}
