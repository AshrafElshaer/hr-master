"use client";
import React from "react";
import { createClient } from "@hr-toolkit/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@hr-toolkit/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@hr-toolkit/ui/form";
import LogoSVG from "@/components/logo-svg";
import { ThemeToggle } from "@hr-toolkit/ui/theme-toggle";

import { Input } from "@hr-toolkit/ui/input";
import { Button } from "@hr-toolkit/ui/button";
import { Mail } from "lucide-react";
import LoginForm from "./components/login-form";
import type { EmailOtpConfirmation } from "@/types";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
	InputOTPSeparator,
} from "@hr-toolkit/ui/input-otp";

const signinSchema = z.object({
	email: z.string().email({
		message: "Invalid email address",
	}),
});

export default function LoginPage() {
	const [confirmation, setConfirmation] = React.useState<EmailOtpConfirmation>({
		properties: null,
		user: null,
	});

	return (
		<main className="grid place-items-center min-h-screen p-4">
			<Card className="flex flex-col items-center w-full max-w-sm">
				<CardHeader className="flex flex-col items-center w-full">
					<CardTitle>Check your email</CardTitle>
					<CardDescription>We've sent a one time passcode to </CardDescription>
					<CardDescription>
						<strong>{"confirmation.user?.email"}</strong>
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
			{/* {confirmation.properties && confirmation.user ? (
				<Card className="flex flex-col items-center w-full max-w-sm">
					<CardHeader>
						<CardTitle>Check your email</CardTitle>
					</CardHeader>
					<CardContent>
						<CardDescription>
							We've sent a sign-in link to{" "}
							<strong>{confirmation.user.email}</strong>. Click the link in the
							email to sign in.
						</CardDescription>
					</CardContent>
					<CardFooter>
						<Button>Open email</Button>
					</CardFooter>
				</Card>
			) : (
				<LoginForm setConfirmation={setConfirmation} />
			)} */}
		</main>
	);
}
