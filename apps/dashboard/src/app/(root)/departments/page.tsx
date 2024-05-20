"use client";
import React from "react";
import DepartmentsHeader from "./components/header/departments-header";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@hr-toolkit/supabase/client";
import { getDepartments } from "@hr-toolkit/supabase/departments-queries";

export default function DepartmentsPage() {
	const supabase = createClient();
	const { data } = useQuery({
		queryKey: ["departments"],
		queryFn: () => getDepartments(supabase),
	});

	console.log({ data });
	return (
		<main className="flex flex-col items-center justify-start h-full p-4 gap-4">
			<DepartmentsHeader />
		</main>
	);
}
