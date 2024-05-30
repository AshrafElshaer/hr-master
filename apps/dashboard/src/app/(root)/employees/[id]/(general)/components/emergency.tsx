import React from "react";
import type { UserWithDepartment } from "@hr-toolkit/supabase/types";
import { Card, CardContent, CardHeader } from "@hr-toolkit/ui/card";
import { Pencil, Zap } from "lucide-react";
import { capitalize } from "lodash";

type Props = {
	employee: UserWithDepartment;
};

export default function Emergency({ employee }: Props) {
	return (
		<Card className="w-full p-4 flex-grow flex flex-col gap-8">
			<CardHeader className="p-0 flex-row items-center gap-2 font-bold">
				<Zap size={18} />
				<span>Emergency Contact</span>
				<button
					type="button"
					className="ml-auto text-accent-foreground/70 hover:text-accent-foreground transition-colors"
				>
					<Pencil size={18} />
				</button>
			</CardHeader>
			<CardContent className="p-0">
				<div className="flex flex-col gap-4 lg:flex-row">
					<div className="w-full flex flex-col justify-between gap-4">
						<div className="flex items-center gap-4">
							<span className="font-semibold text-secondary-foreground/80 text-sm">
								Full Name -
							</span>
							<span>{employee.emergency_name}</span>
						</div>

						<div className="flex items-center gap-4">
							<span className="font-semibold text-secondary-foreground/80 text-sm">
								Relation -
							</span>

							<span>{employee.emergency_relation}</span>
						</div>
					</div>
					<div className="w-full flex flex-col  gap-4">
						<div className="flex items-center gap-4">
							<span className="font-semibold text-secondary-foreground/80 text-sm">
								Phone Number -
							</span>
							<span>{employee.emergency_phone_number}</span>
						</div>
						<div className="flex items-center gap-4">
							<span className="font-semibold text-secondary-foreground/80 text-sm">
								Email -
							</span>

							<span>{employee.emergency_email}</span>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
