"use client";
import ReactQuery from "./react-query";
import { ThemeProvider } from "./theme";
import { Toaster } from "@hr-toolkit/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ReactQuery>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				{children}
				<Toaster richColors position="top-right" duration={5000} />
			</ThemeProvider>
		</ReactQuery>
	);
}
