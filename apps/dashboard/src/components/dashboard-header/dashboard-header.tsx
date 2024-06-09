import React from "react";
import LogoSVG from "../logo-svg";
import UserMenu from "./user-menu";
import { ThemeToggle } from "@hr-toolkit/ui/theme-toggle";
import CurrentTime from "./current-time";
import MobileSidebar from "../sidebar/mobile-sidebar";
import type { User } from "@hr-toolkit/supabase/types";

export default function DashboardHeader({
	currentUser,
}: { currentUser: User }) {
	return (
		<header className="px-2 md:px-4">
			<ul className="flex items-center justify-between h-[50px] w-full gap-4">
				<li className="grid h-fit md:hidden">
					<MobileSidebar currentUser={currentUser} />
				</li>
				<li className="flex items-center gap-2 text-foreground">
					<LogoSVG className="fill-current w-6 h-6 select-none" />
					<h1 className="text-lg font-semibold select-none">HR Toolkit</h1>
				</li>
				<li className="ml-auto hidden md:block">
					<CurrentTime />
				</li>

				<li className="flex items-center justify-end gap-2 ">
					<UserMenu currentUser={currentUser} />
				</li>
			</ul>
		</header>
	);
}
