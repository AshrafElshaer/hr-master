"use client";
import React from "react";
import {
	Sheet,
	SheetTrigger,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
	SheetClose,
} from "@hr-toolkit/ui/sheet";
import { PanelLeftOpen, X } from "lucide-react";
import LogoSVG from "../logo-svg";
import MainSidebar from "./main-sidebar";

export default function MobileSidebar() {
	const [isOpen, setIsOpen] = React.useState(false);
	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger className="h-full">
				<PanelLeftOpen size={20} />
			</SheetTrigger>
			<SheetContent side="left" className="w-[20rem]">
				<SheetHeader className="mb-4">
					<section className="flex justify-between items-center">
						<SheetTitle className="flex items-center gap-2">
							<LogoSVG className="fill-current w-6 h-6" />
							<h1 className="text-lg font-semibold">HR Toolkit</h1>
						</SheetTitle>
						<SheetClose>
							<X size={18} />
						</SheetClose>
					</section>
				</SheetHeader>
				<MainSidebar setIsMobileOpen={setIsOpen} />
			</SheetContent>
		</Sheet>
	);
}
