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
import { useBoolean, useCountdown } from "usehooks-ts";

type Props = {
	userEmail: string | null;
	setUserEmail: ReactSetState<string | null>;
};

export function OtpConfirmation({ userEmail, setUserEmail }: Props) {
	const [
		resendTimer,
		{ resetCountdown: resetResendTimer, startCountdown: startResendTimer },
	] = useCountdown({
		countStart: 59,
		intervalMs: 1000,
	});
	const {
		value: isVerifying,
		setFalse: setIsVerifyingFalse,
		setTrue: setIsVerifyingTrue,
	} = useBoolean(false);
	const {
		value: isResending,
		setFalse: setIsResendingFalse,
		setTrue: setIsResendingTrue,
	} = useBoolean(false);

	useEffect(() => {
		startResendTimer();
	}, [startResendTimer]);

	async function onComplete(otp: string) {
		setIsVerifyingTrue();
		const { serverError, validationError } = await verifyOtp({
			email: userEmail ?? "",
			otpCode: otp,
		});
		setIsVerifyingFalse();
		if (serverError) {
			toast.error("Error verifying OTP:", {
				description: "Try to resend the passcode",
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
		setIsResendingTrue();

		const { data, serverError, validationError } = await sendOtpEmail({
			email: userEmail ?? "",
		});

		if (serverError) {
			toast.error("Failed to send OTP email", {
				description: serverError,
				position: "top-center",
			});
			setIsResendingFalse();
			resetResendTimer();
			return;
		}
		if (validationError) {
			toast.error("Invalid email address", {
				position: "top-center",
			});
			setIsResendingFalse();
			resetResendTimer();
			return;
		}
		if (data) {
			setUserEmail(data);
		}
		setIsResendingFalse();
		resetResendTimer();
	}

	return (
		<Card className="flex flex-col items-center w-full max-w-sm">
			<CardHeader className="flex flex-col items-center w-full">
				<CardTitle>Check your email</CardTitle>
				<CardDescription>We've sent a one time passcode to </CardDescription>
				<CardDescription>
					<strong>{userEmail}</strong>
				</CardDescription>
				<Button
					variant="outline"
					size="sm"
					className="text-secondary-foreground/70"
					onClick={() => setUserEmail(null)}
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
					disabled={isVerifying || resendTimer !== 0 || isResending}
					onClick={resendOtp}
				>
					<AnimatePresence mode="wait" initial={false}>
						{!isVerifying && !isResending && resendTimer === 0 && (
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
						{!isVerifying && !isResending && resendTimer !== 0 && (
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
						{isVerifying && (
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
						{isResending && (
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
