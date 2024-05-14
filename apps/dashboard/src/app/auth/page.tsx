"use client";
import React from "react";

import type { EmailOtpConfirmation } from "@/types";

import LoginForm from "./components/login-form";
import { OtpConfirmation } from "./components/otp-confirmation";

export default function LoginPage() {
	const [confirmation, setConfirmation] = React.useState<EmailOtpConfirmation>({
		properties: null,
		user: null,
	});

	return (
		<main className="grid place-items-center min-h-screen p-4">
			{confirmation.properties && confirmation.user ? (
				<OtpConfirmation
					confirmation={confirmation}
					setConfirmation={setConfirmation}
				/>
			) : (
				<LoginForm setConfirmation={setConfirmation} />
			)}
		</main>
	);
}
