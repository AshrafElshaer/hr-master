import React from "react";
import type { UserWithDepartment } from "@hr-toolkit/supabase/types";
import { Card, CardContent, CardHeader } from "@hr-toolkit/ui/card";
import { MapPin, Pencil } from "lucide-react";
import { format } from "date-fns";
import { capitalize } from "lodash";
import countryLookup from "country-code-lookup";

type Props = {
	employee: UserWithDepartment;
};

export default function Address({ employee }: Props) {
	return (
		<Card className="w-full p-4 flex-grow  flex flex-col gap-8">
			<CardHeader className="p-0 flex-row items-center gap-2 font-bold">
				<MapPin size={18} />
				<span>Address</span>
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
								Primary Address -
							</span>
							<span>{employee.address}</span>
						</div>

						<div className="flex items-center gap-4">
							<span className="font-semibold text-secondary-foreground/80 text-sm">
								Country -
							</span>
							{employee.country ? (
								<span>
									{countryLookup.byIso(employee.country)?.country ??
										"Not Available"}
								</span>
							) : (
								<span>Not Available</span>
							)}
						</div>
						<div className="flex items-center gap-4">
							<span className="font-semibold text-secondary-foreground/80 text-sm">
								State -
							</span>
							<span>{capitalize(employee.state ?? "")}</span>
						</div>
					</div>
					<div className="w-full flex flex-col  gap-4">
						<div className="flex items-center gap-4">
							<span className="font-semibold text-secondary-foreground/80 text-sm">
								City -
							</span>
							<span>{capitalize(employee.city ?? "")}</span>
						</div>
						<div className="flex items-center gap-4">
							<span className="font-semibold text-secondary-foreground/80 text-sm">
								Zip Code -
							</span>
							{employee.zip_code ? (
								<span>{employee.zip_code}</span>
							) : (
								<span>Not Available</span>
							)}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
