"use client";

import { Button } from "@hr-toolkit/ui/button";
import { ThemeToggle } from "@hr-toolkit/ui/theme-toggle";

export default async function Page() {
	return (
		<main className="flex flex-col items-center justify-between min-h-screen p-24">
			<Button>Click me</Button>
			<ThemeToggle />
		</main>
	);
}