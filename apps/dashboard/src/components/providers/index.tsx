"use client";

import ReactQuery from "./react-query";
import { ThemeProvider } from "./theme";
import { Toaster } from "@hr-toolkit/ui/sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { env } from "@hr-toolkit/env";

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
				{env.NEXT_PUBLIC_NODE_ENV === "production" && <SpeedInsights />}
			</ThemeProvider>
		</ReactQuery>
	);
}
