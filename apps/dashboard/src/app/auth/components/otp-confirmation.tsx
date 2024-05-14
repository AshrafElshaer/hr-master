import React, { useEffect, useState } from "react";
import { verifyOtp } from "../actions/verify-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { toast } from "sonner";

import type { EmailOtpConfirmation, ReactSetState } from "@/types";

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

export function OtpConfirmation({ confirmation }: Props) {
	const [isLoading, setIsLoading] = useState(false);
	const [resendTimer, setResendTimer] = useState(60);

	useEffect(() => {
		const timer = setInterval(() => {
			setResendTimer((prev) => prev - 1);
		}, 1000);
		return () => {
			clearInterval(timer);
		};
	}, []);

	async function onComplete(otp: string) {
		setIsLoading(true);
		const { serverError, validationError } = await verifyOtp({
			email: confirmation.user?.email ?? "",
			otpCode: otp,
		});
		setIsLoading(false);
		if (serverError) {
			toast.error("Error verifying OTP:", {
				description: serverError,
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
				<Button variant={"secondary"} disabled={isLoading || resendTimer !== 0}>
					{!isLoading && resendTimer === 0 ? "Resend Passcode" : null}
					{!isLoading && resendTimer !== 0
						? `Resend Passcode in ${resendTimer}s`
						: null}
					{isLoading ? (
						<>
							<Loader className="mr-2 h-4 w-4 animate-spin" />
							Verifying Passcode ...
						</>
					) : null}
				</Button>
			</CardFooter>
		</Card>
	);
}
