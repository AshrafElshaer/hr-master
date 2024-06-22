import ClockInOut from "./_components/clock-in-out";

export default function IndexPage() {
	return (
		<main className="flex flex-col gap-4 h-full p-4">
			 <h2 className="md:text-xl">
				Dashboard
			 </h2>
			<ClockInOut />
		</main>
	);
}
