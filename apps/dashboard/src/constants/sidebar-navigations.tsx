import { Clock, Home, Users } from "lucide-react";
import { TbCalendarPause } from "react-icons/tb";
import { HiOutlineBanknotes } from "react-icons/hi2";

export const sidebarNavigations = [
	{
		title: "Dashboard",
		path: "/",
		icon: <Home size={18} />,
	},
	{
		title: "Employees",
		path: "/employees",
		icon: <Users size={18} />,
	},
	{
		title: "Attendance",
		path: "/attendance",
		icon: <Clock size={18} />,
	},
	{
		title: "Time Off",
		path: "/time-off",
		icon: <TbCalendarPause size={18} />,
	},
	{
		title: "Payroll",
		path: "/payroll",
		icon: <HiOutlineBanknotes size={18} />,
	},
];
