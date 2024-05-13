"use client";
import { Button } from "@hr-master/ui/button";
import { ThemeToggle } from "@hr-master/ui/theme-toggle";

export default function Page(): JSX.Element {
	return (
		<main className="flex flex-col items-center justify-between min-h-screen p-24">
			<Button>Click me</Button>
			<ThemeToggle />
		</main>
	);
}
