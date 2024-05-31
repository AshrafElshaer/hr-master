import { createServerClient } from "@hr-toolkit/supabase/server";
import { getUser } from "@hr-toolkit/supabase/user-queries";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ResizablePanel, ResizablePanelGroup } from "@hr-toolkit/ui/resizable";
import DashboardHeader from "@/components/dashboard-header/dashboard-header";

import type { ReactNode } from "react";
import MainSidebar from "@/components/sidebar/main-sidebar";

async function DashboardLayout({ children }: { children: ReactNode }) {
	const supabase = createServerClient();
	const pathname = headers().get("x-pathname");
	const { user } = await getUser(supabase);

	if (!user && pathname !== "/auth") {
		redirect("/auth");
	}
	if (user === null) {
		return null;
	}
	return (
		<ResizablePanelGroup
			direction="vertical"
			className="w-full  border min-h-[100svh]"
		>
			<ResizablePanel defaultSize={4} className="min-h-[50px] border-b grid">
				<DashboardHeader currentUser={user} />
			</ResizablePanel>

			<ResizablePanel defaultSize={96}>
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel
						defaultSize={1}
						className="border-r min-w-[200px] hidden md:block shadow-md"
					>
						<MainSidebar currentUser={user} />
					</ResizablePanel>

					<ResizablePanel defaultSize={99}>{children}</ResizablePanel>
				</ResizablePanelGroup>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}

export default DashboardLayout;
