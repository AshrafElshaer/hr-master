"use client";
import { sidebarNavigations } from "@/constants/sidebar-navigations";
import type { ReactSetState } from "@/types";
import { buttonVariants } from "@hr-toolkit/ui/button";
import { cn } from "@hr-toolkit/ui/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function MainSidebar({
	setIsMobileOpen,
}: {
	setIsMobileOpen?: ReactSetState<boolean>;
}) {
	const pathname = usePathname();

	return (
		<nav className="w-full h-full">
			<ul className="flex flex-col items-start justify-start h-full gap-1 p-2">
				{sidebarNavigations.map((route) => {
					const isActivePath =
						pathname === route.path ||
						route.path === pathname.split("/").slice(0, 3).join("/");
					// console.log({ isActivePath, pathname });
					return (
						<li key={route.path} className="w-full justify-start">
							<Link
								href={route.path}
								className={cn(
									buttonVariants({
										variant: isActivePath ? "secondary" : "ghost",
										className: "w-full justify-start gap-2 relative",
									}),
								)}
								onClick={() => {
									setIsMobileOpen?.(false);
								}}
							>
								{route.icon}
								{route.title}
								{isActivePath ? (
									<div className="absolute right-0 top-1 bottom-1 w-[1.5px] rounded-l bg-primary" />
								) : null}
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}

export default MainSidebar;
