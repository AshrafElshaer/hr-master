"use client";
import type React from "react";
import {
	HydrationBoundary,
	QueryClientProvider,
	dehydrate,
} from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function ReactQuery({
	children,
}: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<HydrationBoundary state={dehydrate(queryClient)}>
				{children}
			</HydrationBoundary>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
