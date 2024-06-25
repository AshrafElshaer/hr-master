import { createServerClient } from "@hr-toolkit/supabase/server";
import { getUser } from "@hr-toolkit/supabase/user-queries";
import React from "react";

export default async function WelcomeMessage() {
	const supabase = createServerClient();
	const { user } = await getUser(supabase);
	return (
		<div className="flex flex-col gap-2 justify-center">
			<h1 className="text-3xl font-semibold">
				Welcome back, {user?.first_name}
			</h1>
			<p className="text-sm text-secondary-foreground/70">
				You have 2 upcoming events , 0 pending requests, and 5 unread messages.
			</p>
		</div>
	);
}
