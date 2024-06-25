export function amPm(time: string) {
	const [hours, minutes] = time.split(":");
	const hoursInt = Number(hours);
	const amPm = hoursInt >= 12 ? "PM" : "AM";
	const hours12 = hoursInt % 12 || 12;
	return `${hours12}:${minutes} ${amPm}`;
}