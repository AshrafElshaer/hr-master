"use client";
import React from "react";

import type { EmailOtpConfirmation } from "@/types";

import LoginForm from "./components/login-form";
import { OtpConfirmation } from "./components/otp-confirmation";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
	const [userEmail, setUserEmail] = React.useState<string | null>(null);

	return (
		<main className="grid place-items-center min-h-screen p-4">
			<AnimatePresence mode="wait">
				{userEmail ? (
					<motion.div
						key={"otp-confirmation"}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.2 }}
						className="w-full max-w-sm"
					>
						<OtpConfirmation
							setUserEmail={setUserEmail}
							userEmail={userEmail}
						/>
					</motion.div>
				) : (
					<motion.div
						key={"login-form"}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.2 }}
						className="w-full max-w-sm"
					>
						<LoginForm setUserEmail={setUserEmail} />
					</motion.div>
				)}
			</AnimatePresence>
		</main>
	);
}
