import React from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import type { EmailOtpConfirmation } from "@/types";

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

type Props = {
	confirmation: EmailOtpConfirmation;
};

export function OtpConfirmation({ confirmation }: Props) {
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
					onComplete={(e) => console.log("otp", e, typeof e)}
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
				<Button variant={"secondary"}>Resend Passcode</Button>
			</CardFooter>
		</Card>
	);
}
