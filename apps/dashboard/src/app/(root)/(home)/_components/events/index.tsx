import React from "react";
import UpcomingEvents from "./upcoming-events";
import { createServerClient } from "@hr-toolkit/supabase/server";
import { getEventsByDate } from "@hr-toolkit/supabase/events-queries";
import { addDays } from "date-fns";

type SearchParams = {
	[key in "events-from" | "events-to"]?: string | undefined;
};

async function Events({
	searchParams,
}: {
	searchParams?: SearchParams;
}) {
	const supabase = createServerClient();

	const from = new Date(searchParams?.["events-from"] || Date.now());
	const to = new Date(searchParams?.["events-to"] || addDays(from, 7));
	const { data, error } = await getEventsByDate(supabase, {
		from,
		to,
	});

	return <UpcomingEvents events={data} />;
}

export default Events;
