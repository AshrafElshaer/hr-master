"use client";
import React from "react";
import { useMediaQuery } from "usehooks-ts";
import type { EventWithOrganizerAndDepartment } from "@hr-toolkit/supabase/types";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@hr-toolkit/ui/hover-card";
import { capitalize } from "lodash";
import {
	AlarmClock,
	Calendar,
	Info,
	LayoutTemplate,
	MapPin,
	Pencil,
} from "lucide-react";
import { Separator } from "@hr-toolkit/ui/separator";
import { addDays, format } from "date-fns";
import { amPm } from "@/lib/date";
import { Avatar, AvatarFallback, AvatarImage } from "@hr-toolkit/ui/avatar";
import { createClient } from "@hr-toolkit/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@hr-toolkit/supabase/user-queries";
import { CiGrid31 } from "react-icons/ci";
import EditEvent from "./edit-event";
import DeleteEvent from "./delete-event";

type Props = {
	event: EventWithOrganizerAndDepartment;
};

export default function EventCard({ event }: Props) {
	const [open, setOpen] = React.useState(false);
	const [isDialogOpen, setIsDialogOpen] = React.useState(false);
	const isMobile = useMediaQuery("(max-width: 640px)");
	const supabase = createClient();
	const { data: user } = useQuery({
		queryKey: ["user"],
		queryFn: async () => {
			const { error, user } = await getUser(supabase);
			if (error) {
				throw Error(error.message);
			}
			return user;
		},
	});

	return (
		<HoverCard
			key={event.id}
			openDelay={0}
			closeDelay={0}
			open={open}
			onOpenChange={(bol) => isDialogOpen || setOpen(bol)}
		>
			<HoverCardTrigger className=" text-sm text-center py-1 mx-auto">
				{amPm(event.start_time)} - {amPm(event.end_time)}
			</HoverCardTrigger>
			<HoverCardContent
				className="text-sm px-0 py-2 min-w-72"
				side={isMobile ? "top" : "right"}
				align={isMobile ? "center" : "start"}
				sideOffset={isMobile ? 16 : 8}
			>
				<div className="flex flex-col gap-2 ">
					<div className="px-4 text-base flex items-center justify-between">
						<p>{capitalize(event.event_type)}</p>
						{event.organizer.id === user?.id ? (
							<div className="flex items-center gap-2">
								<EditEvent
									event={event}
									open={isDialogOpen}
									setOpen={setIsDialogOpen}
								/>
								<DeleteEvent event={event} />
							</div>
						) : null}
					</div>
					<Separator className="w-full my-1" />
					<p className=" px-4 flex items-center gap-2">
						<Calendar className="w-4 h-4" />
						{format(addDays(event.event_date, 1), "EEEE , MMMM dd")}
					</p>
					<p className=" px-4 flex items-center gap-2  ">
						<AlarmClock className="w-4 h-4" />
						{amPm(event.start_time)} - {amPm(event.end_time)}
					</p>
					<p className=" px-4 flex items-center gap-2 ">
						<Info className="h-4 w-4 " /> Details
					</p>
					<p className="pl-10 pr-4">{event.event_name}</p>
					<p className="pl-10 pr-4">{event.event_description}</p>
					<div className="flex items-center gap-2 px-4">
						<MapPin className="w-4 h-4" />
						<p>{event.location}</p>
					</div>
					<div className="flex items-center gap-2 px-4">
						<LayoutTemplate className="w-4 h-4" />
						<p>
							{event.department.name} - {event.department.description}{" "}
						</p>
					</div>
					<div className="flex items-center gap-2 px-4">
						<Avatar className="h-4 w-4">
							<AvatarImage src={event.organizer.avatar_url ?? ""} />
							<AvatarFallback className="text-xs">
								{event?.organizer?.first_name?.at(0)}{" "}
								{event?.organizer?.last_name?.at(0)}
							</AvatarFallback>
						</Avatar>
						<p>
							{event.organizer.first_name} {event.organizer.last_name}
						</p>
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}
