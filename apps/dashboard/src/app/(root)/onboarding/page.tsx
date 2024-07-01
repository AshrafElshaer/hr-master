"use client";
import React, { useEffect, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import OnboardingForm from "./components/onboarding";
import { TextGenerateEffect } from "@/components/text-generate-effect";

export default function OnboardingPage() {
	const [isAnimating, setIsAnimating] = useState(true);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setIsAnimating(false);
		}, 5000);

		return () => {
			clearTimeout(timeout);
		};
	}, []);

	return (
		<main className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
			<AnimatePresence mode="wait">
				{isAnimating ? (
					<motion.div
						key={"welcome-message"}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.4 }}
					>
						<TextGenerateEffect
							words="Welcome to HR Toolkit! We're thrilled to have you onboard. Next, we need more information to set you up for success."
							className="max-w-2xl"
						/>
					</motion.div>
				) : (
					<motion.div
						key={"onboarding-form"}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.4 }}
					>
						<OnboardingForm />
					</motion.div>
				)}
			</AnimatePresence>
		</main>
	);
}
