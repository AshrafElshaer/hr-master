import type { UserWithDepartment } from "@hr-toolkit/supabase/types";
import React from "react";
import { Card } from "@hr-toolkit/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@hr-toolkit/ui/avatar";
import { Badge } from "@hr-toolkit/ui/badge";
import { capitalize } from "lodash";
import { Mail, Phone, SeparatorHorizontal } from "lucide-react";
import { Separator } from "@hr-toolkit/ui/separator";

type Props = {
	employee: UserWithDepartment;
};

export default function BasicInfo({ employee }: Props) {
	return (
		<Card className="w-full p-4 flex-grow lg:w-1/3 min-w-fit">
			<div className="w-full flex flex-col items-center justify-start gap-2">
				<Avatar className="w-20 h-20 mb-4">
					<AvatarImage src={employee?.avatar_url ?? ""} />
					<AvatarFallback className="text-4xl">
						{employee?.first_name?.[0]}
						{employee?.last_name?.[0]}
					</AvatarFallback>
				</Avatar>
				<h2 className="font-bold text-lg">
					{employee?.first_name} {employee?.last_name}
				</h2>

				<span className="text-accent-foreground/90 mb-2">
					{employee?.department?.name} - {employee?.position}
				</span>
				<Badge
					variant={
						employee?.employment_status === "active"
							? "success"
							: employee?.employment_status === "on-hold"
								? "warning"
								: "destructive"
					}
				>
					{capitalize(employee?.employment_status ?? "")}
				</Badge>
			</div>

			<Separator className="my-5" />

			<div className="flex flex-col gap-2 *:flex *:items-center *:gap-2">
				<span>
					{" "}
					<Mail size={20} /> {employee?.email}
				</span>
				<span>
					<Phone size={20} />
					{employee?.phone_number}
				</span>
			</div>
			<Separator className="my-5" />
			<div className="flex flex-col gap-4 mb-8">
				<h3 className="font-semibold text-base text-accent-foreground/90">
					Department
				</h3>
				<span>
					{employee?.department?.name} - {employee?.department?.description}
				</span>
			</div>
			<div className="flex flex-col gap-4">
				<h3 className="font-semibold text-base text-accent-foreground/90">
					Manager
				</h3>
				<span>
					{employee?.department?.person_in_charge.first_name}{" "}
					{employee?.department?.person_in_charge.last_name}
				</span>
			</div>
		</Card>
	);
}
