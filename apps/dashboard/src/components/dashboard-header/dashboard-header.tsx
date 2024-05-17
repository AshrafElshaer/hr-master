import React from "react";
import LogoSVG from "../logo-svg";
import UserMenu from "./user-menu";
import { ThemeToggle } from "@hr-toolkit/ui/theme-toggle";
import CurrentTime from "./current-time";

export default function DashboardHeader() {
	return (
		<header className="px-2">
			<ul className="flex items-center h-full w-full gap-4">
				<li className="flex items-center gap-2 text-foreground">
					<LogoSVG className="fill-current w-6 h-6" />
					<h1 className="text-lg font-semibold">HR Toolkit</h1>
				</li>
				<li className="ml-auto">
					<CurrentTime />
				</li>
				<li>
					<ThemeToggle />
				</li>
				<li className="flex items-center justify-end gap-2 ">
					<UserMenu />
				</li>
			</ul>
		</header>
	);
}
