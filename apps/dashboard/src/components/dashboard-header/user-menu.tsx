"use client";
import React from "react";
import { Skeleton } from "@hr-toolkit/ui/skeleton";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@hr-toolkit/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@hr-toolkit/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@hr-toolkit/supabase/client";
import { getUser } from "@hr-toolkit/supabase/user-queries";
import Link from "next/link";
import { LogOutIcon, MessageSquarePlus, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { BiMessageRoundedAdd } from "react-icons/bi";
import { MdSupportAgent } from "react-icons/md";

export default function UserMenu() {
	const supabase = createClient();
	const router = useRouter();
	const { data, isLoading } = useQuery({
		queryKey: ["user"],
		queryFn: () => getUser(supabase),
	});
	const user = data?.user;

	if (isLoading) {
		return <Skeleton className="h-8 w-8 rounded-full" />;
	}
	if (!user || !user.fisrt_name || !user.last_name) {
		return null;
	}
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Avatar className="h-8 w-8 cursor-pointer">
					<AvatarImage src={user.avatar_url ?? ""} />
					<AvatarFallback>
						{user.fisrt_name[0]}
						{user.last_name[0]}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				sideOffset={14}
				className="right-12 w-52"
				align="end"
			>
				<DropdownMenuLabel>
					{user.fisrt_name} {user.last_name}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />

				<DropdownMenuItem asChild>
					<button
						type="button"
						className="flex w-full items-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
						disabled
					>
						<MdSupportAgent className="h-4 w-4" />
						<span>Support</span>
					</button>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<button
						type="button"
						className="flex w-full items-center space-x-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
						disabled
					>
						<BiMessageRoundedAdd className="h-4 w-4" />
						<span>Feedback</span>
					</button>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link
						href="/settings"
						className="flex items-center space-x-2 cursor-pointer"
					>
						<Settings className="h-4 w-4" />
						<span>Setting</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<button
						type="button"
						className="flex w-full items-center space-x-2 cursor-pointer"
						onClick={() =>
							supabase.auth.signOut().then(() => {
								router.push("/auth");
							})
						}
					>
						<LogOutIcon className="h-4 w-4" />
						<span>Sign out</span>
					</button>
					{/* </SignOutButton> */}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
