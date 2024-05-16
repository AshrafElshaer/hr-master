import { createServerClient } from "@hr-toolkit/supabase/server";
import { getUser } from "@hr-toolkit/supabase/user-queries";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ResizablePanel, ResizablePanelGroup } from "@hr-toolkit/ui/resizable";

import type { ReactNode } from "react";
import MainSidebar from "@/components/main-sidebar";

async function DashboardLayout({ children }: { children: ReactNode }) {
	const supabase = createServerClient();
	const pathname = headers().get("x-pathname");
	const {
		data: { user },
	} = await getUser(supabase);

	if (!user && pathname !== "/auth") {
		redirect("/auth");
	}
	return (
		<ResizablePanelGroup
			direction="vertical"
			className="w-full rounded-lg border min-h-screen"
		>
			<ResizablePanel
				defaultSize={4}
				className="min-h-[50px] border-b shadow-md"
			>
				{/* <DashbaordHeader /> */}
				header
			</ResizablePanel>

			<ResizablePanel defaultSize={96}>
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel
						defaultSize={1}
						className="border-r min-w-[230px] hidden md:block shadow-md"
					>
						<MainSidebar />
					</ResizablePanel>

					<ResizablePanel defaultSize={99}>{children}</ResizablePanel>
				</ResizablePanelGroup>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}

export default DashboardLayout;
