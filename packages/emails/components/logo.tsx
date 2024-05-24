import React from "react";
import { Img } from "@react-email/components";

const baseUrl = "https://hr-toolkit-dashboard.vercel.app";

export default function Logo() {
	return (
		<>
			<Img
				src={`${baseUrl}/logo-png-dark.png`}
				alt="HR Toolkit"
				className="dark:hidden"
			/>
			<Img
				src={`${baseUrl}/logo-png-light.png`}
				alt="HR Toolkit"
				className="hidden dark:block mx-auto h-14 w-14"
			/>
		</>
	);
}
