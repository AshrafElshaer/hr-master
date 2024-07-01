import { createServerClient } from "@hr-toolkit/supabase/server";
import { getUser } from "@hr-toolkit/supabase/user-queries";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function OnboardingLayout({
	children,
}: { children: ReactNode }) {
	const supabase = createServerClient();
	const { user } = await getUser(supabase);

	if (user?.organization_id) {
		redirect("/");
		return null;
	}
	return <>{children}</>;
}
