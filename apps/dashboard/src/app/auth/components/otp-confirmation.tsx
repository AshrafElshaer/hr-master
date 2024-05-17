import React, { useEffect, useState } from "react";
import { verifyOtp } from "../actions/verify-otp";
import { sendOtpEmail } from "../actions/send-otp-email";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { toast } from "sonner";

import type { EmailOtpConfirmation, ReactSetState } from "@/types";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@hr-toolkit/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@hr-toolkit/ui/card";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@hr-toolkit/ui/input-otp";
import { Loader } from "lucide-react";

type Props = {
	confirmation: EmailOtpConfirmation;
	setConfirmation: ReactSetState<EmailOtpConfirmation>;
};

export function OtpConfirmation({ confirmation, setConfirmation }: Props) {
	const [isLoading, setIsLoading] = useState(false);
	const [isResended, setIsResended] = useState(false);
	const [isResendingLoading, setIsResendingLoading] = useState(false);
	const [resendTimer, setResendTimer] = useState(60);

	useEffect(() => {
		if (isResended) {
			setResendTimer(60);
			setIsResended(false);
		}
		const timer = setInterval(() => {
			setResendTimer((prev) => (prev === 0 ? 0 : prev - 1));
		}, 1000);
		return () => {
			clearInterval(timer);
		};
	}, [isResended]);

	async function onComplete(otp: string) {
		setIsLoading(true);
		const { serverError, validationError } = await verifyOtp({
			email: confirmation.user?.email ?? "",
			otpCode: otp,
		});
		setIsLoading(false);
		if (serverError) {
			toast.error("Error verifying OTP:", {
				description: "Try to resend the OTP email",
				position: "top-center",
			});
			return;
		}
		if (validationError) {
			toast.error("Error verifying OTP:", {
				description: validationError.email || validationError.otpCode,
				position: "top-center",
			});
			return;
		}
	}
	async function resendOtp() {
		setIsResendingLoading(true);
		setIsResended(true);
		const { data, serverError, validationError } = await sendOtpEmail({
			email: confirmation.user?.email ?? "",
		});

		if (serverError) {
			toast.error("Failed to send OTP email", {
				description: serverError,
				position: "top-center",
			});
			setIsResendingLoading(false);
			return;
		}
		if (validationError) {
			toast.error("Invalid email address", {
				position: "top-center",
			});
			setIsResendingLoading(false);
			return;
		}
		if (data) {
			setConfirmation(data);
		}
		setIsResendingLoading(false);
	}

	// async function verifyOtp(otp: string) {
	// 	if (!confirmation.user?.email) {
	// 		return;
	// 	}
	// 	const { data, error } = await supabase.auth.verifyOtp({
	// 		email: confirmation.user?.email,
	// 		token: otp,
	// 		type: "magiclink",
	// 	});
	// 	if (error) {
	// 		toast.error("Error verifying OTP:", {
	// 			description: error.message,
	// 			position: "top-center",
	// 		});
	// 		return;
	// 	}
	// 	if (data.session && data.user) {
	// 		router.push("/");
	// 	}
	// }
	return (
		<Card className="flex flex-col items-center w-full max-w-sm">
			<CardHeader className="flex flex-col items-center w-full">
				<CardTitle>Check your email</CardTitle>
				<CardDescription>We've sent a one time passcode to </CardDescription>
				<CardDescription>
					<strong>{confirmation.user?.email}</strong>
				</CardDescription>
				<Button
					variant="outline"
					size="sm"
					className="text-secondary-foreground/70"
					onClick={() => setConfirmation({ properties: null, user: null })}
				>
					Wrong email -&gt; change it
				</Button>
			</CardHeader>
			<CardContent>
				<h2 className=" font-semibold text-center mb-6">
					Enter the passcode to sign in
				</h2>
				<InputOTP
					maxLength={6}
					pattern={REGEXP_ONLY_DIGITS}
					onComplete={onComplete}
					autoFocus
				>
					<InputOTPGroup>
						<InputOTPSlot index={0} />
						<InputOTPSlot index={1} />
						<InputOTPSlot index={2} />
					</InputOTPGroup>
					<InputOTPSeparator />
					<InputOTPGroup>
						<InputOTPSlot index={3} />
						<InputOTPSlot index={4} />
						<InputOTPSlot index={5} />
					</InputOTPGroup>
				</InputOTP>
			</CardContent>
			<CardFooter className="w-full grid ">
				<Button
					variant={"secondary"}
					disabled={isLoading || resendTimer !== 0 || isResendingLoading}
					onClick={resendOtp}
				>
					<AnimatePresence mode="wait" initial={false}>
						{!isLoading && resendTimer === 0 && (
							<motion.span
								key="resend-passcode"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.2 }}
							>
								Resend Passcode
							</motion.span>
						)}
						{!isLoading && !isResendingLoading && resendTimer !== 0 && (
							<motion.span
								key="resend-timer"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.2 }}
							>
								{`Resend Passcode in ${resendTimer}s`}
							</motion.span>
						)}
						{isLoading && (
							<motion.div
								key="verifying-otp"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.2 }}
								className="flex items-center justify-center w-full"
							>
								<Loader className="mr-2 h-4 w-4 animate-spin" />
								Verifying Passcode ...
							</motion.div>
						)}
						{isResendingLoading && (
							<motion.div
								key="resending-passcode"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.2 }}
								className="flex items-center justify-center w-full"
							>
								<Loader className="mr-2 h-4 w-4 animate-spin" />
								Resending Passcode ...
							</motion.div>
						)}
					</AnimatePresence>
				</Button>
			</CardFooter>
		</Card>
	);
}
