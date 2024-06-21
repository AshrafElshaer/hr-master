"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { roleBasedNavigations } from "@/constants/sidebar-navigations";
import { cn } from "@hr-toolkit/ui/utils";

import type { ReactSetState } from "@/types";
import type { User } from "@hr-toolkit/supabase/types";

import { buttonVariants } from "@hr-toolkit/ui/button";
import { Separator } from "@hr-toolkit/ui/separator";
import Link from "next/link";

function MainSidebar({
	setIsMobileOpen,
	currentUser,
}: {
	setIsMobileOpen?: ReactSetState<boolean>;
	currentUser: User;
}) {
	const pathname = usePathname();

	return (
		<nav className="w-full h-full">
			<ul className="flex flex-col items-start justify-start h-full gap-1 p-2">
				{roleBasedNavigations(currentUser.role ?? "").map((route, idx) => {
					const isActivePath =
						pathname === route.path ||
						route.path === pathname.split("/").slice(0, 2).join("/");

					return (
						<li key={route.path} className="w-full justify-start">
							<Link
								href={route.path}
								className={cn(
									buttonVariants({
										variant: isActivePath ? "secondary" : "ghost",
										className: "w-full justify-start gap-2 relative",
									}),
									idx === 6 && "mt-6",
									isActivePath && "font-semibold",
								)}
								onClick={() => {
									setIsMobileOpen?.(false);
								}}
							>
								{route.icon}
								{route.title}
								{isActivePath ? (
									<div className="absolute right-0 top-1 bottom-1 w-[3px] rounded-l bg-primary" />
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
