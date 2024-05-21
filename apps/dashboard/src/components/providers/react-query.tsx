"use client";
import type React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";


export default function ReactQuery({
	children,
}: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			{children}

		</QueryClientProvider>
	);
}
