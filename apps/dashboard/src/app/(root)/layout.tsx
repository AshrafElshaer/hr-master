import { createServerClient } from "@hr-toolkit/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

async function DashboardLayout({ children }: { children: ReactNode }) {
	const supabase = createServerClient();
	const pathname = headers().get("x-pathname");

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user && pathname !== "/auth") {
		redirect("/auth");
	}
	return <>{children}</>;
}

export default DashboardLayout;
